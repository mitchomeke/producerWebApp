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
                        className="inline-flex items-center transition-transform hover:opacity-90 active:scale-95 duration-150"
                    >
                        <img
                            src="/logo.png"
                            alt="Mitch Beats"
                            className="h-8 sm:h-10 w-auto object-contain"
                        />
                    </a>
                </div>

            </div>

            {/* Subtle bottom edge highlight */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </header>
    );
}