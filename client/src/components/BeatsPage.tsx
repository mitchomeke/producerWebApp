import {useEffect, useState} from "react";
import {useParams, Link} from 'react-router-dom';

interface Beat {
    id: string;
    title: string;
    bpm: number;
    audioUrl: string;
    genre: string;
    price: number;
}

export default function BeatsPage (){
    const { tier } = useParams<{tier: string}>();
    const [beats, setBeats] = useState<Beat[]>([]);
    const [loading, setLoading] = useState(true);

    const starCount = tier ? tier.split('-')[0] : '';

    useEffect(() => {
        fetch('http://localhost:5000/beats?tier=${starCount}')
            .then((res) => res.json())
            .then((data) => {
                setBeats(data);
                setLoading(false);
            })
    }, [starCount]);

    return (
        <main className="min-h-screen bg-black text-white px-6 py-16">
            <Link to="/" className="text-sm text-zinc-400 hover:text-white transition">
                ← Back to all categories
            </Link>

            <h1 className="mt-6 text-3xl font-extrabold uppercase tracking-tight">
                {starCount} Star Beats
            </h1>

            {loading ? (
                <p className="mt-8 text-zinc-500">Loading tracks...</p>
            ) : (
                <div className="mt-8 grid gap-4 max-w-3xl">
                    {beats.map((beat) => (
                        <div
                            key={beat.id}
                            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
                        >
                            <div>
                                <h3 className="font-bold text-lg">{beat.title}</h3>
                                <p className="text-xs text-zinc-400">{beat.bpm} BPM</p>
                                <p>genre: </p> <p className="text-xs text-zinc-400">{beat.genre}</p>
                            </div>

                            {/* Native audio player streaming directly from your R2 storage link */}
                            <audio controls src={beat.audioUrl} className="h-10" />

                            <button className="rounded-lg bg-white px-4 py-1.5 text-xs font-bold text-black hover:bg-zinc-200">
                                ${beat.price}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );

}

