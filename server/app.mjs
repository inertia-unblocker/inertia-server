import http from 'http';
import express from 'express';
import url from 'url';
import Server from 'bare-server-node';
import alloyproxy from 'alloyproxy';
import nodeStatic from 'node-static';

const bare =  new Server('/bare/', ''),
	uvstatic = new nodeStatic.Server('server/static/'),
	app = express(),
	server = http.createServer(app),
	PORT = process.env.PORT || 8080;

// Alloy stuff
function toBase64(str) {
	return Buffer.from(str).toString('base64');
}

const Alloy = new alloyproxy({
	prefix: '/alloy/',
	Request: [],
	Response: [],
	error: (alloy) => { 
		alloy.res.send({
			state: 'failed',
			message: 'Error: ' + alloy.error.info.message
		}); 
	},
	injection: true,
});

app.use(Alloy.app);

server.on('request', (req, res) => {
	if (bare.route_request(req, res)) return true;
	console.log(req.url);
	if (req.url.startsWith('/alloy-gateway')) {
		let quurl = url.parse(req.url, true).query.url;

		if (!quurl.endsWith('/')) quurl = quurl + '/';
		let urlhostname = quurl.match(/^(https?:\/\/[^/]+)/)[0]; // Copilot did this. idk regex. say thanks to copilot.
		let path = quurl.substring(urlhostname.length);

		let base64_urlhostname = toBase64(urlhostname);
		res.writeHead(302, {'Location': `/alloy/${base64_urlhostname}${path}`});
	} else {
		uvstatic.serve(req, res);
	}
});

server.on('upgrade', (req, socket, head) => {
	if(bare.route_upgrade(req, socket, head)) return;
	socket.end();
});

server.listen(PORT, () => {
	console.log('Server running on port ' + PORT);
});