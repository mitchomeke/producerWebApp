export default function Hero() {
    return (
        <section className="relative h-[55vh] w-full overflow-hidden flex items-center justify-center">
            {/* 1. Background Image pinned behind content */}
            <img
                src="/bandw.jpg"
                alt="Background"
                className="absolute inset-0 h-full w-full object-cover blur-sm scale-110 pointer-events-none"
            />

            {/* 2. Dark contrast overlay */}
            <div className="absolute inset-0 bg-black/50 pointer-events-none" />

            {/* 3. Interactive Call to Action */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <a
                    href="https://youtu.be/6yFQGA3gYy4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-block cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider text-white uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                        STREAM TEMPER TODAY!
                    </h1>
                </a>
            </div>

            {/* 4. Bottom fade into the page */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
        </section>
    );
}