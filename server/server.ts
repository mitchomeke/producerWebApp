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
        price: 35,
        audioUrl: 'https://pub-your-r2-subdomain.r2.dev/beats/santoryu-preview.mp3',
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