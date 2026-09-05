export default function Hero(){


    return (
        <section className="relative h-[55vh] w-full overflow-hidden flex items-center justify-center">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover">
                <source src="/videos/zoro-bg.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 bg-black/40 backdrop-blur-[10px]"/>
            <div className="relative z-10 text-center px-4">
                <a
                    href="https://youtu.be/6yFQGA3gYy4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-block cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-wider text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                        STREAM TEMPER TODAY!
                    </h1>
                </a>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />

        </section>
    );
}