import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../config.ts";

interface PurchaseDetails {
    title: string;
    customerEmail: string;
    downloadUrl: string;
}

export default function BeatsPaymentSuccess() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    // Default to true so the error card does not flash before the request begins
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [details, setDetails] = useState<PurchaseDetails | null>(null);

    // Guard against React 18 duplicate effect execution
    const hasRequested = useRef(false);

    useEffect(() => {
        if (!sessionId) {
            setError('Invalid or missing checkout session ID.');
            setIsLoading(false);
            return;
        }

        if (hasRequested.current) return;
        hasRequested.current = true;

        const verifySession = async () => {
            try {
                const res = await fetch(`${API_URL}/api/verify-session/beats?session_id=${sessionId}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Could not verify payment session.');
                }

                // Verify the downloadUrl is a valid string
                if (!data.downloadUrl || typeof data.downloadUrl !== 'string') {
                    throw new Error('Secure download link could not be prepared. Please refresh.');
                }

                setDetails(data);
            } catch (err: any) {
                console.error('Session verification error:', err);
                setError(err.message || 'Payment verification failed.');
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, [sessionId]);

    // 1. Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-black text-white p-4 font-sans">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-zinc-500 border-t-white mb-4" />
                    <h2 className="text-base font-semibold">Verifying your purchase...</h2>
                    <p className="text-xs text-zinc-400 mt-1">Talking to Stripe and preparing your files.</p>
                </div>
            </div>
        );
    }

    // 2. Error State
    if (error || !details) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-black text-white p-4 font-sans">
                <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-zinc-900/80 p-6 text-center">
                    <div className="text-red-400 text-3xl mb-2">✕</div>
                    <h1 className="text-lg font-bold">Payment Verification Failed</h1>
                    <p className="text-xs text-zinc-400 mt-2 mb-6">{error || 'Session could not be verified.'}</p>
                    <button
                        onClick={() => { window.location.href = '/'; }}
                        className="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition"
                    >
                        ← Return to Beat Store
                    </button>
                </div>
            </div>
        );
    }

    // 3. Success State
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 text-white font-sans">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-xl -z-10" />

            <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-black/80 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
                {/* Top Badge */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                        ✓
                    </span>
                    <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                        Payment Confirmed
                    </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    Thank you for your purchase!
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-zinc-400">
                    Your license for <span className="text-white font-medium">{details.title}</span> is now active. A copy of the receipt was sent to{' '}
                    <span className="text-white">{details.customerEmail || 'your email'}</span>.
                </p>

                {/* Download Box */}
                <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-semibold text-white">{details.title} (Master Package)</p>
                            <p className="text-xs text-zinc-500 mt-0.5">WAV + 320kbps MP3</p>
                        </div>
                        <span className="text-xs font-mono bg-zinc-800 px-2 py-1 rounded text-zinc-300">
                            ZIP ARCHIVE
                        </span>
                    </div>

                    <a
                        href={details.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full rounded-xl bg-white py-3.5 px-4 text-xs sm:text-sm font-bold text-black transition-all hover:bg-zinc-200 active:scale-[0.99] shadow-lg"
                    >
                        <span>Download Master Files</span>
                        <span>↓</span>
                    </a>
                </div>

                {/* Secondary Navigation */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => { window.location.href = '/'; }}
                        className="text-xs text-zinc-400 hover:text-white transition"
                    >
                        ← Continue browsing beats
                    </button>
                </div>
            </div>
        </div>
    );
}