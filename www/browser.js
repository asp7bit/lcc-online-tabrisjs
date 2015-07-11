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

browser.throbber = tabris.create('ProgressBar', {
	layoutData:{top:0, left:0, right:0, height:30},
	maximum:100,
	selection:0,
});

browser.throb = function(on)
{
	if (on)
	{
		var that = this;
		browser.throbber.set('visible', true);
		browser.throbber.timer = setInterval(function()
		{
			var selection = that.throbber.get('selection') + 1;
			if (selection > 100) that.throb(false);
			that.throbber.set('selection', selection);
		}, 20);
	}
	else
	{
		browser.throbber.set('visible', false);
		browser.throbber.set('selection', 0);
		clearInterval(browser.throbber.timer);
	}
}


browser.window = tabris.create("WebView", {
	layoutData: {top:0, left:0, right:0, bottom:0},
	url: "http://lafayettecc.org/live/",
	setDomStorageEnabled: true,
})

browser.load = function(url)
{
	this.window.set('url', url);
}

browser.go = function(url, fullscreen)
{
	
	if (fullscreen)
	{
		this.window.appendTo(this.fullscreen);
		this.throbber.appendTo(this.fullscreen);
		this.fullscreen.open();
	}
	else
	{
		this.window.appendTo(this.page);
		this.throbber.appendTo(this.page);
		this.page.open();
	}
	
	// show the webview with the loader
	this.throb(true);
	this.load(url);
	
	// now load the real url
	var that = this;
	window.setTimeout(function(){that.throb(false)}, 10000);
}

module.exports = browser;
