import express, {Request, Response} from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const BEATS_CATALOG = [
    {
        id: '1',
        title: 'Santoryu',
        bpm: 140,
        tier: 5,
        genre: 'rap',
        price: 35,
        audioUrl: `https://pub-246a11c0233344ad97feacb33e658f49.r2.dev/untitled.509.wav`,
    }
];

app.get('/beats', (req: Request, res: Response) => {
    const star = Number(req.query.tier);
    if (!star){
        return res.json(BEATS_CATALOG);
    }
    const filteredBeats = BEATS_CATALOG.filter(
        (beat) => beat.tier === star
    );
    return res.json(filteredBeats);
});

app.listen(5000, () => {
    console.log('Node.js server listening on port 5000');
});