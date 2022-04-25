fs = require('fs');
const { exec } = require("child_process");

fs.access('./.git', fs.F_OK, (err) => {
	if (err) {
		console.log('.git not found, cloning repo')

		exec('git clone https://github.com/inertia-unblocker/uv-scripts ./server/static/uv', (err, stdout, stderr) => {
			if (err) {
				console.error(err);
				return;
			}
			if (stderr) {
				console.error(stderr);
				return;
			}
			console.log(stdout);
		});

		return
	}

	console.log('.git found, using submodules')
	exec('git submodule update --init', (err, stdout, stderr) => {
		if (err) {
			console.error(err);
			return;
		}
		if (stderr) {
			console.error(stderr);
			return;
		}
		console.log(stdout);
	});
});