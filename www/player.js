
var globals = require('./globals');
var MARGIN = Number(globals.MARGIN);


var player = {}

player.play = function(url){

	var page = tabris.create('Page', {
		topLevel: false,
	});

	tabris.create('Video', {
		id: 'video-player',
		layoutData:{left:0, right:0, top: 0, bottom:0},
		url: url,
	}).appendTo(page);

	page.open();
}

module.exports = player;