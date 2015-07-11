
module.exports = new function(){
	var http = {};

	http.encode = function(data)
	{
		var query = [];
		for (key in data)
		{
			query.push(key + '=' + encodeURIComponent(data[key]));
		}
		return query.join('&');
	}

	http.get = function(url, callback)
	{
		var options = {
			method: 'GET',
			url: url,
			callback: callback,
			data: {}
		}
		this.do(options);
	}

	http.post = function(url, data, callback)
	{
		var options = {
			method: 'POST',
			url: url,
			data: data,
			callback: callback,
		}
		this.do(options);
	}

	// grab arbitrary url
	http.do = function(options)
	{
		var url = options.url;
		var async = true;
		var method = options.method || 'GET';
		var params = this.encode(options.data) || '';

	    var xhr = new tabris.XMLHttpRequest();
		var callback = options.callback;

		// prepare the callback
		var that = this;
	    xhr.onreadystatechange = function() {
			if (xhr.readyState === xhr.DONE) {
				var result = xhr.responseText;
				var parsed = JSON.parse(result) || {};
				that.result = result;
				that.parsed = parsed;
				callback({'raw': result, 'parsed': parsed})
			}
	    };

		// prepare the url for GET requests
		if (method == 'GET')
		{
			if (url.indexOf('?') == -1) url += '?';
			else url += '&';

			url += params;
			console.log(url);
		}

		// actually open the connection
	    xhr.open(method, url, async);

		if (method == 'POST')
		{
			//Send the proper header information along with the request
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.setRequestHeader("Content-length", params.length);
			xhr.setRequestHeader("Connection", "close");
			xhr.send(params);
		}
		else
		{
			xhr.send();
		}
	}

	return http;
}
