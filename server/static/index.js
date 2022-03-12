window.addEventListener('load', event => {
	event.preventDefault();

	let url = new URLSearchParams(document.location.search).get('url');
	let usedGateway = new URLSearchParams(document.location.search).get('usedGateway');

	if (url == null || usedGateway != 'true') {
		window.location.href = 'https://inertia.up.railway.app/';
	}

	window.navigator.serviceWorker.register('./sw.js', {
		scope: __uv$config.prefix
	}).then(() => {
		if (url != null && usedGateway == 'true') window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
	});
});
