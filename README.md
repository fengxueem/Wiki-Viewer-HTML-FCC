# Wiki-Viewer-HTML-FCC
A HTML webpage searches wikipedia, a practice solution designed in FCC

## About Wikipedia Search API
The official API Doc is right [here](https://www.mediawiki.org/wiki/API:Page_info_in_search_results).
And wiki provides a useful tool for us to test API online, it's named [API sandbox](https://en.wikipedia.org/wiki/Special:ApiSandbox).
The API I choose to query data is this:
	
	$.ajax({
		  url: "https://en.wikipedia.org/w/api.php",
		  data: {
			'action': 'query',
			'format': 'json',
			'prop': 'pageterms',
			'generator': 'prefixsearch',
			'formatversion': '2',
			'wbptterms': 'description',
			'gpslimit': '6',
			'gpssearch': ''
		  },
		  dataType: 'jsonp',
		  success: function (result) {
		  	//TODO
		  }
	});
		
jQuery's ajax() method seems to be a recommanded way to communicate with server based on the official API mentioned above. You could modify the "data" part following your specific need. Besides, I have to say the wikipedia's API can give any information combinations we may want.