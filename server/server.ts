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
        genre: 'drill',
        price: 30,
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.457%20instru.mp3`,
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
        audioUrl: `https://pub-33d1b01ec16c435c97b71745c3ed0edf.r2.dev/untitled.482%20edited.wav`,
    }

];

app.get('/songs',(req: Request, res: Response) => {
    const star = req.query.tier;
    if (!star) {
        return res.json(SONGS_CATALOG);
    }
    const selectedGenre = (req.query.selectedGenre as string) || 'all';
    const selectedPrice = (req.query.selectedPrice as string) || 'all';
    const selectedBpm = (req.query.selectedBpm as string) || 'all';
    if (typeof star === "string") {
        const filteredSongs = SONGS_CATALOG.filter(
            (song) => song.tier === parseInt(star, 10)
        );
        const fullyFilteredSongs = filteredSongs.filter(
            (beat) => {
                const matchesGenre = (() => {
                    if (selectedGenre === "all") return true;
                    else return beat.genre.toLowerCase() === selectedGenre.toLowerCase();
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
                return matchesGenre && matchesBpm && matchesPrice;
            });
        return res.json(fullyFilteredSongs);
    }
});


app.get('/beats', (req: Request, res: Response) => {
    const star = req.query.tier;
    if (!star) {
        return res.json(BEATS_CATALOG);
    }
    const selectedGenre = (req.query.selectedGenre as string) || 'all';
    const selectedPrice = (req.query.selectedPrice as string) || 'all';
    const selectedBpm = (req.query.selectedBpm as string) || 'all';
    if (typeof star === "string") {
        const filteredBeats = BEATS_CATALOG.filter(
            (beat) => beat.tier === parseInt(star, 10)
        );
        const fullyFilteredBeats = filteredBeats.filter(
            (beat) => {
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
                console.log({
                    selectedGenre,
                    selectedBpm,
                    selectedPrice,
                    beatGenre: beat.genre,
                    matchesGenre,
                    matchesBpm,
                    matchesPrice
                });
                return matchesGenre && matchesBpm && matchesPrice;
            });

       return res.json(fullyFilteredBeats);
    }
});


    app.listen(5000, () => {
        console.log('Node.js server listening on port 5000');
    });
