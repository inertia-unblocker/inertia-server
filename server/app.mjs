import http from 'http';
import express from 'express';
import Alloy from 'alloyproxy';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;
const proxy = new Alloy({ prefix: '/alloy/', injection: true });

app.use(proxy.app);
proxy.ws(server);

const toBase64 = (str) => Buffer.from(str).toString('base64');

app.get('/alloy-gateway', (req, res) => {
	let url = req.query.url;

	if (!url) res.redirect('/');
	if (!url.endsWith('/')) url = url + '/';

	let hostname = toBase64(url.match(/^(https?:\/\/[^/]+)/)[0]);
	let path = url.substring(hostname.length);

	res.redirect(`/alloy/${hostname}${path}`);
});

app.get('/', (req, res) => res.redirect(process.env.INERTIA));
server.listen(port, () => console.log(`Listening on port ${port}`));