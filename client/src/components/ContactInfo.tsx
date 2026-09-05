// @ts-ignore
import {useState} from "react";

export default function ContactInfo(){
    const email = "mitchellomeke@yahoo.com";
    const [copied,setCopied] = useState(false);
    const handleCopy = async () => {
        await navigator.clipboard.writeText(email);

        setCopied(true);

        setTimeout( () => setCopied(false),2000);
    }
    // @ts-ignore
    return (
        <section className="relative overflow-hidden py-16 px-4">
            <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-black/100 to-transparent opacity-70" />
            {/* Centered layout wrapper */}
            <div className="mx-auto max-w-xl text-center">
                <h2 className="text-2xl font-extrabold uppercase tracking-tight text-black sm:text-3xl">
                    Get In Touch
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                    For custom exclusive beats, inquiries, and collaboration requests
                </p>

                {/* Glassmorphic card container */}
                <div className="mt-8 rounded-2xl border border-zinc-800 bg-black p-6 backdrop-blur-md transition-all hover:border-zinc-700">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Direct Inquiries
          </span>

                    <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                        {/* 3. Mailto link: Clicking this opens the user's default email client (Apple Mail, Outlook, etc.) */}
                        <a
                            href={`mailto:${email}`}
                            className="text-lg font-semibold tracking-tight text-white transition-colors hover:text-zinc-300"
                        >
                            {email}
                        </a>

                        {/* 4. Action button that triggers handleCopy */}
                        <button
                            onClick={handleCopy}
                            type="button"
                            className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
                        >
                            {/* Ternary condition: if copied is true, display "Copied!", otherwise "Copy" */}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </section>

    );
}