var globals = require('./globals');
var data = require('./sample');
var http = require('./http');
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

news.render = function()
{
	// dispose previous collection view
	if (this.collection) this.collection.dispose();
	
	// create the collection view
	this.collection = tabris.create('CollectionView', {
		layoutData:{top:['#header'], left:MARGIN, right:MARGIN, bottom:0},
		items: this.data.posts,
		itemHeight: 80,
		initializeCell: function(cell) {
		    var imageView = tabris.create("ImageView", {
		    	layoutData: {left:0, top:0, width: 80, height: 80},
				scaleMode: 'fill'
		    }).appendTo(cell);
			
			// text holder
			var textHolder = tabris.create('Composite', {
				layoutData: {left: [imageView, MARGIN], top:0, right: MARGIN, height:80}
			}).appendTo(cell);
			
			// date
			var dateTextView = tabris.create('TextView', {
				layoutData: {left: 0, top:0, height:12},
				alignment: 'left',
				markupEnabled: false,
				textColor: "rgb(200,200,200)",
				font: '10px',
			}).appendTo(textHolder);
			
			// title
		    var titleTextView = tabris.create("TextView", {
		    	layoutData: {left: 0, top:[dateTextView, 0], height:20},
		    	alignment: "left",
				wrap:false,
				markupEnabled:true,
				font: '16px',
				textColor:"rgba(0,0,0,.5)",
		    }).appendTo(textHolder);
			
			// summary
			var excerptTextView = tabris.create('TextView', {
				layoutData: {left:0, top:[titleTextView, 0], height:48},
				alignment:'left',
				wrap:true,
				markupEnabled:true,
				font: '10px',
				textColor: '#999'
			}).appendTo(textHolder);
			
		    cell.on("change:item", function(widget, post) {
				var imgSource = post.thumbnail || "img/podcast-logo.jpg";
				imageView.set("image", {src: imgSource});
				dateTextView.set('text', post.date);
				titleTextView.set("text", post.title);
				excerptTextView.set('text', post.excerpt.substr(0,100) + '...');
		    });
		}
	}).on('select',function(target, value){
		console.log('selected');
		console.log(value.title);
		var this_post = post.create(value);
		this_post.page.open();
	}).appendTo(this.page)
}


module.exports = news;