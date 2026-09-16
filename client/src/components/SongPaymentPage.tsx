import {useNavigate, useSearchParams} from "react-router-dom";
import {useState, useEffect} from "react";
import {API_URL} from "../config.ts";
import * as React from "react";

export default function SongPaymentPage () {
    interface Song {
        id: number;
        name: string;
        price: number;
        bpm: number;
        genre: string;
        youtubeLink?: string;
    }
    const [searchParams] = useSearchParams();
    const songId = searchParams.get('id');
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [song, setSong] = useState<Song | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!songId){
            setError('No song ID provided in URL');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);

        fetch(`${API_URL}/songs/getSong?id=${songId}`)
            .then((res) =>{
                if (!res.ok) throw new Error('Failed to load song');
                return res.json();
            })
            .then((data) => {
                setSong(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message || 'Failed to fetch details');
                setIsLoading(false);
            })
    }, [songId]);
    const handleCheckOut = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !song){
            return;
        }
        setIsProcessing(true);
        try {
            const res = await fetch(`${API_URL}/create-checkout-session/songs`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    songId: song.id,
                    customerEmail: email.trim(),
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to initialize checkout');
            }
            if (data.url){
                window.location.href = data.url;
            }
        } catch (err) {
            console.error('Checkout error:',err);
            // @ts-ignore
            alert(err.message || 'Unable to start checkout. Please try again.');
            setIsProcessing(false);
        }
    };
    if (isLoading) {
        return (
            <div className="relative min-h-screen w-full flex items-center justify-center p-4 text-white font-sans">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xl -z-10" />
                <div className="rounded-2xl border border-zinc-700/60 bg-black/70 px-8 py-6 backdrop-blur-md text-center shadow-2xl">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-zinc-500 border-t-white mb-3" />
                    <p className="text-xs sm:text-sm font-medium text-zinc-300">Loading beat details...</p>
                </div>
            </div>
        );
    }

    if (error || !song) {
        return (
            <div className="relative min-h-screen w-full flex items-center justify-center p-4 text-white font-sans">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xl -z-10" />
                <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-black/70 p-6 backdrop-blur-md text-center shadow-2xl">
                    <div className="text-red-400 text-2xl mb-2">⚠️</div>
                    <h2 className="text-base font-bold text-white mb-1">Unable to load beat</h2>
                    <p className="text-xs text-zinc-400 mb-6">{error || 'Song record could not be found.'}</p>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="rounded-xl bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-xs font-semibold text-white transition"
                    >
                        ← Go Back to Beats
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 text-white font-sans">
            {/* Background Dim / Overlay */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xl -z-10" />

            <div className="w-full max-w-2xl rounded-2xl border border-zinc-700/60 bg-black/70 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
                {/* Top Back Navigation */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition"
                >
                    ← Back to Songs
                </button>

                {/* Header */}
                <div className="border-b border-zinc-800 pb-6 mb-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Checkout License</span>
                    <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                        {song.name}
                    </h1>
                    <p className="mt-1 text-xs text-zinc-400">
                        {song.genre} • {song.bpm} BPM • Instant High-Quality Audio Delivery
                    </p>
                </div>

                {/* Two-Column Grid: Order Details & Payment Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: What's Included */}
                    <div className="space-y-4">
                        <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">License Includes:</h2>
                        <ul className="space-y-2.5 text-xs text-zinc-300">
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400 font-bold">✓</span>24-bit WAV & 320kbps MP3
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400 font-bold">✓</span> Commercial distribution on Spotify & Apple
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400 font-bold">✓</span> Up to 500,000 online audio streams
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400 font-bold">✓</span> 100% Royalty-Free for independent releases
                            </li>
                        </ul>

                        {/* Price Tag Box */}
                        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-400">Subtotal:</span>
                                <span className="font-semibold text-white">${song.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-base font-bold mt-2 pt-2 border-t border-zinc-800">
                                <span className="text-white">Total:</span>
                                <span className="text-emerald-400 text-lg">${song.price.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Buyer Input & Submit */}
                    <form onSubmit={handleCheckOut} className="flex flex-col justify-between space-y-6">
                        <div className="space-y-3">
                            <label className="block text-xs font-semibold text-zinc-300">
                                Email Address for Delivery <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full rounded-xl border border-zinc-700/60 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder-zinc-500 transition-colors hover:border-zinc-500 focus:border-white focus:outline-none"
                            />
                            <p className="text-[11px] text-zinc-500 leading-tight">
                                Your high-speed download link from Cloudflare R2 will be sent directly to this address upon confirmation.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full rounded-xl bg-white py-3.5 px-4 text-xs sm:text-sm font-bold text-black transition-all hover:bg-zinc-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {isProcessing ? 'Connecting to Stripe...' : `Pay $${song.price.toFixed(2)} with Stripe`}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500">
                                <span>🔒 256-Bit Encrypted Checkout</span>
                                <span>•</span>
                                <span>Apple Pay / Google Pay / Cards</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}