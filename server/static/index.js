window.addEventListener('load', event => {
	event.preventDefault();

	const params = new URLSearchParams(location.href).searchParams;
	let url = params.get('url');
	let usedGateway = params.get('usedGateway');
	alert(params);

	if (url == null || usedGateway != true) {
		window.location.href = 'https://inertia.up.railway.app/';
	}

	window.navigator.serviceWorker.register('./sw.js', {
		scope: __uv$config.prefix
	}).then(() => {
		if (url != null && usedGateway == true) window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
	});
});
