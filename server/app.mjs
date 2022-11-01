import express from 'express';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'static')));
app.get('/toInertia', (req, res) => res.redirect(process.env.INERTIA));
app.listen(port, () => console.log(`Listening on port ${port}`));