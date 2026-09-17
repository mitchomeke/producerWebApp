import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_URL } from "../config.ts";

interface Song {
    id: number;
    name: string;
    genre: string;
    bpm: number;
    price: number;
    tier: number;
    audioUrl: string;
    youtubeLink: string;
}

export default function SongsPage() {
    const { tier } = useParams<{ tier: string }>();
    const [loading, setLoading] = useState(true);
    const [songs, setSongs] = useState<Song[]>([]);
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [selectedBpm, setSelectedBpm] = useState('all');
    const [selectedPrice, setSelectedPrice] = useState('all');
    const [search, setSearch] = useState('');

    const navigate = useNavigate();
    const starCount = tier ? tier.split('-')[0] : '';

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/songs?tier=${starCount}&selectedBpm=${selectedBpm}&selectedPrice=${selectedPrice}&selectedGenre=${selectedGenre}&search=${search}`)
            .then((res) => res.json())
            .then((data) => {
                setSongs(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [starCount, selectedBpm, selectedPrice, selectedGenre, search]);

    function openSongPaymentPage(id: number) {
        navigate(`/songs/payment?id=${id}`);
    }

    const hasActiveFilters = selectedGenre !== 'all' || selectedBpm !== 'all' || selectedPrice !== 'all' || search !== '';

    return (
        <main className="relative min-h-screen bg-black text-white px-4 py-8 sm:px-6 sm:py-16">
            {/* 1. Background Video Layer - Removed 'controls' to prevent mobile overlay artifacts */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <video
                    preload="metadata"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                >
                    <source src="https://pub-1e569b6d799147f59ef0a615ac232401.r2.dev/zoro-bg.mp4" type="video/mp4" />
                </video>

                {/* Overlays */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70" />
            </div>

            {/* 2. Page Content Layer */}
            <div className="relative z-10 max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition">
                    <span>←</span> Back to categories
                </Link>

                {/* Page Title & Star Rating Header */}
                <div className="mt-4 sm:mt-6 flex items-center justify-between gap-4">
                    <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                        {starCount} Star Songs
                    </h1>
                    <div className="flex text-amber-400 text-sm sm:text-base">
                        {'★'.repeat(Number(starCount) || 0)}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mt-4 w-full">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by song name..."
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md pl-4 pr-10 py-3 text-sm font-medium text-white placeholder-zinc-500 transition-colors focus:border-white focus:outline-none"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Compact Filters Grid: 2 columns on mobile, row on tablet/desktop */}
                <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                    {/* Genre */}
                    <div className="relative w-full sm:w-40">
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-3.5 py-2.5 pr-8 text-xs font-medium text-white transition-colors focus:border-white focus:outline-none"
                        >
                            <option value="all">All Genres</option>
                            <option value="afrobeat">Afrobeat</option>
                            <option value="jersey club">Jersey Club</option>
                            <option value="phonk">Phonk</option>
                            <option value="rap">Rap</option>
                            <option value="funk">Funk</option>
                            <option value="drill">Drill</option>
                            <option value="rnb">R&B</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* BPM */}
                    <div className="relative w-full sm:w-40">
                        <select
                            value={selectedBpm}
                            onChange={(e) => setSelectedBpm(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-3.5 py-2.5 pr-8 text-xs font-medium text-white transition-colors focus:border-white focus:outline-none"
                        >
                            <option value="all">All BPMs</option>
                            <option value="70-80">70–80 BPM</option>
                            <option value="80-90">80–90 BPM</option>
                            <option value="90-100">90–100 BPM</option>
                            <option value="100-110">100–110 BPM</option>
                            <option value="110-120">110–120 BPM</option>
                            <option value="120-130">120–130 BPM</option>
                            <option value="130-140">130–140 BPM</option>
                            <option value="140-150">140–150 BPM</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="relative w-full sm:w-40">
                        <select
                            value={selectedPrice}
                            onChange={(e) => setSelectedPrice(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-3.5 py-2.5 pr-8 text-xs font-medium text-white transition-colors focus:border-white focus:outline-none"
                        >
                            <option value="all">All Prices</option>
                            <option value="0-10">$0 – $10</option>
                            <option value="10-20">$10 – $20</option>
                            <option value="20-30">$20 – $30</option>
                            <option value="30-40">$30 – $40</option>
                            <option value="40-50">$40 – $50</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Reset Button */}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedGenre('all');
                                setSelectedBpm('all');
                                setSelectedPrice('all');
                                setSearch('');
                            }}
                            className="w-full sm:w-auto text-xs font-semibold text-zinc-400 hover:text-white transition-colors py-2 px-3 border border-zinc-800 rounded-xl sm:border-0"
                        >
                            Reset All
                        </button>
                    )}
                </div>

                {/* Track List */}
                {loading ? (
                    <div className="mt-12 flex flex-col items-center justify-center">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
                        <p className="mt-3 text-xs text-zinc-400">Loading catalog...</p>
                    </div>
                ) : songs.length === 0 ? (
                    <div className="mt-12 text-center py-12 rounded-2xl border border-zinc-800/80 bg-zinc-950/40">
                        <p className="text-sm text-zinc-400">No songs match your active filters.</p>
                    </div>
                ) : (
                    <div className="mt-6 space-y-3">
                        {songs.map((song) => (
                            <div
                                key={song.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md p-4 transition-all hover:border-zinc-700"
                            >
                                {/* Row 1 on Mobile: Track Name + Price Button */}
                                <div className="flex items-start justify-between gap-3 min-w-0 flex-1">
                                    <div className="min-w-0 flex-1">
                                        {song.youtubeLink ? (
                                            <a
                                                href={song.youtubeLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group inline-flex items-center gap-1.5 hover:text-white"
                                            >
                                                <h3 className="truncate text-sm sm:text-base font-bold text-white group-hover:underline">
                                                    {song.name}
                                                </h3>
                                                <span className="text-[10px] text-zinc-500">↗</span>
                                            </a>
                                        ) : (
                                            <h3 className="truncate text-sm sm:text-base font-bold text-white">
                                                {song.name}
                                            </h3>
                                        )}

                                        <div className="mt-1 flex items-center gap-2 text-[11px] sm:text-xs text-zinc-400">
                                            <span>{song.bpm} BPM</span>
                                            <span className="text-zinc-700">•</span>
                                            <span className="capitalize">{song.genre}</span>
                                            {song.price === 0 && (
                                                <>
                                                    <span className="text-zinc-700">•</span>
                                                    <span className="text-emerald-400 font-semibold uppercase text-[10px]">Free</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Price / Purchase Button (pinned top right on mobile, right-aligned on desktop) */}
                                    <button
                                        onClick={() => openSongPaymentPage(song.id)}
                                        type="button"
                                        className="sm:hidden flex-shrink-0 rounded-xl bg-white px-3.5 py-1.5 text-xs font-black text-black active:scale-95 transition-transform"
                                    >
                                        {song.price === 0 ? 'FREE' : `$${song.price}`}
                                    </button>
                                </div>

                                {/* Row 2 on Mobile: Audio Player Full Width */}
                                <div className="w-full sm:w-auto flex-shrink-0">
                                    <audio
                                        controls
                                        controlsList="nodownload"
                                        onContextMenu={(e) => e.preventDefault()}
                                        src={`${API_URL}/api/songs/preview/${song.id}`}
                                        onPlay={(e) => {
                                            document.querySelectorAll('audio').forEach((audio) => {
                                                if (audio !== e.currentTarget) {
                                                    audio.pause();
                                                }
                                            });
                                        }}
                                        className="h-8 sm:h-9 w-full sm:w-64 rounded-lg invert brightness-90 hue-rotate-180"
                                        preload="none"
                                    />
                                </div>

                                {/* Desktop Price Button */}
                                <div className="hidden sm:flex items-center justify-end flex-shrink-0">
                                    <button
                                        onClick={() => openSongPaymentPage(song.id)}
                                        type="button"
                                        className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-black hover:bg-zinc-200 active:scale-95 transition-all shadow-sm"
                                    >
                                        {song.price === 0 ? 'FREE' : `$${song.price}`}
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