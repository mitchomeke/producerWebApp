import Header from "./components/Header";
import Hero from "./components/Hero.tsx";
import BeatsSection from "./components/BeatsSection.tsx";
import SongSection from "./components/SongSection.tsx";
import ContactInfo from "./components/ContactInfo.tsx";
export function App() {

  return (
          <div className="min-h-screen w-full bg-white text-white antialiased selection:bg-white selection:text-white">
              <Header/>
          <main>
              <Hero/>
              <BeatsSection/>
              <SongSection/>
          </main>
              <ContactInfo/>
          </div>
  );
}

export default App
