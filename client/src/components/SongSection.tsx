import { useNavigate } from 'react-router-dom';

export default function SongSection() {
    const tiers = [5, 4, 3, 2, 1];
    const navigate = useNavigate();

    const openSongPage = (star: number) => {
        navigate(`/songs/${star}-star`);
    };

    return (
        <section className="relative overflow-hidden py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="relative z-10 mb-8 sm:mb-12 text-center">
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black">
                    Song Selection
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 font-medium">
                    Browse songs categorized by tier rating
                </p>
            </div>

            {/* Responsive Grid: 2 columns on phones, auto-fill/flex on tablet and desktop */}
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3.5 sm:grid-cols-3 md:flex md:flex-wrap md:justify-center md:gap-5">
                {tiers.map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => openSongPage(star)}
                        className="group relative flex aspect-square w-full sm:w-40 sm:h-40 md:w-44 md:h-44 flex-col items-center justify-center rounded-2xl border border-black/10 bg-black p-4 text-center shadow-md transition-all duration-200 hover:-translate-y-1 hover:bg-zinc-900 active:scale-[0.97] touch-manipulation"
                    >
                        {/* Star Rating Visualization */}
                        <div className="mb-2 flex items-center gap-0.5 text-amber-400 text-xs sm:text-sm">
                            {'★'.repeat(star)}
                            <span className="text-zinc-600">{'★'.repeat(5 - star)}</span>
                        </div>

                        {/* Star Tier Title */}
                        <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white transition-colors">
                            {star} Star
                        </span>

                        <span className="mt-1 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-300">
                            Songs
                        </span>

                        {/* Mobile Cue */}
                        <span className="mt-2 text-[10px] font-medium text-zinc-500 sm:hidden">
                            Listen →
                        </span>
                    </button>
                ))}
            </div>

            {/* Bottom Divider Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/20 to-transparent" />
        </section>
    );
}