import express, {Request, Response} from 'express';
import {BEATS_CATALOG} from './beats/beatsFile';
import {SONGS_CATALOG} from './songs/songsFile';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { Resend } from 'resend';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const allowedOrigins: string[] = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://mitchbeats.com',
    'https://www.mitchbeats.com',
    process.env.CLIENT_URL || '',
].filter((url): url is string => Boolean(url));

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            return callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


if (!process.env.STRIPE_SECRET_KEY){
    console.error('FATAL: STRIPE_SECRET_KEY is missing from .env file');
    process.exit(1);
}

export async function createPresignedDownloadUrl(
    bucketName: string,
    downloadFile: string,
    expiresInSeconds: number = 86400
): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: downloadFile,
        ResponseContentDisposition: `attachment; filename="${downloadFile}"`,
    });
    // Generate the signed URL using your existing s3 client instance
    const presignedUrl = await getSignedUrl(s3 as any, command, { expiresIn: expiresInSeconds });
    return presignedUrl;
}

app.post(
    '/api/webhooks/stripe',
    express.raw({ type: 'application/json' }),
    async (req: Request, res: Response) => {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event: Stripe.Event;

        try {
            if (!sig || !endpointSecret) {
                throw new Error('Missing stripe-signature header or STRIPE_WEBHOOK_SECRET env variable');
            }
            // Verify signature using the raw Buffer
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err: any) {
            console.error(`⚠️ Webhook signature verification failed:`, err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle relevant events
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const customerEmail = session.customer_details?.email;

                console.log(`✅ Checkout completed for Session ID: ${session.id}`);

                // 2. Identify what they bought (Beat or Song)
                const beatId = session.metadata?.beatId;
                const songId = session.metadata?.songId;
                let secureDownloadUrl = null;

                let itemName = '';

                if (beatId) {
                    const beat = BEATS_CATALOG.find(b => b.id === Number(beatId));
                    if (beat && customerEmail) {
                        itemName = beat.title;
                        secureDownloadUrl = await createPresignedDownloadUrl(
                            beat.bucketName,
                            beat.downloadFile,
                            86400
                        );
                    }
                } else if (songId) {
                    const song = SONGS_CATALOG.find(s => s.id === Number(songId));
                    if (song && customerEmail) {
                        itemName = song.name;
                        secureDownloadUrl = createPresignedDownloadUrl(
                            song.bucketName,
                            song.downloadFile,
                            86400
                        );
                    }
                }
                if (customerEmail && itemName){
                    try {
                        await resend.emails.send({
                            // NOTE: Until you verify a custom domain in Resend, you MUST use this exact 'from' address
                            from: 'Mitch Beats <onboarding@resend.dev>',
                            // NOTE: Until you verify a domain, you can only send test emails to your OWN email address
                            to: customerEmail,
                            subject: `Your audio file is ready: ${itemName}`,
                            html: `
                                <h2>Thanks for your purchase!</h2>
                                <p>Your payment was successful. You can download your high-quality audio files for <strong>${itemName}</strong> below:</p>
                                <a href="${secureDownloadUrl}" style="display:inline-block; padding:12px 24px; background:#000; color:#fff; text-decoration:none; border-radius:4px; margin-top:10px;">
                                    Download Files
                                </a>
                                <p style="margin-top: 20px; font-size: 12px; color: #666;">
                                    If you have any issues, reply directly to this email.
                                </p>
                            `
                        });
                        console.log(`📧 Delivery email sent to ${customerEmail}`);
                    } catch (emailError){
                        console.error('Failed to send delivery email:', emailError);
                    }
                }
                console.log(`✅ Checkout completed for Session ID: ${session.id}`);
                console.log(`Customer: ${session.customer_details?.email}`);
                console.log(`Item Metadata:`, session.metadata);
                // Trigger fulfillment: save order to database or send delivery email
                break;
            }
            case 'payment_intent.succeeded': {
                console.log('💳 PaymentIntent succeeded');
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).json({ received: true });
    }
);

app.use(express.json());


app.get('/songs',(req: Request, res: Response) => {
    const star = req.query.tier;
    if (!star) {
        return res.json(SONGS_CATALOG);
    }
    const selectedSearch = (req.query.search as string).trim().toLowerCase() || '';
    const selectedGenre = (req.query.selectedGenre as string) || 'all';
    const selectedPrice = (req.query.selectedPrice as string) || 'all';
    const selectedBpm = (req.query.selectedBpm as string) || 'all';
    if (typeof star === "string") {
        const filteredSongs = SONGS_CATALOG.filter(
            (song) => song.tier === parseInt(star, 10)
        );
        const fullyFilteredSongs = filteredSongs.filter(
            (song) => {
                const matchesSearch = !selectedSearch || song.name.includes(selectedSearch);
                const matchesGenre = (() => {
                    if (selectedGenre === "all") return true;
                    else return song.genre.toLowerCase() === selectedGenre.toLowerCase();
                })();
                const matchesBpm = (() => {
                    if (selectedBpm === "all") return true;
                    const [minBpm, maxBpm] = selectedBpm.split("-").map(Number);
                    return song.bpm >= minBpm && song.bpm <= maxBpm;
                })();

                const matchesPrice = (() => {
                    if (selectedPrice === "all") return true;
                    const [minPrice, maxPrice] = selectedPrice.split("-").map(Number);
                    return song.price >= minPrice && song.price <= maxPrice;
                })();
                return matchesSearch && matchesGenre && matchesBpm && matchesPrice;
            });
        return res.json(fullyFilteredSongs);
    }
});


app.get('/beats', (req: Request, res: Response) => {
    const star = req.query.tier;
    if (!star) {
        return res.json(BEATS_CATALOG);
    }
    const selectedSearch = (req.query.search as string).trim().toLowerCase() || '';
    const selectedGenre = (req.query.selectedGenre as string) || 'all';
    const selectedPrice = (req.query.selectedPrice as string) || 'all';
    const selectedBpm = (req.query.selectedBpm as string) || 'all';
    if (typeof star === "string") {
        const filteredBeats = BEATS_CATALOG.filter(
            (beat) => beat.tier === parseInt(star, 10)
        );
        const fullyFilteredBeats = filteredBeats.filter(
            (beat) => {
                const matchesSearch = !selectedSearch || beat.title.toLowerCase().includes(selectedSearch);

                const matchesGenre = (() => {
                    if ( selectedGenre === "all" ){
                        return true;
                    } else return beat.genre.toLowerCase() === selectedGenre.toLowerCase();
                })();
                const matchesBpm = (() => {
                    if (selectedBpm === "all") return true;
                    const [minBpm, maxBpm] = selectedBpm.split("-").map(Number);
                    return beat.bpm >= minBpm && beat.bpm <= maxBpm;
                })();

                const matchesPrice = (() => {
                    if (selectedPrice === "all") return true;
                    const [minPrice, maxPrice] = selectedPrice.split("-").map(Number);
                    return beat.price >= minPrice && beat.price <= maxPrice;
                })();
                return matchesGenre && matchesBpm && matchesPrice && matchesSearch;
            });

       return res.json(fullyFilteredBeats);
    }
});

if (ffmpegStatic) {
    ffmpeg.setFfmpegPath(ffmpegStatic);
}

app.get('/api/beats/preview/:id', async (req: Request, res: Response) => {

    let ffmpegCommand: ffmpeg.FfmpegCommand | null = null;
    let fullAudioStream: Readable | null = null;
    let isAborted = false;

    // Set up connection teardown listener before starting async work
    req.on('close', () => {
        isAborted = true;
        if (ffmpegCommand) {
            try {
                ffmpegCommand.kill('SIGTERM');
            } catch {
                // Process already cleaned up
            }
        }
        if (fullAudioStream && !fullAudioStream.destroyed) {
            fullAudioStream.destroy();
        }
    });

    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid beat ID' });
        }

        const beat = BEATS_CATALOG.find((b) => b.id === id);
        if (!beat) {
            return res.status(404).json({ error: 'Beat not found' });
        }

        // Stop early if client disconnected during catalog lookup
        if (isAborted) return;

        console.log(`[Preview] Fetching key "${beat.fileName}" from bucket "${beat.bucketName}"`);

        const s3Response = await s3.send(
            new GetObjectCommand({
                Bucket: beat.bucketName,
                Key: beat.fileName,
            })
        );

        if (isAborted) return;

        if (!s3Response.Body) {
            return res.status(500).json({ error: 'Audio file body is empty' });
        }

        fullAudioStream = s3Response.Body as Readable;

        // Suppress unhandled stream destroy errors caused by client cancellations
        fullAudioStream.on('error', (streamErr: any) => {
            if (streamErr.code === 'ERR_STREAM_PREMATURE_CLOSE' || isAborted) return;
            console.error('R2 Stream error:', streamErr.message);
        });

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Accept-Ranges', 'none');
        res.setHeader('Connection', 'close'); // Instructs browser not to reuse or pool this socket

        ffmpegCommand = ffmpeg(fullAudioStream)
            .setDuration(30)
            .audioChannels(2)
            .audioFrequency(44100)
            .audioBitrate(128)
            .format('mp3')
            .on('error', (err) => {
                // Silently ignore normal aborts, pauses, socket resets, and kills
                if (
                    isAborted ||
                    err.message.includes('Output stream closed') ||
                    err.message.includes('SIGKILL') ||
                    err.message.includes('premature close') ||
                    err.message.includes('broken pipe')
                ) {
                    return;
                }
                console.error('FFmpeg processing error:', err.message);
                if (!res.headersSent) {
                    res.status(500).end();
                }
            });

        ffmpegCommand.pipe(res, { end: true });
    } catch (err: any) {
        if (!isAborted) {
            console.error('Preview route failed with error:', err.name, err.message);
            if (!res.headersSent) {
                res.status(500).send('Streaming error');
            }
        }
    }
});

if (ffmpegStatic) {
    ffmpeg.setFfmpegPath(ffmpegStatic);
}
app.get('/api/songs/preview/:id', async (req: Request, res: Response) => {
    let ffmpegCommand: ffmpeg.FfmpegCommand | null = null;
    let fullAudioStream: Readable | null = null;
    let isAborted = false;

    // Track if client disconnected
    req.on('close', () => {
        isAborted = true;
        if (ffmpegCommand) {
            try {
                // Send softer SIGTERM or SIGKILL safely
                ffmpegCommand.kill('SIGTERM');
            } catch {
                // Process already cleaned up
            }
        }
        if (fullAudioStream && !fullAudioStream.destroyed) {
            fullAudioStream.destroy();
        }
    });

    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        const song = SONGS_CATALOG.find((s) => s.id === id);
        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }

        // Abort early if client already gave up during ID lookup
        if (isAborted) return;

        const s3Response = await s3.send(
            new GetObjectCommand({
                Bucket: song.bucketName,
                Key: song.fileName,
            })
        );

        if (isAborted) return;

        fullAudioStream = s3Response.Body as Readable;

        // Suppress unhandled stream destroy errors
        fullAudioStream.on('error', (streamErr: any) => {
            if (streamErr.code === 'ERR_STREAM_PREMATURE_CLOSE' || isAborted) return;
            console.error('R2 Stream error:', streamErr.message);
        });

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Accept-Ranges', 'none');
        res.setHeader('Connection', 'close'); // Tells browser not to reuse or pool this dynamic socket

        ffmpegCommand = ffmpeg(fullAudioStream)
            .setDuration(30)
            .audioChannels(2)
            .audioFrequency(44100)
            .audioBitrate(128)
            .format('mp3')
            .on('error', (err) => {
                // Silently ignore expected client disconnects
                if (
                    isAborted ||
                    err.message.includes('Output stream closed') ||
                    err.message.includes('SIGKILL') ||
                    err.message.includes('premature close') ||
                    err.message.includes('broken pipe')
                ) {
                    return;
                }
                console.error('FFmpeg processing error:', err.message);
                if (!res.headersSent) {
                    res.status(500).end();
                }
            });

        ffmpegCommand.pipe(res, { end: true });
    } catch (err: any) {
        if (!isAborted) {
            console.error('Preview error:', err?.message || err);
            if (!res.headersSent) {
                res.status(500).send('Streaming error');
            }
        }
    }
});

app.get('/songs/getSong',(req: Request, res: Response)=> {
    const songId = Number(req.query.id);
    const song = SONGS_CATALOG.find(s => s.id === songId);
    if (!song){
        return res.status(404).json({error: 'Song not found'});
    }
    return res.json(song);
});

app.get('/beats/getBeat',(req: Request, res: Response) => {
    const beatId = Number(req.query.id);
    const beat = BEATS_CATALOG.find(b => b.id === beatId);
    if (!beat){
        return res.status(404).json({error: 'Beat not found'});
    }
    return res.json(beat)
})

app.get('/api/create-checkout-session/beats', async (req, res) => {
    try {
        const {beatId, customerEmail} = req.body;
        const beat = BEATS_CATALOG.find(b => b.id === beatId);
        if (!beat){
            return res.status(404).json({error: 'Beat not found'});
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: customerEmail,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: beat.title,
                        },
                        unit_amount: Math.round(beat.price * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: {
                songId: String(beat.id),
            },
            success_url: `${process.env.CLIENT_URL}/beats/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/beats`,
        });
        res.json({url: session.url});
    } catch (error: any){
        console.log('Stripe errror:', error.message);
        res.status(500).json({error: error.message});
    }
});

app.get('/api/create-checkout-session/songs', async (req, res) => {
    try {
        const {songId, customerEmail} = req.body;
        const song = SONGS_CATALOG.find(s => s.id === songId);
        if (!song){
            return res.status(404).json({error: 'Song not found'});
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: customerEmail,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: song.name,
                        },
                        unit_amount: Math.round(song.price * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: {
                songId: String(song.id),
            },
            success_url: `${process.env.CLIENT_URL}/songs/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/songs`,
        });
        res.json({url: session.url});
    } catch (error: any) {
        console.error('Stripe error:',error.message);
        res.status(500).json({error: error.message});
    }
});

app.get('/api/verify-session/beats', async (req, res) => {
   try {
       const sessionId = req.query;
       if (!sessionId || typeof sessionId !== 'string'){
           return res.status(400).json({error: 'Missing session_id'});
       }
       const session = await stripe.checkout.sessions.retrieve(sessionId);
       if (session.payment_status !== 'paid'){
           return res.status(402).json({ error: 'Payment not completed or pending' });
       }
       const beatId = Number(session.metadata?.beatId);
       const beat = BEATS_CATALOG.find(b => b.id === beatId);
       if (!beat){
           return res.status(404).json({ error: 'Beat not found' });
       }
       const downloadUrl = createPresignedDownloadUrl(
           beat.bucketName,
           beat.downloadFile,
           3600
       );
       res.json({
           title: beat.title,
           customerEmail: session.customer_details?.email,
           downloadUrl,
       });
    } catch (err: any){
       console.error('Session verification error:', err);
       res.status(500).json({ error: 'Failed to verify session' });
   }
});
app.get('/api/verify-session/songs', async (req, res) => {
    try {
        const sessionId = req.query;
        if (!sessionId || typeof sessionId !== 'string'){
            return res.status(400).json({error: 'Missing session_id'});
        }
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== 'paid'){
            return res.status(402).json({ error: 'Payment not completed or pending' });
        }
        const songId = Number(session.metadata?.songId);
        const song = SONGS_CATALOG.find(s => s.id === songId);
        if (!song){
            return res.status(404).json({ error: 'Song not found' });
        }
        const downloadUrl = createPresignedDownloadUrl(
            song.bucketName,
            song.downloadFile,
            3600
        );
        res.json({
            title: song.name,
            customerEmail: session.customer_details?.email,
            downloadUrl,
        });
    } catch (err: any){
        console.error('Session verification error:', err);
        res.status(500).json({ error: 'Failed to verify session' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
})

    app.listen(5000, '0.0.0.0', () => {
        console.log('Node.js server listening on port 5000');
    });
