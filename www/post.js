var globals = require('./globals');
var htmltools = require('./htmltools');
var MARGIN = globals.MARGIN;
var MARGIN_SMALL = MARGIN / 2;
var titleCompY = 0;

var post = {}

post.create = function(data)
{
	var page = tabris.create("Page", {
		topLevel: false,
		title: "LCC News",
	});

	var scrollView = tabris.create("ScrollView", {
		layoutData: {left: 0, right: 0, top: 0, bottom: 0}
	}).appendTo(page);

	// the image at the top of the page
	var imageTextView = tabris.create("ImageView", {
		id: 'image',
		layoutData: {left: 0, top: 0, right: 0},
		image: data.image[0] || 'img/podcast-logo.jpg',
		scaleMode: 'fill',
	}).appendTo(scrollView);

	// the composite containing the text
	var contentComposite = tabris.create("Composite", {
	  layoutData: {left: 0, right: 0, top: ["#titleComposite", 0]},
	  background: "white"
	}).appendTo(scrollView);

	tabris.create("TextView", {
		id: 'content',
		layoutData: {left: MARGIN, right: MARGIN, top: MARGIN},
		markupEnabled: true,
		text: "<p><b>Click the title bar to view this post in a browser.</b></p>" + htmltools.filter(data.filtered),
	}).appendTo(contentComposite);

	// tabris.create("WebView", {
	// 	id: 'html',
	// 	layoutData: {left: MARGIN, right: MARGIN, top: MARGIN},
	// 	html: data.filtered,
	// }).appendTo(contentComposite);


	// the composite containing the title
	var titleComposite = tabris.create("Composite", {
	  id: "titleComposite",
	  background: "rgba(255,152,0,0.9)"
	}).appendTo(scrollView);

	// date
	tabris.create("TextView", {
		id: 'date',
		markupEnabled: true,
		text: data.date,
		font: "16px",
		layoutData: {left: MARGIN, top: MARGIN, right: MARGIN},
		textColor: "black"
	}).appendTo(titleComposite);

	// main heading
	tabris.create("TextView", {
		id: 'title',
		layoutData: {left: MARGIN, bottom: MARGIN_SMALL, right: MARGIN},
		markupEnabled: true,
		text: data.title,
		font: "24px",
		textColor: "white"
	}).appendTo(titleComposite);

	scrollView.on("resize", function(widget, bounds) {
		var imageHeight = bounds.width * 9 / 16; // image should have a 16/9 aspect ratio
		// imageTextView.set("image", {this.data.image[0], width: bounds.width, height: imageHeight});
		var titleCompHeight = titleComposite.get("bounds").height;
		// we need the offset of the title composite in each scroll event
		// it can only change when a change:bounds is triggered, so thats when we assign it
		titleCompY = Math.min(imageHeight, bounds.height / 2);
		titleComposite.set("layoutData", {left: 0, top: titleCompY, right: 0, height: 64});
	});

	scrollView.on("scroll", function(widget, offset) {
	  imageTextView.set("transform", {translationY: offset.y * 0.4});
	  if (titleCompY - offset.y < 0) {
	    titleComposite.set("transform", {translationY: offset.y - titleCompY});
	  } else {
	    titleComposite.set("transform", {translationY: 0});
	  }
	});

	titleComposite.on('tap', function(widget){
		var browser_page = tabris.create('Page', {
			title: 'Browser',
			topLevel:false
		});
		tabris.create('WebView', {
			id: 'browser',
			url: data.url,
			layoutData:{top:0, bottom:0, left:0, right:0},
		}).appendTo(browser_page);

		browser_page.open();
	});

	return {
		page: page,
		scrollView: scrollView,
		data: data
	}
}


post.update = function(post)
{
	this.data = post;
	this.page.find('#image').set('image', post.image[0] || 'img/podcast-logo.jpg');
	this.page.find('#title').set('text', post.title);
	this.page.find('#date').set('text', post.date);
	this.page.find('#content').set('text', htmltools.filter(post.filtered));
}

module.exports = post;