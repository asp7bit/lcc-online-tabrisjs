var globals = require('./globals');

// import pages
var news = require('./news');
var data = require('./data');
var browser = require('./browser');
var home = require('./home');


var pages = {
	home: home.page,
	browser: browser.page,
	news: news.page
}
home.page.open();
browser.go('http://lafayettecc.org/mobile', true);

// news.page.open();

// browser.page.set('title',"LCC Website");
// browser.window.set('url', "http://lafayettecc.org/mobile");
// browser.page.open()
// news.page.open()


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

// TODO: create menu manually instead of using the page selector
// var pageSelector = tabris.create("PageSelector", {
// 	id: '#drawer-collection',
// 	layoutData: {left: 0, top: ['#drawer-image',1], right: 0},
// }).appendTo(drawer);


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
		title: 'LCC News',
		page: 'news',
	},
	{
		image: 'img/podcast-logo.jpg',
		title: 'Messages',
		url: 'http://lafayettecc.org/mobile/custom_reader.php?all_series&cachebreaker=12',
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
			wrap:true,
			markupEnabled:true,
			font:"bold 24px",
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
		browser.window.set('url', item.url);
		if (item.fullscreen)
		{
			browser.window.appendTo(browser.fullscreen)
			browser.fullscreen.open();
		}
		else
		{
			browser.window.appendTo(browser.page);
			browser.page.open();
		}
	}
	if (typeof(item.page) != 'undefined')
	{
		pages[item.page].open();
	}
	drawer.close();
}).appendTo(drawer)















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
