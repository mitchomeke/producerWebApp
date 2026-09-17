export default function Header() {
    return (
        <header className="fixed top-0 left-0 z-50 w-full bg-black/75 backdrop-blur-xl border-b border-white/[0.08] pt-[env(safe-area-inset-top)]">
            <div className="relative mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Left placeholder to balance the right icon on mobile and desktop */}
                <div className="flex w-10 sm:w-24 items-center justify-start" />

                {/* Brand Title - Permanently centered on all screen sizes */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center select-none pointer-events-auto">
                    <a
                        href="/"
                        className="text-lg sm:text-2xl font-black tracking-widest text-white transition-opacity hover:opacity-90 active:scale-95 duration-150 inline-block uppercase"
                    >
                        MITCH BEATS
                    </a>
                </div>

                {/* Social / Action Icons - Right */}
                <div className="flex w-10 sm:w-24 items-center justify-end">
                    <a
                        href="https://beatstars.com/m1tch3ll"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Mitch Beats on BeatStars"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-150"
                    >
                        <img
                            src="https://pub-1e569b6d799147f59ef0a615ac232401.r2.dev/beatStars.png"
                            alt="BeatStars"
                            className="h-5 sm:h-6 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                        />
                    </a>
                </div>

            </div>

            {/* Subtle bottom edge highlight */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </header>
    );
}