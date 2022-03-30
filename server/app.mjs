import http from 'http';
import express from 'express';
import Alloy from 'alloyproxy';

const app = express(),
	server = http.createServer(app),
	PORT = process.env.PORT || 5000;
proxy = new Alloy({
	prefix: '/alloy/',
	request: [],
	response: [],
	error: (proxy) => { 
		proxy.res.send({
			state: 'failed',
			message: 'Error: ' + proxy.error.info.message
		}); 
	},
	injection: true,
});

app.use(proxy.app);
proxy.ws(server);

function toBase64(str) {
	return Buffer.from(str).toString('base64');
}

app.get('/alloy-gateway', (req, res) => {
	let url = req.query.url;

	if (!url.endsWith('/')) url = url + '/';
	let urlhostname = url.match(/^(https?:\/\/[^/]+)/)[0]; // Copilot did this. idk regex. say thanks to copilot.
	let path = url.substring(urlhostname.length);

	let base64_urlhostname = toBase64(urlhostname);
	res.redirect(`/alloy/${base64_urlhostname}${path}`);
});

server.listen(PORT, () => {
	console.log('Server running on port ' + PORT);
});