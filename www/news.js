var globals = require('./globals');
var data = require('./data');
var htmltools = require('./htmltools');
var post = require('./post');

var MARGIN = Number(globals.MARGIN);

var news = {}

news.data = data;
news.page = tabris.create("Page", {
	topLevel: true,
	title: "LCC News",
	image: 'img/podcast-logo.jpg',
});

// create the pretty scrolling area
// var scroller = tabris.create('ScrollView',{
// 	id: 'scroller',
// 	layoutData: {top:0, left:0, right:0, bottom:0}
// }).appendTo(news.page);

// // create the pretty picture
// var header = tabris.create('ImageView', {
// 	id: 'header',
// 	layoutData: {top:0, left:0, right:0, height:30},
// 	image: 'img/podcast-logo.jpg',
// 	scaleMode: 'fill',
// }).appendTo(scroller);

// create the collection view
tabris.create('CollectionView', {
	layoutData:{top:['#header'], left:MARGIN, right:MARGIN, bottom:0},
	items: news.data.posts,
	itemHeight: 50,
	initializeCell: function(cell) {
	    var imageView = tabris.create("ImageView", {
	    	layoutData: {left:0, top:0, width: 50, height: 50,}
	    }).appendTo(cell);
	    var titleTextView = tabris.create("TextView", {
	    	layoutData: {left: [imageView, MARGIN], centerY:0, right: MARGIN},
	    	alignment: "left",
			wrap:true,
			markupEnabled:true,
			color:"#rgba(255,0,0,.5)",
	    }).appendTo(cell);
	    cell.on("change:item", function(widget, post) {
			var imgSource = post.thumbnail || "img/podcast-logo.jpg";
			imageView.set("image", {src: imgSource});
			imageView.set('scaleMode', 'fill');
			titleTextView.set("text", post.title);
	    });
	}
}).on('select',function(target, value){
	console.log('selected');
	console.log(value.title);
	var this_post = post.create(value);
	this_post.page.open();
}).appendTo(news.page)

module.exports = news;