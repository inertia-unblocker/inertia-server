import Server from 'bare-server-node';
import http from 'http';
import nodeStatic from 'node-static';

const bare =  new Server('/bare/', ''),
	serve = new nodeStatic.Server('server/static/'),
	server = http.createServer(),
	PORT = process.env.PORT || 5000;

server.on('request', (request, response) => {
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
	response.setHeader('Access-Control-Max-Age', 2592000);
	response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
	response.setHeader('Access-Control-Allow-Credentials', 'true');

	if (bare.route_request(request, response)) return true;
	serve.serve(request, response);
});

server.on('upgrade', (req, socket, head) => {
	if(bare.route_upgrade(req, socket, head))return;
	socket.end();
});

server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});