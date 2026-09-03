import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/message', (req, res) => {
    res.json({ text: "Hello from the Node.js backend!" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});