window.addEventListener('load', event => {
	event.preventDefault();

	let url = new URL(location.href).searchParams.get('url');

	if (typeof(url) != 'string') {
		window.location.href = 'https://www.google.com/';
	}

	window.navigator.serviceWorker.register('./sw.js', {
		scope: __uv$config.prefix
	}).then(() => {
		window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
	});
});
