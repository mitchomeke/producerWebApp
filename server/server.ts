import express, {Request, Response} from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const BEATS_CATALOG = [
    {
        id: 1,
        title: 'santoryu',
        bpm: 120,
        tier: 5,
        genre: 'rap',
        price: 25,
        audioUrl: `https://pub-246a11c0233344ad97feacb33e658f49.r2.dev/untitled.509.wav`
    },
    {
        id: 2,
        title: 'neglect',
        bpm: 120,
        tier: 5,
        genre: 'rap',
        price: 35,
        audioUrl: `https://pub-246a11c0233344ad97feacb33e658f49.r2.dev/untitled.501%20beat.wav`
    },
    {
        id: 3,
        title: 'better-in-the-dark',
        bpm: 90,
        tier: 5,
        genre: 'rap',
        price: 25,
        audioUrl: `https://pub-246a11c0233344ad97feacb33e658f49.r2.dev/untitled.510%2090%20bpm%20instru.wav`
    },
    {
        id: 4,
        title: 'me-&-my-brkn-heart',
        bpm: 87,
        tier: 5,
        genre: 'drill',
        price: 20,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.487%20instru%2087.wav`,
    },
    {
        id: 5,
        title: 'murder',
        bpm: 152,
        tier: 5,
        genre: 'rap',
        price: 30,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.457%20instru.mp3`,
    },
    {
        id: 6,
        title: 'temper',
        bpm: 130,
        tier: 5,
        genre: 'rap',
        price: 50,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.455.mp3`,
    },
    {
        id: 7,
        title: 'celebrate',
        bpm: 140,
        tier: 4,
        genre: 'rap',
        price: 15,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.456%20instru.mp3`,
    },
    {
        id: 8,
        title: 'sanity',
        bpm: 136,
        tier: 4,
        genre: 'rap',
        price: 10,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.511%20136%20bpm%20instru.mp3`,
    },
    {
        id: 9,
        title: 'i wanna be yours',
        bpm: 136,
        tier: 4,
        genre: 'rap',
        price: 10,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.512%20136%20bpm.mp3`,
    },
    {
        id: 10,
        title: 'deluded',
        bpm: 152,
        tier: 4,
        genre: 'rap',
        price: 10,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.514%20instru.mp3`,
    },
    {
        id: 11,
        title: 'high like me',
        bpm: 140,
        tier: 3,
        genre: 'rap',
        price: 5,
        audioUrl: `https://pub-f656cb3b549d4b20aee8b73ef6e18ac2.r2.dev/untitled.449.mp3`,
    },
    {
        id: 12,
        title: 'appraisal',
        bpm: 135,
        tier: 3,
        genre: 'rap',
        price: 5,
        audioUrl: `https://pub-f656cb3b549d4b20aee8b73ef6e18ac2.r2.dev/untitled.463%20beat.mp3`,
    },

    {
        id: 13,
        title: 'ritual',
        bpm: 126,
        tier: 3,
        genre: 'drill',
        price: 5,
        audioUrl: `https://pub-f656cb3b549d4b20aee8b73ef6e18ac2.r2.dev/untitled.491%20instru.mp3`,
    },
    {
        id: 14,
        title: 'welcoming',
        bpm: 118,
        tier: 3,
        genre: 'rap',
        price: 5,
        audioUrl: `https://pub-f656cb3b549d4b20aee8b73ef6e18ac2.r2.dev/untitled.496.mp3`,
    },
    {
        id: 15,
        title: 'money on money',
        bpm: 120,
        tier: 3,
        genre: 'rap',
        price: 5,
        audioUrl: `https://pub-f656cb3b549d4b20aee8b73ef6e18ac2.r2.dev/untitled.513%20instru%20120.mp3`,
    }

];
const SONGS_CATALOG = [
    {
        id: 1,
        name: 'red-room (ft. yeat)',
        bpm: 140,
        tier: 5,
        genre: 'rap',
        price: 30,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.483.wav`,
    },
    {
        id: 2,
        name: 'sacrifice (ft. gunna, playboi carti & lucki)',
        bpm: 120,
        tier: 5,
        genre: 'rap',
        price: 40,
        audioUrl: `https://pub-246a11c0233344ad97feacb33e658f49.r2.dev/untitled.506%20v2%20120%20instru.wav`
    },
    {
        id: 3,
        name: 'love-letter (ft. playboi carti)',
        bpm: 132,
        tier: 5,
        genre: 'rap',
        price: 40,
        youtubeLink: ``,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.459.wav`,
    },
    {
        id: 4,
        name: 'eren-yeagar (ft. playboi carti)',
        bpm: 144,
        tier: 5,
        genre: 'rap',
        price: 30,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.475.wav`,
    },
    {
        id: 5,
        name: 'contemplate (ft. yeat)',
        bpm: 140,
        tier: 5,
        genre: 'rap',
        price: 45,
        youtubeLink: `https://youtu.be/L6HKUzBSNjw`,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.482%20edited.wav`,
    },
    {
        id: 6,
        name: 'temper (ft. playboi carti & lil yachty)',
        bpm: 130,
        tier: 5,
        genre: 'rap',
        price: 50,
        youtubeLink: `https://youtu.be/6yFQGA3gYy4`,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.455%202%20carti.mp3`,
    },
    {
        id: 7,
        name: 'stick (ft. dreamworld)',
        bpm: 119,
        tier: 4,
        genre: 'rap',
        price: 15,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled%20485%20119%20bpm.mp3`,
    },
    {
        id: 8,
        name: 'celebrate (ft. yeat & playboi carti)',
        bpm: 140,
        tier: 4,
        genre: 'rap',
        price: 15,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.456.mp3`,
    },
    {
        id: 9,
        name: 'interstella (ft. playboi carti)',
        bpm: 126,
        tier: 4,
        genre: 'rap',
        price: 15,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.464.mp3`,
    },
    {
        id: 10,
        name: '3 gee (ft. lil uzi vert & yeat)',
        bpm: 140,
        tier: 4,
        genre: 'rap',
        price: 10,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.481.mp3`,
    },
    {
        id: 11,
        name: 'me & my brkn heart (ft. j.cole)',
        bpm: 87,
        tier: 5,
        genre: 'drill',
        price: 30,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.487.wav`,
    },
    {
        id: 12,
        name: 'she gonna leave you (ft. a$ap rocky) (slowed)',
        bpm: 120,
        tier: 4,
        genre: 'drill',
        price: 15,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.488%20slowed.wav`,
    },
    {
        id: 13,
        name: 'she gonna leave you (ft. a$ap rocky)',
        bpm: 120,
        tier: 4,
        genre: 'drill',
        price: 10,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.488.wav`,
    },
    {
        id: 14,
        name: 'ritual (ft. young thug & jaden smith)',
        bpm: 126,
        tier: 5,
        genre: 'drill',
        price: 40,
        youtubeLink: `https://youtu.be/t71V-oOop4k`,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.491-2.mp3`,
    },
    {
        id: 15,
        name: 'high like me (ft. playboi carti)',
        bpm: 140,
        tier: 3,
        genre: 'rap',
        price: 10,
        audioUrl: `https://pub-f656cb3b549d4b20aee8b73ef6e18ac2.r2.dev/untitled.449%20carti.mp3`,
    },
    {
        id: 16,
        name: 'when they run (ft. xxxtentacion)',
        bpm: 135,
        tier: 3,
        genre: 'rap',
        price: 5,
        audioUrl: `https://pub-f656cb3b549d4b20aee8b73ef6e18ac2.r2.dev/untitled.454.mp3`,
    },
    {
        id: 17,
        name: 'mickey (ft. playboi carti)',
        bpm: 142,
        tier: 3,
        genre: 'rap',
        price: 5,
        audioUrl: `https://pub-f656cb3b549d4b20aee8b73ef6e18ac2.r2.dev/untitled.458%202.mp3`,
    },
    {
        id: 18,
        name: 'bentley (ft. migos & nle choppa)',
        bpm: 120,
        tier: 3,
        genre: 'rap',
        price: 5,
        audioUrl: `https://pub-f656cb3b549d4b20aee8b73ef6e18ac2.r2.dev/untitled.478.mp3`,
    }
];

app.get('/songs',(req: Request, res: Response) => {
    const star = req.query.tier;
    if (!star) {
        return res.json(SONGS_CATALOG);
    }
    const selectedSearch = (req.query.search as string).trim().toLowerCase() || '';
    const selectedGenre = (req.query.selectedGenre as string) || 'all';
    const selectedPrice = (req.query.selectedPrice as string) || 'all';
    const selectedBpm = (req.query.selectedBpm as string) || 'all';
    if (typeof star === "string") {
        const filteredSongs = SONGS_CATALOG.filter(
            (song) => song.tier === parseInt(star, 10)
        );
        const fullyFilteredSongs = filteredSongs.filter(
            (song) => {
                const matchesSearch = !selectedSearch || song.name.includes(selectedSearch);
                const matchesGenre = (() => {
                    if (selectedGenre === "all") return true;
                    else return song.genre.toLowerCase() === selectedGenre.toLowerCase();
                })();
                const matchesBpm = (() => {
                    if (selectedBpm === "all") return true;
                    const [minBpm, maxBpm] = selectedBpm.split("-").map(Number);
                    return song.bpm >= minBpm && song.bpm <= maxBpm;
                })();

                const matchesPrice = (() => {
                    if (selectedPrice === "all") return true;
                    const [minPrice, maxPrice] = selectedPrice.split("-").map(Number);
                    return song.price >= minPrice && song.price <= maxPrice;
                })();
                return matchesSearch && matchesGenre && matchesBpm && matchesPrice;
            });
        return res.json(fullyFilteredSongs);
    }
});


app.get('/beats', (req: Request, res: Response) => {
    const star = req.query.tier;
    if (!star) {
        return res.json(BEATS_CATALOG);
    }
    const selectedSearch = (req.query.search as string).trim().toLowerCase() || '';
    const selectedGenre = (req.query.selectedGenre as string) || 'all';
    const selectedPrice = (req.query.selectedPrice as string) || 'all';
    const selectedBpm = (req.query.selectedBpm as string) || 'all';
    if (typeof star === "string") {
        const filteredBeats = BEATS_CATALOG.filter(
            (beat) => beat.tier === parseInt(star, 10)
        );
        const fullyFilteredBeats = filteredBeats.filter(
            (beat) => {
                const matchesSearch = !selectedSearch || beat.title.toLowerCase().includes(selectedSearch);

                const matchesGenre = (() => {
                    if ( selectedGenre === "all" ){
                        return true;
                    } else return beat.genre.toLowerCase() === selectedGenre.toLowerCase();
                })();
                const matchesBpm = (() => {
                    if (selectedBpm === "all") return true;
                    const [minBpm, maxBpm] = selectedBpm.split("-").map(Number);
                    return beat.bpm >= minBpm && beat.bpm <= maxBpm;
                })();

                const matchesPrice = (() => {
                    if (selectedPrice === "all") return true;
                    const [minPrice, maxPrice] = selectedPrice.split("-").map(Number);
                    return beat.price >= minPrice && beat.price <= maxPrice;
                })();
                return matchesGenre && matchesBpm && matchesPrice && matchesSearch;
            });

       return res.json(fullyFilteredBeats);
    }
});

app.get('/songs/getSong',(req: Request, res: Response)=> {
    const songId = (req.query.id as unknown as number);
    const song = SONGS_CATALOG.find(s => s.id === songId);
    if (!song){
        return res.status(404).json({error: 'Song not found'});
    }
    return res.json(song);
});

app.get('/beats/getBeat',(req: Request, res: Response) => {
    const beatId = (req.query.id as unknown as number);
    const beat = BEATS_CATALOG.find(b => b.id === beatId);
    if (!beat){
        return res.status(404).json({error: 'Beat not found'});
    }
    return res.json(beat)
})


    app.listen(5000, () => {
        console.log('Node.js server listening on port 5000');
    });
