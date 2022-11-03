import express from 'express';

const app = express();
const port = process.env.PORT || 5000;

app.get('/toInertia', (_req, res) => res.redirect(process.env.INERTIA));
app.use(express.static('./server/static'));
app.listen(port, () => console.log(`Listening on port ${port}`));
