/*

TODO:
1. Abstract pages into modules:

	PAGE TEMPLATE MODULE:
	- the template for a parallax scrolling page with an image at the top, a title bar, and content
		The page is generated on app load.
		The page is populated by calling a render function containing
			image,
			title,
			title-bar-color,
			date,
			items
				title,
				date,
				excerpt,
				enclosures,
				image,
				filtered-content
			filtered-content

	CONTENT TEMPLATE
	- one module is the template for a textview of content -- called from the template module

	ITEMS TEMPLATE
	- one module is the template for a list of items -- called from the template module

	BROWSER PAGE
	-- already done --

2. Fix Media Player
3. Fix Local Storage in web browser

EVENTUALLY:

1. Convert mobile pages to native widgets.
2. Allow Logging In.
3. Allow PayPal Donations.
4. Allow User Profile Management.

*/


var globals = require('./globals');

// import pages
var news = require('./news');
var data = require('./sample');
var http = require('./http');
var browser = require('./browser');
var home = require('./home');
var sermons = require('./sermons');
var player = require('./player');


var pages = {
	home: home.page,
	browser: browser.page,
	news: news.page,
	sermons: sermons.page,
}
home.page.open();

// preload the news
// http.get('http://lafayettecc.org/news/category/news/?json=true&posts_per_page=30&offset=0', function(result)
// {
// 	news.data = result.parsed;
// 	news.render();
// })
news.fetch({posts_per_page: 30, offset:0});

// preload the sermons
sermons.fetch();

// preload the live event page
browser.load('http://lafayettecc.org/live/');
// browser.go('loader.html');




// create the navigation drawer
var drawer = tabris.create("Drawer");

// background image
tabris.create('ImageView', {
	layoutData: {top:0, left:0, right:0, bottom:0},
	scaleMode: 'fill',
	image: 'img/light-background.jpg'
}).appendTo(drawer);

// header bar
var menu_header = tabris.create('Composite',{
	layoutData: {top:0, left:0, right:0, height:50},
	background: "#000",
	id: 'menu-header',
}).appendTo(drawer);
tabris.create('ImageView',{
	layoutData: {top:5, left:5, right:5, bottom:5},
	image: 'img/logo-ball-on-black.png',
	scaleMode: 'fit',
	id: 'drawer-image',
	background: "#000",
}).appendTo(menu_header);



// creating menu items
var menuItems = [
	{
		image: 'img/podcast-logo.jpg',
		title: 'Live Event',
		url: 'http://lafayettecc.org/live',
		fullscreen:true,
	},
	{
		image: 'img/podcast-logo.jpg',
		title: 'LCC News',
		page: 'news',
	},
	{
		image: 'img/podcast-logo.jpg',
		title: 'Messages',
		page: 'sermons'
	},
	{
		image: 'img/podcast-logo.jpg',
		title: 'Give Online',
		url: 'http://lafayettecc.org/give',
		fullscreen:true,
	},
	{
		image: 'img/podcast-logo.jpg',
		title: 'Prayer Request',
		url: 'http://lafayettecc.org/lcc_live/prayer_request',
		fullscreen:true,
	},
	{
		image: 'img/podcast-logo.jpg',
		title: 'Calendar',
		url: 'http://lafayettecc.org/mobile/calendar.php',
		fullscreen: true,
	},
	{
		image: 'img/podcast-logo.jpg',
		title: 'LCC Website',
		url: 'http://lafayettecc.org/news',
		fullscreen:false,
	},
	{
		image: 'img/podcast-logo.jpg',
		title: 'LCC Blogs',
		url: 'http://lafayettecc.org/blogs',
		fullscreen:false,
	},
]
tabris.create('CollectionView', {
	layoutData:{top:['#menu-header',1], left:0, right:0},
	items: menuItems,
	itemHeight: 50,
	initializeCell: function(cell) {
	    var imageView = tabris.create("ImageView", {
	    	layoutData: {left:0, top:0, width: 50, height: 50,},
			scaleMode: 'fill',
	    }).appendTo(cell);
	    var titleTextView = tabris.create("TextView", {
	    	layoutData: {left: [imageView, globals.MARGIN], centerY:0, right: globals.MARGIN},
	    	alignment: "left",
			wrap:false,
			markupEnabled:true,
			font:"bold 20px sans-serif",
	    }).appendTo(cell);
	    cell.on("change:item", function(widget, item) {
			var imgSource = item.image || "img/podcast-logo.jpg";
			imageView.set("image", {src: imgSource});
			titleTextView.set("text", item.title);
	    });
	}
}).on('select',function(target, item){
	if (typeof(item.url) != 'undefined')
	{
		browser.go(item.url, item.fullscreen);
		// browser.load(item.url);
		// if (item.fullscreen)
		// {
		// 	browser.window.appendTo(browser.fullscreen)
		// 	browser.go(url)
		// }
		// else
		// {
		// 	browser.window.appendTo(browser.page);
		// 	browser.page.open();
		// }
	}
	if (typeof(item.page) != 'undefined')
	{
		pages[item.page].open();
	}
	drawer.close();
}).appendTo(drawer)

// color drawer text white
drawer.apply('*', {textColor:"#559"})














function isArray(obj)
{
	return Object.prototype.toString.call( obj ) === Object.prototype.toString.call( [] );
}

function debug(obj)
{
	console.log(obj);
	var string = '';
	if (typeof(obj) == 'string') return '"'+value.replace(/"/g, '\\"')+'"';
	if (typeof(obj) == 'number') return obj;
	if (typeof(obj) == 'object')
	{
		if (isArray(obj))
		{
			string = '[';
			for (var i in obj)
			{
				string += debug(obj[i]);
				if (i < obj.length - 1) string += ',';
			}
			string += ']';
			return string;
		}
		else
		{
			string = '{';
			var keys = Object.keys(obj);
			for (var key in keys)
			{
				string += '"'+key+'": ';
				string += debug(obj[key]);
				if (i < keys.length - 1) string += ',';
			}
			string += '}';
			return string;
		}
	}
	return obj;
}

// console.log(debug(drawer.children()));


// special characters
// var arrow = String.fromCharCode(8592);

// widget helpers
function createLabel(text) {
  return tabris.create("TextView", {
    layoutData: {left: 10, centerY: 0},
    text: text,
    font: "22px Arial"
  });
}
