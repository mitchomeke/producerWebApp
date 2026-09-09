import express, {Request, Response} from 'express';
import {BEATS_CATALOG} from './beats/beatsFile';
import {SONGS_CATALOG} from './songs/songsFile';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import ffmpeg from 'fluent-ffmpeg';
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
dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());

if (!process.env.STRIPE_SECRET_KEY){
    console.error('FATAL: STRIPE_SECRET_KEY is missing from .env file');
    process.exit(1);
}



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

app.get('/api/beats/preview/:id', async (req,res) => {
    try {
        // @ts-ignore
        const id = Number(req.params.id);
        const beat = BEATS_CATALOG.find(b => b.id === id);
        if (!beat){
            return res.status(404).json({ error: 'Beat not found' });
        }
        const s3Response = await s3.send(
            new GetObjectCommand({
                Bucket: beat.bucketName,
                Key: beat.fileName,
            })
        );
        const fullAudioStream = s3Response.Body as Readable;
        res.setHeader('Content-Type', 'audio/mpeg');
        ffmpeg(fullAudioStream)
            .setDuration(30)
            .audioBitrate(128)
            .format('mp3')
            .on('error', (err) => {
                if (!res.headersSent) res.status(500).end();
            }).pipe(res, {end:true});
    } catch (err){
        console.error(err);
        res.status(500).send('Streaming error');
    }
});
app.get('/api/songs/preview/:id', async (req,res) => {
    try {
        const  id  = Number(req.params.id);
        const song = SONGS_CATALOG.find(s => s.id === id);
        if (!song){
            return res.status(404).json({ error: 'Song not found' });
        }
        const s3Response = await s3.send(
            new GetObjectCommand({
                Bucket: song.bucketName,
                Key: song.fileName,
            })
        );
        const fullAudioStream = s3Response.Body as Readable;
        res.setHeader('Content-Type', 'audio/mpeg');
        ffmpeg(fullAudioStream)
            .setDuration(30)
            .audioBitrate(128)
            .format('mp3')
            .on('error', (err) => {
                if (!res.headersSent) res.status(500).end();
            }).pipe(res, {end:true});
    } catch (err){
        console.error(err);
        res.status(500).send('Streaming error');
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
       res.json({
           title: beat.title,
           customerEmail: session.customer_details?.email,
           downloadUrl: `${beat.audioUrl}/${encodeURIComponent(String(beat.fileName))}`,
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
        res.json({
            title: song.name,
            customerEmail: session.customer_details?.email,
            downloadUrl: `${song.audioUrl}/${encodeURIComponent(String(song.fileName))}`,
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

    app.listen(5000, () => {
        console.log('Node.js server listening on port 5000');
    });
