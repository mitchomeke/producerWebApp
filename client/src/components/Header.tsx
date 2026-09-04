export default function Header (){
    return (
        <header className="fixed top-0 z-50 w-full border-b border-white/100 bg-white/15 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <span className="text-base font-bold tracking-tight text-white">
                        MITCH BEATS
                    </span>
                </div>
            </div>
        </header>
    );
}