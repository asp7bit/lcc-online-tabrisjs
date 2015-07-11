// home page
var home = {}
home.page = tabris.create("Page", {
	topLevel: true,
	title: "Home",
	image: 'img/lcc-app-texture.png',
});

tabris.create('ImageView', {
	layoutData: {top:0, bottom:0, left:0, right:0},
	scaleMode: 'fill',
	image: 'img/podcast-logo.jpg'
}).appendTo(home.page);

module.exports = home;
