import {useNavigate} from 'react-router-dom'
export default function SongSection (){
    const tiers = [5,4,3,2,1];
    const navigate = useNavigate();
    const openSongPage = (star: number) => {
        navigate(`/songs/${star}-star`)
    }
    return (

        <section className="relative overflow-hidden py-16 px-4">
            <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-black/100 to-transparent opacity-70" />
            <div className="relative z-10 mb-10 text-center">
                <h2 className="text-2xl font-extrabold uppercase tracking-tight text-black sm:text-3xl">
                    Song Selection
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                    Browse songs categorized by tier
                </p>
            </div>
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6">
                {tiers.map((star) => (
                    <button
                        onClick={() => openSongPage(star)}
                        key={star}
                        type="submit"
                        className="group flex h-44 w-44 aspect-square flex-col items-center justify-center rounded-2xl border border-black/100 bg-black/100 p-4 text-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-800/80 active:scale-95">
                      <span className="text-2xl font-extrabold uppercase tracking-tight text-white group-hover:text-white">
              {star} Star
            </span>
                        <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-300">
              Songs
            </span>
                    </button>
                ))}
            </div>
        </section>

    );
}