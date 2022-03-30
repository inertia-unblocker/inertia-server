import Server from 'bare-server-node';
import http from 'http';
import nodeStatic from 'node-static';

const bare =  new Server('/bare/', ''),
	serve = new nodeStatic.Server('server/static/'),
	server = http.createServer(),
	PORT = process.env.PORT || 5000;

server.on('request', (request, response) => {
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
