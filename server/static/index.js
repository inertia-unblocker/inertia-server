window.addEventListener('load', async event => {
	event.preventDefault();
	
	let url = new URLSearchParams(document.location.search).get('url');
	
	if (url == null || url == '' || url == ' ' || typeof(url) == 'undefined') {
		window.location.href = 'https://inertia-unblocker.vercel.app/';
	}
	
	window.navigator.serviceWorker.register('./sw.js', {
		scope: __uv$config.prefix
	}).then(() => {
		window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
	});
});
