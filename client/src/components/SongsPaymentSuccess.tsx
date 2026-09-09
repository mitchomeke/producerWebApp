import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

interface PurchaseDetails  {
    title: string,
    customerEmail: string,
    downloadUrl: string
}

export default function SongsPaymentSuccess () {
    const [searchParam] = useSearchParams();
    const sessionId = searchParam.get('session_id');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [details, setDetails] = useState<PurchaseDetails | null>(null);

    useEffect(() => {
        if (!sessionId){
            setError('Could not get session Id or session Id is fake');
            setIsLoading(false);
            return;
        }
        fetch(`http://localhost:5000/api/verify-session?session_id=${sessionId}`)
            .then((res) => {
                if (!res.ok) throw new Error('Could not verify payment session');
                return res.json();
            })
            .then((data) => {
                setDetails(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setIsLoading(false);
            });
    }, [sessionId]);

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

    // Error Screen
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

    // Success Screen
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
                    <span className="text-white">{details.customerEmail}</span>.
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
                        download
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
                        ← Continue browsing songs
                    </button>
                </div>
            </div>
        </div>
    );
}