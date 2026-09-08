import {useState, useEffect} from "react";
import {useParams, Link, useNavigate} from 'react-router-dom';
interface Song {
    id: number,
    name: string,
    genre: string,
    bpm: number,
    price: number,
    tier: number,
    audioUrl: string,
    youtubeLink: string
}
export default function SongsPage(){
    const { tier } = useParams<{tier: string}>();
    const [loading,setLoading] = useState(true);
    const [songs,setSongs] = useState<Song[]>([]);
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [selectedBpm, setSelectedBpm] = useState('all');
    const [selectedPrice, setSelectedPrice] = useState('all');
    const [search, setSearch] = useState('');


    const navigate = useNavigate();
    const starCount = tier ? tier.split('-')[0] : '';

    useEffect(() => {
        fetch(`http://localhost:5000/songs?tier=${starCount}&selectedBpm=${selectedBpm}&selectedPrice=${selectedPrice}&selectedGenre=${selectedGenre}&search=${search}`)
            .then((res) => res.json())
            .then((data) => {
                setSongs(data)
                setLoading(false);
            })
    }, [starCount,selectedBpm,selectedPrice,selectedGenre,search]);

    function openSongPaymentPage(id: number) {
        navigate(`/songs/payment?id=${id}`);
    }

    return (
        <main className="relative min-h-screen bg-black text-white px-6 py-16">
            {/* 1. Background Video Layer */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                >
                    <source src="/videos/zoro-bg.mp4" type="video/mp4" />
                </video>

                {/* Semi-transparent dark wash */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Soft bottom/top vignette to blend into page layout */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
            </div>

            {/* 2. Page Content Layer */}
            <div className="relative z-10 max-w-5xl mx-auto">
                <Link to="/" className="text-sm text-zinc-400 hover:text-white transition">
                    ← Back to all categories
                </Link>

                <h1 className="mt-6 text-3xl font-extrabold uppercase tracking-tight drop-shadow-md">
                    {starCount} Star Songs
                </h1>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    {/* Genre Filter */}
                    <div className="relative w-full sm:w-44">
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-zinc-700/60 bg-black/70 backdrop-blur-md px-4 py-2.5 pr-9 text-xs sm:text-sm font-medium text-white transition-colors hover:border-zinc-500 focus:border-white focus:outline-none cursor-pointer"
                        >
                            <option value="all">All Genres</option>
                            <option value="rap">Rap</option>
                            <option value="drill">Drill</option>
                            <option value="rnb">R&B</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* BPM Filter */}
                    <div className="relative w-full sm:w-44">
                        <select
                            value={selectedBpm}
                            onChange={(e) => setSelectedBpm(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-zinc-700/60 bg-black/70 backdrop-blur-md px-4 py-2.5 pr-9 text-xs sm:text-sm font-medium text-white transition-colors hover:border-zinc-500 focus:border-white focus:outline-none cursor-pointer"
                        >
                            <option value="all">All BPMs</option>
                            <option value="100-110">80–90 BPM</option>
                            <option value="100-110">90–100 BPM</option>
                            <option value="100-110">100–110 BPM</option>
                            <option value="110-120">110–120 BPM</option>
                            <option value="120-130">120–130 BPM</option>
                            <option value="130-140">130–140 BPM</option>
                            <option value="140-150">140–150 BPM</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div className="relative w-full sm:w-44">
                        <select
                            value={selectedPrice}
                            onChange={(e) => setSelectedPrice(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-zinc-700/60 bg-black/70 backdrop-blur-md px-4 py-2.5 pr-9 text-xs sm:text-sm font-medium text-white transition-colors hover:border-zinc-500 focus:border-white focus:outline-none cursor-pointer"
                        >
                            <option value="all">All Prices</option>
                            <option value="10-20">$10 – $20</option>
                            <option value="20-30">$20 – $30</option>
                            <option value="30-40">$30 – $40</option>
                            <option value="40-50">$40 – $50</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {(selectedGenre !== 'all' || selectedBpm !== 'all' || selectedPrice !== 'all') && (
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedGenre('all');
                                setSelectedBpm('all');
                                setSelectedPrice('all');
                            }}
                            className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors px-2 py-1"
                        >
                            Reset Filters
                        </button>
                    )}
                    <div className="relative w-full sm:w-56">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title..."
                            className="w-full rounded-xl border border-zinc-700/60 bg-black/70 backdrop-blur-md px-4 py-2.5 pr-9 text-xs sm:text-sm font-medium text-white placeholder-zinc-500 transition-colors hover:border-zinc-500 focus:border-white focus:outline-none"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <p className="mt-8 text-zinc-400">Loading tracks...</p>
                ) : (
                    <div className="mt-8 grid gap-4 max-w-3xl">
                        {songs.map((song) => (
                            <div
                                key={song.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md p-4 transition-colors hover:border-zinc-600"
                            >
                                {/* Track Info */}
                                <div className="flex-1 min-w-0">
                                    {song.youtubeLink ? (<a
                                        href={song.youtubeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-zinc-400 hover:text-white transition"
                                    >
                                        <h3 className="truncate text-base font-bold text-white">
                                            {song.name}
                                        </h3>
                                    </a>) : (<h3 className="truncate text-base font-bold text-white">
                                        {song.name}
                                    </h3>)
                                    }
                                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                                        <span>{song.bpm} BPM</span>
                                        <span className="text-zinc-600">•</span>
                                        <span className="capitalize">{song.genre}</span>
                                        {song.tier && (
                                            <>
                                                <span className="text-zinc-600">•</span>
                                                <span className="text-amber-400 font-medium">
                                            {'★'.repeat(song.tier)}
                                        </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Native R2 Audio Streamer */}
                                <div className="w-full sm:w-auto flex-shrink-0">
                                    <audio
                                        controls
                                        controlsList="nodownload"
                                        onContextMenu={(e) => e.preventDefault()}
                                        src={song.audioUrl}
                                        onPlay={(e) => {
                                            document.querySelectorAll('audio').forEach((audio) => {
                                                if (audio != e.currentTarget){
                                                    audio.pause();
                                                }
                                            })
                                        }}
                                        className="h-9 w-full sm:w-64 rounded-lg invert brightness-90 hue-rotate-180"
                                        preload="none"
                                    />
                                </div>

                                {/* Action / Buy Button */}
                                <div className="flex items-center justify-end flex-shrink-0">
                                    <button
                                        onClick={() => openSongPaymentPage(song.id)}
                                        type="button"
                                        className="w-full sm:w-auto rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-zinc-200 active:scale-95"
                                    >
                                        ${song.price}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}


