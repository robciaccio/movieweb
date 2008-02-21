<%
	@script_info = {
		'title' => 'The Movie Dude',
		'title_short' => 'Movie Dude',
		'home' => 'http://adamv.com/dev/grease/moviedude',
		'contact' => 'Movie.Dude.Script@gmail.com',
		'version' => '1.7.8',
		'description' => "Cross-links movie sites so you don't have to."
	}
%>
// ==UserScript==
// @name <%= @script_info['title'] %>
// @namespace	http://adamv.com/greases/
// @description 	<%= @script_info['description'] %>
// @include	http://adamv.com/dev/grease/moviedude/
// @include	http://adamv.dev/dev/grease/moviedude/
// @include	http://imdb.com/title/*
// @include	http://*.imdb.com/title/*
// @include	http://netflix.com/Movie/*
// @include	http://www.netflix.com/Movie/*
// @include	http://www.blockbuster.com/catalog/movieDetails*
// @include http://blockbuster.co.uk/*
// @include http://www.blockbuster.co.uk/*
// @include	http://movies.yahoo.com/*
// @include	http://www.rottentomatoes.com/m/*
// @include	http://rogerebert.suntimes.com/*
// @include	http://amazon.com/*
// @include	http://*.amazon.com/*
// @include	http://amazon.ca/*
// @include	http://*.amazon.ca/*
// @include	http://amazon.co.uk/*
// @include	http://*.amazon.co.uk/*
// @include	http://allmovie.com/*
// @include	http://*.allmovie.com/*
// @include	http://www.greencine.com/webCatalog?*
// @include	http://www.metacritic.com/tv/*
// @include	http://www.metacritic.com/video/*
// @include	http://www.metacritic.com/film/*
// @include http://www.filmaffinity.com/*
// @include http://www.intelliflix.com/*
// @include http://www.flixster.com/*
// @include http://www.hbo.com/apps/schedule/*
// @include http://www.sho.com/site/schedules/*
// @include http://www.slantmagazine.com/film/*
// @include http://www.slantmagazine.com/tv/*
// @include http://www.slantmagazine.com/dvd/*
// @include http://www.movietome.com/*
// @include http://www.fandango.com/*
// @include http://www.scifi.com/sfw/screen/*
// @include http://criticker.com/*
// @include http://avclub.com/*
// @include http://www.avclub.com/*
// @include http://*.allocine.fr/*
// @include	http://*.zip.ca/browse/title.aspx?*
// @include http://www.moviestar.ie/films/*
// @include http://*.quickflix.com.au/*/viewmovie/*
// ==/UserScript==

var icons = {
	allmovie : "data:image/gif;base64,R0lGODlhEAAQAKIAAJPH5S%2BPyQx7v1yq2f3%2B%2F7%2Fg8%2B32%2FN3t%2BCH5BAAAAAAALAAAAAAQABAAAANJKLrcriA8FwiYrZCDVzAEIXXDEV4dAIDH%2BAyXSQwYQANhMQXFEOAEA80xKKhWp4dtMQi1Gr8GaMb49SSBksFQ0HkCLrDY1WkkAAA7",
	bb_us: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALKSURBVHjajFNLaxNRFP7uI5mkMWn6pNZ3Ka3tVpEqCgoVN27cuHDlShB3%2FgD9OQoi7orgQlBExG60INKW1j6saRObZJrMTO7cucczMUIFFw6cOWfuPee73%2FnOHXH1fAavn9%2BEMWOIOjEyGQ9KKYRhAJfE8HJ5KO3h89IqpieHAVVERjnPmdqwc95Rjf96BISQ6bvM8RAgx6XMnhXOTv4FQN23ZFN5ITN9gugMF04zlZmpiYFjWdWeEVQ%2FDhMUhQ1KZANohs1B6lmI3KhWmBHCTCHxZ3OifVLI5hCFzSLIoKByjOMxkyyIEkCXIPRwqJ2hc%2FDXXgjaH8kmPuACppLwZhmkhiDz00gBKF13HfYxf1tQZw%2BIY9JxRMVkd31ElhVcHEH0zwOZccBssO1xInuZ%2B62DHuQ9lkGPQZYnuj1r52Ci%2FaStrSi4rIQu8np9ASIzClG8yCBVwDsGWbzAcYXj0wy6AyFLcOEmVDOAWPhgvix%2Bitemhmh8cKy%2FLHUMcWQOcvQuH%2BwgZR6U9t5eAh0swtXfwFVfwu2%2FiwVz62cbYCs9up198PjhiXtUOglnudf8LBB9BcVpvw3WwHGax1YArIMjEaRjZHXA2agX%2BlVdyDYodxY4%2BAhqvWeqfSzBJKivwGRYxNiwZyDHmthQpgDx9UsFff%2FOibkrs615y1girvFUTzF13k4nY3YgreHYcf9NiKjJVRamI2z3Il2ephu3rkXPKPG0NRbw3%2FKk0lOIT2SKrbjTasQHDd%2F6fgvNle9uZ2PX1RoBtrsAW1u2Giw3AlFUpajtqLbvKpVqsrO8mWyvV9zeJsdrFbfrh6i3DbW3a1Tnc1pcalIA9WE12X3yKnq69ZPCxZVk81uV9n7Uk4YfoMlEQs7ppMk9rWzPJ%2BlaOgXVmwLfEhzpJfwpOFyUxq5XmPRiEt0r9ns2%2BR6YPVTkDhn96z%2F9JcAAPT9yR2OXfZIAAAAASUVORK5CYII%3D",
	blockbuster: 'data:image/gif;base64,R0lGODlhEAAQAKIAACMiNunXmvXRY9u4aGVJIKOFSRAibXF0fCH5BAAAAAAALAAAAAAQABAAAANjaLp7zgoQd2S4gJ0y7ijEIASZclyCGAyhIBBLyxYjQQsFI7JhALqDkmEgKtB4gZGQs0sRWgGYIrTbcUaVDIDIcxmBNgPg+rS6VgFTkeMjXN6mVOpCGIMAQq6xDtHUhX2BggYJADs=',
	ebert:
'data:image/gif;base64,R0lGODlhEAAQAKIAALCLa6g2NXggHMGjfqhpVdHHls2/kYFOPiH5BAAAAAAALAAAAAAQABAAAANbGKrUdCLKBYwt1gAp1MAXWAwTAVrAkBVEFHxXS6ykYmCYq2ZQsBqHIMwCmWWOx0IPWWg6m8sjYEqdRm+kzmLRuWVcqYG4N1R2ncAOQLQxXWqBmYjZWhiRt40iAQA7',
	moviestar: 'data:image/gif;base64,R0lGODlhEAAQANUAAJOYxXm85ixFmE9YoWW25Vy05G255qClzIWr17u%2F29bY6YWLvm%2BCunZ%2Bt57N7EFLmmpxrzM%2BknSg0nmczjhirD5QnqzH41Sy42aw4EJeqCo5kVeLxkSBwq6y1FdvsY2kzqK73DNSoZe94FBgpmRvrnaNwZiv1cnM4lprrOTl8UltskV0uFxlqPHy%2BLnZ76rR7Eyv4iYxi%2F%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAQABAAAAaUwJdQaGEwTK6k0jV8gTQx1uKzTDZLsZhCRnK8ls1K7CGTpVCItIj5ckyyi7Ksw6oPJpJRdnBoyf8tYjENfn%2BGLAJZLIWGZQAxHlljW40KMQIBiZIJjS0xEgEYGZIAjTIDAQEGBipZpWUnhQcbBgQEK64yLRBZDQkHFAQFBRRZEAkRkpIhBTDOWclZzjBZHBfT2NnYQQA7',

	noFavicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGHSURBVHjaYvz%2F%2Fz8DIyOjDAMDgzgQMzPgB6%2BA%2BBFQzz%2BYAEAAMYAMAALjHz9%2BfPj9%2B%2FffP3%2F%2B%2FMeGgfL%2Fp0yZMhGoVgGImUD6QBgggGAGmIE0f%2Fny5f%2FXr1%2Fh%2BOPHj%2F%2Ffv3%2F%2F%2F%2BXLl2BDnj9%2F%2Fn%2Fq1KkohgAE4GiOUQCAQhCA8u9%2Fgq7YFASGkx8dwkVfHj8DLtydSCZ9u6uZUXcHACA%2FqaogBr4AYoQaYApUcPLv379wr%2F379w%2FsOqA4A9BQBkFBQZTAYGFhMQdSpwECiAVZkImJCRSgcDbIQGZmZgY2NjYGoEvAhoIMFBMTg%2BsBCCAUA2CaYWyQZmQ%2BzEBkABBALPjiDNkQEBuEYQEHAwABxEIg3sGakL2GDgACiImBCADTDHINyDBkABBAOF2A7FRoagUHIjoACCCCXkA2CN12EAAIIBZ8zobZjA8ABBCyAf%2BhiQprtKKBf1DX%2FQcIIFB6Bmn8B4zj7zAJAgCk9huQBidbgABihDpTFpqdiYoVqOZXQL2PAQIMAIeX65Ph3kulAAAAAElFTkSuQmCC'
};

var site_columns = 5;

// -- Site definitions
var Sites = {
	allocine: {
		name: "AlloCiné",
		icon: "http://www.allocine.fr/favicon.ico",
		link: "http://www.allocine.fr/recherche/?rub=0&motcle={search}",
		scanURL: "allocine.fr",
		xpath: "//table//h1/b"
	},
	
	allmovie: {
		name: "All Movie",
		icon: icons.allmovie,
		form: ["http://www.allmovie.com/cg/avg.dll", {p: "avg", sql: "*", opt1:"12"}],
		scanURL:"allmovie.com",
		xpath: "//*[@class='title']"
	},

	am_us: {
		name: "Amazon (US)",
		xpath: "//b[@class='sans']",
		icon: "http://www.amazon.com/favicon.ico",
		link: "http://www.amazon.com/s/?url=search-alias%3Ddvd&field-keywords={search}", 
		scanURL:"amazon.com",
			
		validPage: function(pageTitle){return (pageTitle.indexOfAny(["DVD:", "movie info:"]) > -1);}
	},

	am_uk: {
		name: "Amazon (UK)",
		xpath: "//b[@class='sans']",
		icon: "http://www.amazon.co.uk/favicon.ico",
		link: "http://www.amazon.co.uk/s/?url=search-alias%3Ddvd&field-keywords={search}", 
		scanURL:"amazon.co.uk",
			
		validPage: function(pageTitle){return (pageTitle.indexOfAny(["DVD", "movie info:"]) > -1);}
	},

	am_ca: {
		name: "Amazon (CA)",
		xpath: "//b[@class='sans']",
		icon: "http://www.amazon.ca/favicon.ico",
		link: "http://www.amazon.ca/s/?url=search-alias%3Ddvd&field-keywords={search}", 
		scanURL:"amazon.ca",
			
		validPage: function(pageTitle){return (pageTitle.indexOfAny(["DVD", "movie info:"]) > -1);}
	},
	
	avclub: {
		name: "A.V. Club",
		link: "http://www.avclub.com/content/search/av/advanced2?search={search}&restrict=.site:avclub",
		xpath: "//div[@id='article_title']//h1",
		icon: "http://avclub.com/content/themes/avclub/favicon.ico",
		scanURL: "avclub.com"
	},

	bb: {
		name: "Blockbuster (US)",
		xpath: "//div[@class='contents contentsPrimary']//h1",
		link: "http://www.blockbuster.com/online/search/PerformKeyWordSearchAction?channel=Movies&subChannel=sub&keyword={search}",
		icon: icons.bb_us,
		scanURL:"blockbuster.com",
	},

	bb_uk: {
		name: "Blockbuster (UK)",
		xpath: "//table//div[@class='roundedYellow']/h2/div",
		link: "http://www.blockbuster.co.uk/{search}/0/basic.aspx",
		icon: icons.blockbuster,
		scanURL:"blockbuster.co.uk",
	},
	
	cdcovers: {
		name: "Cdcovers",
		link: "http://www.cdcovers.cc/search/all/{search}",
		icon: "http://www.cdcovers.cc/favicon.ico",
	//	scanURL: "cdcovers.cc"
	},
	
	covertarget: {
		name: "CoverTarget",
		link: "http://www.covertarget.com/s2.php?search={search}&cat=1",
		icon: "http://www.covertarget.com/favicon.ico",
	//	scanURL: "covertarget.com"
	},
	
	criticker: {
		name: "Criticker",
		xpath: "//div[@id='fi_info_filmname']",
		link: "http://criticker.com/?st=all&h={search}&g=Go",
		icon: "http://www.criticker.com/favicon.ico",
		scanURL: "criticker.com",
	},
	
	ebert: {
		name: "Ebert",
		xpath: "//span[@class='moviename']",
		icon: icons.ebert,
		scanURL:"rogerebert.suntimes.com",
		form: ["http://rogerebert.suntimes.com/apps/pbcs.dll/classifieds?category=search3", {
				Class: "60", Type: "",
				FromDate: "19150101", ToDate: "20051231",
				Start: 1,
				SortOrder: "AltTitle",
				Genre: "",
				GenreMultiSearch: "",
				RatingMultiSearch: "",
				MPAASearch: "",
				SearchType: "1",
				qrender: "", Partial: "", q: "*"}],
	},
	
	fandango: {
		name: "Fandango",
		link: "http://www.fandango.com/GlobalSearch.aspx?tab=Movies&q={search}&repos=Movies",
		scanURL: "fandango.com",
		icon: "http://www.fandango.com/favicon.ico",
		xpath: "//*[@class='sIFR-alternate']",
		insertBreak: false,
		
		getWhereToInsert: function(titleNode){
			var parent = document.getElementById('content');
			var where = document.createElement('div');
			parent.insertBefore(where, parent.firstChild);
			return where;
		},
		
		getTitleFromTitleNode: function(titleNode){
			return $T(titleNode.firstChild);
		},
	},

	filmaff: {
		name: "FilmAffinity",
		link: "http://www.filmaffinity.com/en/search.php?stype=title&stext={search}",
		scanURL: "filmaffinity.com",
		icon: "http://www.filmaffinity.com/favicon.ico",
		},
		
	flixster: {
		name: "Flixster",
		link: "http://www.flixster.com/movies.do?movieAction=doMovieSearch&search={search}",
		scanURL: "flixster.com",
		icon: "http://www.flixster.com/favicon.ico",
		xpath: "//*[@class='profile_mbox_header profile_mbox_title']",
		
		prepareToInsert: function(titleNode){
			titleNode.style.height = "auto";
		}
	},
	
	freecovers: {
		name: "FreeCovers",
		link: "http://www.freecovers.net/search.php?search={search}&cat=1",
		icon: "http://www.freecovers.net/favicon.ico",
		scanURL: "freecovers.net",
	},
	
	google_movies: {
		name: "Google Movies",
		link: "http://www.google.com/movies?q={search}",
		icon: "http://www.google.com/favicon.ico",
	},
	
	greencine: {
		name: "GreenCine",
		xpath: "//*[@class='header1']",
		icon: "http://www.greencine.com/central/files/niftydrupalclean_favicon.ico",
		form: ["http://www.greencine.com/catalogQuickSearch", {SEARCH_STRING: "*"}],
		scanURL:"greencine.com",
	},
	
	hbo: {
		name: "HBO Schedule",
		xpath: "//td[@class='rightnav-subhead']",
		scanURL: "hbo.com"
	},

	imdb: {
		name: "IMDb",
		link: "http://imdb.com/find?q={search};tt=on;nm=on;mx=20",
		icon: "http://imdb.com/favicon.ico",
		scanURL:"imdb.com",
		xpath: "//*[@id='tn15title']",

		validPage: function(pageTitle){return (pageTitle.indexOfAny(["(VG)"]) == -1);},
		
		getTitleFromTitleNode: function(titleNode){
			var smallNode = selectNode('.//small', titleNode);
			if (smallNode != null)
			{
				var a = selectNode(".//a", titleNode);
				if (a != null) 
					return $T(a);
			}

			return $T(titleNode);
		}
	},

	intelliflix: {
		name: "Intelliflix",
		xpath: "//td/font/font/b",
		link: "http://www.intelliflix.com/movie_search.dvd?source=simple&search_field=Keyword&search_text={search}&genre=0",
		icon: "http://www.intelliflix.com/favicon.ico",
		scanURL: "intelliflix.com",
	},

	metacritic: {
		name: "Metacritic",
		xpath: "//td[@id='rightcolumn']/h1",
		icon: "http://www.metacritic.com/favicon.ico",
		form: ["http://www.metacritic.com/search/process", { 
				sort: "relevance", termtype: "all", ts: "*", ty: "1" }],
		scanURL:"metacritic.com",
		
		processTitleNode: function(titleNode){
			var node = document.createElement("span");
			node.innerHTML = titleNode.firstChild.nodeValue;
			titleNode.replaceChild(node, titleNode.firstChild);
			return node;
		},
	},
	
	moviestar: {
		name: "Moviestar",
		link: "http://www.moviestar.ie/index.php?action=films/search&filter_search_for={search}",
		scanURL: "moviestar.ie",
		xpath: "//*[@class='movie_title']",
		icon: icons.moviestar,
	},

	movietome: {
		name: "MovieTome",
		icon: "http://www.movietome.com/favicon.ico",
		link: "http://www.movietome.com/search/index.php?qs={search}&tag=searchtop%3Bbutton",
		scanURL: "movietome.com",
		xpath: "//div[@id='content_head']//h1/a",

		getWhereToInsert: function(titleNode){
			return document.getElementById("eyebrow");
		},
	},
		
	netflix: {
		name: "NetFlix",
		xpath: "//div[@class='title']",
		link: "http://www.netflix.com/Search?v1={search}",
		icon: "http://cdn.nflximg.com/us/icons/nficon.ico",
		scanURL:"netflix.com",
	},
	
	quickflix: {
		name: "Quickflix",
		link: "http://www.quickflix.com.au/public/tools/viewsearchall.aspx?SearchText={search}",
		xpath: "//h1[@class='MovieTitle']",
		icon: "http://www.quickflix.com.au/favicon.ico",
		scanURL: "quickflix.com.au",
	},

	rotten: {
		name: "Rotten Tomatoes",
		xpath: "//h1[@class='movie_title']",
		link: "http://www.rottentomatoes.com/search/full_search.php?search={search}",
		icon: "http://www.rottentomatoes.com/favicon.ico",
		scanURL:"rottentomatoes.com",
	},
	
	scifiweekly: {
		name: "Sci Fi Weekly",
		link: "http://search.scifi.com/search?q={search}&btnG=Search&ie=&site=sfw&output=xml_no_dtd&client=sfw&lr=&proxystylesheet=sfw&oe=",
		xpath: "//span[@class='title']",
		scanURL: "scifi.com",
		icon: "http://www.scifi.com/favicon.ico",
		getTitle: function(movieName){
			foreach(["Unrated DVD", "DVD"], function(suffix){
				if (movieName.endsWith(suffix)){
					movieName = movieName.removeSuffix(suffix).trim();
					return true;
				}
			});
			
			// Strip off "Season-####..." from the name, to make external searches work better.
			var re = new RegExp("Season-.*(Premiere|DVD)$");
			movieName = movieName.replace(re, "");

			return movieName;
		}
	},
	
	sho: {
		name: "Showtime Schedule",
		xpath: "//*[@class='movietitle']",
		scanURL: "sho.com"
	},
	
	slant: {
		name: "Slant Magazine",
		xpath: "//div[@class='review_title']",
		scanURL: "slantmagazine.com",
		icon: "http://www.slantmagazine.com/favicon.ico"
	},

	walmart: {
		name: "Wal*Mart",
		link: "http://www.walmart.com/catalog/search-ng.gsp?search_constraint=4096&search_query={search}",
		icon: "http://www.walmart.com/favicon.ico",
		scanURL: "walmart.com",
		xpath: "//*[@class='title']",
	},

	wikipedia: {
		name: "Wikipedia",
		link: "http://en.wikipedia.org/wiki/Special:Search?search={search}&go=Go",
		icon: "http://en.wikipedia.org/favicon.ico",
		xpath: "//*[@class='title']",
	},
	
	yahoo: {
		name: "Yahoo",
		xpath: "//td/h1/strong|//td/big/b",
		link: "http://movies.yahoo.com/mv/search?p={search}",
		icon: "http://www.yahoo.com/favicon.ico",
		scanURL:"movies.yahoo.com",
	},
	
	youtube: {
		name: "YouTube",
		link: "http://www.youtube.com/results?search_query={search}&search=Search",
		icon: "http://www.youtube.com/favicon.ico",
		scanURL: "youtube.com"
	},
	
	zip_ca: {
		name: "Zip.ca",
<<<<<<< .mine
		link: "http://www.zip.ca/Browse/Search.aspx?test=1&f=wc({search})~t(-1)",
=======
		link: "http://www.zip.ca/browse/search.aspx?f=wc({seach})~t(-1)&j=1",
>>>>>>> .r27
		scanURL: "zip.ca",
		xpath: "//h3[@id='bc_WaveTitle']",
	},
};

var UserSites = {};

<%= include 'dude_framework.js' %>
