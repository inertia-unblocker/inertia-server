const alloyproxy = require('alloyproxy'),
	http = require('http'),
	corrosion = require('corrosion'),
	express = require('express'),
	app = express(),
	fs = require('fs'),
	path = require('path'),
	server = http.createServer(app);

let port = process.env.PORT || 5000;

function toBase64(str) {
	return Buffer.from(str).toString('base64');
}

const Alloy = new alloyproxy({
	prefix: '/alloy/',
	request: [],
	response: [],
	error: (alloy) => { 
		alloy.res.send({
			state: 'failed',
			message: 'Error: ' + alloy.error.info.message
		}); 
	},
	injection: true,
});

const Corrosion = new corrosion({
	prefix: '/corrosion/',
	codec: 'xor'
});
Corrosion.bundleScripts();

function corrosionMiddleway(req, res, next) {
	if (req.url.startsWith(Corrosion.prefix)) return Corrosion.request(req, res);
	next();
}

app.use(Alloy.app);
app.use('/', corrosionMiddleway);
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.get('/alloy-gateway', (req, res) => {
	let url = req.query.url;

	if (!url.endsWith('/')) url = url + '/';
	let urlhostname = url.match(/^(https?:\/\/[^/]+)/)[0]; // Copilot did this. idk regex. say thanks to copilot.
	let path = url.substring(urlhostname.length);

	let base64_urlhostname = toBase64(urlhostname);
	res.redirect(`/alloy/${base64_urlhostname}${path}`);
});

app.get('/', (req, res) => {
	res.redirect('https://inertia.up.railway.app');
});

server.listen(port, () => {
	console.log('Server running on port ' + port);
});
