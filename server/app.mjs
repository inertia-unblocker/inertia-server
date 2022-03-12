import http from 'http';
import express from 'express';
import Server from 'bare-server-node';
import alloyproxy from 'alloyproxy';
import nodeStatic from 'node-static';

const bare =  new Server('/bare/', ''),
	uvstatic = new nodeStatic.Server('server/static/', { cache: 10 }),
	app = express(),
	server = http.createServer(app),
	PORT = process.env.PORT || 5000;

function toBase64(str) {
	return Buffer.from(str).toString('base64');
}

// Alloy
let Alloy = new alloyproxy({
	prefix: '/alloy/',
	request: [],
	response: [],
	injection: true,
});

app.use(Alloy.app);
Alloy.ws(server);


// URL Handling
app.get('/alloy-gateway', (req, res) => {
	let url = req.query.url;

	if (!url.endsWith('/')) url = url + '/';
	let urlhostname = url.match(/^(https?:\/\/[^/]+)/)[0]; // Copilot did this. idk regex. say thanks to copilot.
	let path = url.substring(urlhostname.length);

	let base64_urlhostname = toBase64(urlhostname);
	res.redirect(`/alloy/${base64_urlhostname}${path}`);
});

app.get('/uv-gateway', (req, res) => {
	let url = req.query.url;
	res.redirect(`/?url=${url}&usedGateway=true`);
});


// Ultraviolet
app.use((req, res) => {
	if (!req.url.startsWith('/alloy')) {
		if (bare.route_request(req, res)) return true;
		uvstatic.serve(req, res);
	}
});

server.on('upgrade', (req, socket, head) => {
	if(bare.route_upgrade(req, socket, head)) return;
	socket.end();
});


// Server Listening
server.listen(PORT, () => {
	console.log('Server running on port ' + PORT);
});