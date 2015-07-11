var browser = {}

// toplevel windows don't despawn on close
browser.page = tabris.create("Page", {
	title: "LCC Website",
	topLevel: true,
})

// toplevel windows don't despawn on close
browser.fullscreen = tabris.create("Page", {
	title: "LCC Website",
	topLevel: true,
	style: ['FULLSCREEN']
})

browser.window = tabris.create("WebView", {
	layout: {top:0, left:0, right:0, bottom:0},
	url: "http://lafayettecc.org/live/",
	setDomStorageEnabled: true,
})

browser.go = function(url, fullscreen)
{
	if (fullscreen)
	{
		this.window.set('url', url);
		this.window.appendTo(this.fullscreen);
		this.fullscreen.open();
	}
	else
	{
		this.window.set('url', url);
		this.window.appendTo(this.page);
		this.page.open();
	}
}

module.exports = browser;
