import createBareServer from '@tomphttp/bare-server-node';
import { createServer } from 'http';

const PORT = process.env.PORT || 5000;
const httpServer = createServer();
const bareServer = createBareServer('/bare/', {
	maintainer: {
		email: 'inertia.unblocker@gmail.com',
		website: 'https://github.com/inertia-unblocker',
	},
});

httpServer.on('request', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Max-Age', '86400');

	if (bareServer.shouldRoute(req)) bareServer.routeRequest(req, res);
	else res.writeHead(400);
});

httpServer.on('upgrade', (req, socket, head) => {
	if (bareServer.shouldRoute(req)) bareServer.routeUpgrade(req, socket, head);
	else socket.end();
});

httpServer.on('listening', () => console.log(`Listening on port ${PORT}`));
httpServer.listen(PORT);