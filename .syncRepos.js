fs = require('fs');
const { exec } = require("child_process");

function checkFileExists(file) {
	return fs.promises.access(file, fs.constants.F_OK)
			 .then(() => true)
			 .catch(() => false)
}


if (checkFileExists('./.git/')) {
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
} else {
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
}