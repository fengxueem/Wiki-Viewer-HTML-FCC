var gpsoffset = 0;
var wikiApiURL= "https://en.wikipedia.org/w/api.php"
var dataList = {
			'action': 'query',
			'format': 'json',
			'prop': 'pageterms',
			'generator': 'prefixsearch',
			'formatversion': '2',
			'wbptterms': 'description',
			'gpslimit': '6',
			'gpssearch': ''
		};

function listPageInfo(pages) {
	var pageTitle = "";
	var pageDescription = "";
	var pageInfoHTML = '<div class="row">';
	for (var i = 0; i < pages.length; i++) {
		// put three page info in one row
		pageTitle = pages[i].title;
		// not a term and description will return everytime
		if (pages[i].hasOwnProperty("terms") && pages[i].terms.hasOwnProperty("description")) {
		    pageDescription = pages[i].terms.description[0];
		}
		pageInfoHTML += 
		'<div class="col-xs-12 col-sm-6 col-md-4">\
			<h4>' + pageTitle + '</h4>\
			<p>'
			 	+ pageDescription + 
			 '</p>\
			<a target="_blank" href="https:\/\/en.wikipedia.org\/wiki\/'
			 + pageTitle.replace(/\s/g, "_") + '"> Read More\
			</a>\
		</div>';
		if ( i != pages.length - 1 && (i+1) % 3 == 0 ) {
			pageInfoHTML += '</div><div class="row">';
		}
	}
	pageInfoHTML += '</div>';
	$(pageInfoHTML).appendTo('.search-result');
}

function searchTopic(offset) {
	// load search topic from input
	dataList.gpssearch = $("#search").val();
	if (offset != 0) {
		dataList.continue = "gpsoffset||";
		dataList.gpsoffset = offset;
	}
	$.ajax({
		// accroding https://www.mediawiki.org/wiki/API:Search_and_discovery#Query_list_submodules
		// jQuery's $.ajax() needs a JSONP handler.
		  url: wikiApiURL,
		  data: dataList,
		  dataType: 'jsonp',
		  success: function (result) {
		  	// if there is no more to load from server than hide the load more button
		  	if (result.hasOwnProperty("continue")) {
		  		// update the offset and show the load more button 
		  		//since "continue" means there are more to query.
		  		gpsoffset = result.continue.gpsoffset;
		  		showLoadMore(true);
		  	} else {
		  		showLoadMore(false);
		  	}
		  	// list the page info only when we read a "query" from server's response
		  	if (result.hasOwnProperty("query")) {
		    	listPageInfo(result.query.pages);
		    }
		  }
	});
}

function showLoadMore(isShow) {
	if (isShow) {
		$("#loadMore").removeClass("hidden");
	} else {
		$("#loadMore").addClass("hidden");
	}
}

function resetSearch() {
	$("div.search-result").html(" ");
	gpsoffset = 0;
	dataList = {
		'action': 'query',
		'format': 'json',
		'prop': 'pageterms',
		'generator': 'prefixsearch',
		'formatversion': '2',
		'wbptterms': 'description',
		'gpslimit': '6',
		'gpssearch': ''
	};
}

$(document).ready(function() {
  $("#searchButton").click(function() {
	if ($("#search").val() == "") {
		// clear the search history when start a random search
		resetSearch();
		$("#searchButton").attr("href", "https://en.wikipedia.org/wiki/Special:Random");
		// make sure the load more button is hidden
		showLoadMore(false);
	} else {
		$("#searchButton").removeAttr("href");
		// clear the search history when start a new search
		resetSearch();
		searchTopic(0); // this parameter is a offset
	}
  });
  $("#loadMore").click(function() {
  	// start the search from the offset given by wikipedia server
  	searchTopic(gpsoffset);
  });
});
