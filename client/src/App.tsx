import Hero from "./components/Hero.tsx";
import Header from "./components/Header.tsx";
import BeatsSection from "./components/BeatsSection.tsx";
import SongSection from "./components/SongSection.tsx";
import ContactInfo from "./components/ContactInfo.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BeatsPage from "./components/BeatsPage.tsx";

function HomePage(){
    return (
        <div className="min-h-screen w-full bg-white text-white antialiased">
            <Header />
            <main>
                <Hero />
                <BeatsSection />
                <SongSection />
            </main>
            <ContactInfo />
        </div>
    )
}
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/beats/:tier" element={<BeatsPage/>} />
            </Routes>
        </BrowserRouter>
    );
}
