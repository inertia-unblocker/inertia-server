const express = require('express'),
	app = express();

let PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
	res.send('Hello from the backend');
});

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.listen(PORT, () => {
	console.log('Server is running on port ' + PORT);
});
