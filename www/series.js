var globals = require('./globals');
var http = require('./http');
var htmltools = require('./htmltools');
var post = require('./single-series');

var MARGIN = Number(globals.MARGIN);

var series = {}

series.rendered = false;
series.data = {};
series.url = 'http://lafayettecc.org/news/series/?json=true';

series.fetch = function(options)
{
	// options should contain posts_per_page and offset if desirable
	var that = this;

	http.do({
		url: this.url,
		method: 'GET',
		data: options,
		callback: function(result)
		{
			that.data = result.parsed;
			that.render();
		}
	})
}

series.page = tabris.create("Page", {
	topLevel: true,
	title: "LCC News",
	image: 'img/podcast-logo.jpg',
});

series.render = function()
{
	// dispose previous collection view
	if (this.rendered)
	{
		this.collection.set('items', this.data.posts)
	}
	else
	{
		// create the collection view
		this.collection = tabris.create('CollectionView', {
			layoutData:{top:['#header'], left:MARGIN, right:MARGIN, bottom:0},
			items: this.data.posts,
			itemHeight: 81,
			initializeCell: function(cell) {

				// cell container to provide cell background
				var cellContainer = tabris.create("Composite",{
					layoutData: {top:0, left:0, right:0, height:80},
					background: "#eee",
				}).appendTo(cell)

			    var imageView = tabris.create("ImageView", {
			    	layoutData: {left:0, top:0, width: 80, height: 80},
					scaleMode: 'fill'
			    }).appendTo(cellContainer);

				// text holder
				var textHolder = tabris.create('Composite', {
					layoutData: {left: [imageView, 0], top:10, right: 10, height:80},
					background: "transparent",
				}).appendTo(cellContainer);

				// simple container to provide a bottom border
				var cellBorder = tabris.create("Composite",{
					layoutData: {bottom:0, left:0, right:0, height:1},
					background: "rgba(0,0,0,.3)",
				}).appendTo(cell);

				// date
				var dateTextView = tabris.create('TextView', {
					layoutData: {left: MARGIN, top:0, height:12},
					alignment: 'left',
					markupEnabled: false,
					textColor: "#999",
					font: '10px',
				}).appendTo(textHolder);

				// title
			    var titleTextView = tabris.create("TextView", {
			    	layoutData: {left: MARGIN, top:[dateTextView, 0], height:20},
			    	alignment: "left",
					wrap:false,
					markupEnabled:true,
					font: '16px',
					textColor:"#555",
			    }).appendTo(textHolder);

				// summary
				var excerptTextView = tabris.create('TextView', {
					layoutData: {left:MARGIN, top:[titleTextView, 0], height:48},
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
		}).appendTo(this.page);
	}


	this.rendered = true;
}


module.exports = series;