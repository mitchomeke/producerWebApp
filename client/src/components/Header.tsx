export default function Header() {
    return (
        <header className="fixed top-0 left-0 z-50 w-full bg-black/60 backdrop-blur-md">
            <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="hidden sm:block w-24" />

                <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                    <a
                        href="https://www.youtube.com/channel/UCbfV7X9A2EVr3B9-nKByIlQ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl font-bold tracking-tight text-white transition-transform duration-200 hover:scale-105 inline-block"
                    >
                        MITCH BEATS
                    </a>
                </div>

                {/* Social / Platform Icons on the Right */}
                <div className="flex items-center gap-4">
                    <a
                        href="https://soundcloud.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-75 transition-all duration-200 hover:opacity-100 hover:scale-110"
                    >
                        <img
                            src="/images/soundCloud.png"
                            alt="SoundCloud"
                            className="h-6 w-auto object-contain"
                        />
                    </a>

                    <a
                        href="https://beatstars.com/m1tch3ll"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-75 transition-all duration-200 hover:opacity-100 hover:scale-110"
                    >
                        <img
                            src="/images/beatStars.png"
                            alt="BeatStars"
                            className="h-6 w-auto object-contain"
                        />
                    </a>

                    <a
                        href="https://www.youtube.com/channel/UCbfV7X9A2EVr3B9-nKByIlQ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-75 transition-all duration-200 hover:opacity-100 hover:scale-110"
                    >
                        <img
                            src="/images/youtube.png"
                            alt="YouTube"
                            className="h-6 w-auto object-contain"
                        />
                    </a>
                </div>

            </div>

            {/* Stylish Faded Gradient Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </header>
    );
}