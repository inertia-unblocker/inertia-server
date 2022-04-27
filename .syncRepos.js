fs = require('fs');
const { exec } = require("child_process");

fs.access('./.git', fs.F_OK, (err) => {
	if (err) {
		console.log('.git not found, cloning repo')

		exec('git clone https://github.com/inertia-unblocker/uv-scripts ./server/static/uv', (err, stdout, stderr) => {
			if (err) {
				// the zip file way
				exec('wget https://github.com/inertia-unblocker/uv-scripts/archive/refs/heads/main.zip')
				exec('unzip uv-scripts-main.zip')
				exec('mv uv-scripts-main/* server/static/uv')
				exec('rm -rf uv-scripts-main')
				
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