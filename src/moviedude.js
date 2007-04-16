<%
	@script_info = {
		'title' => 'The Movie Dude',
		'title_short' => 'Movie Dude',
		'home' => 'http://adamv.com/dev/grease/moviedude',
		'contact' => 'Movie.Dude.Script@gmail.com',
		'version' => '1.6.7',
		'description' => "Cross-links game sites so you don't have to.",
	}
%>
// ==UserScript==
// @name The Movie Dude
// @namespace	http://adamv.com/greases/
// @description 	<%= @script_info['description'] %>
// @include	http://adamv.com/dev/grease/moviedude*
// @include	http://imdb.com/title/*
// @include	http://*.imdb.com/title/*
// @include	http://netflix.com/Movie/*
// @include	http://www.netflix.com/Movie/*
// @include	http://www.blockbuster.com/online/catalog/movieDetails*
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
// @include http://filmspot.com/*
// @include http://www.filmspot.com/*
// ==/UserScript==

var icons = {
	allmovie : "data:image/gif;base64,R0lGODlhEAAQAKIAAJPH5S%2BPyQx7v1yq2f3%2B%2F7%2Fg8%2B32%2FN3t%2BCH5BAAAAAAALAAAAAAQABAAAANJKLrcriA8FwiYrZCDVzAEIXXDEV4dAIDH%2BAyXSQwYQANhMQXFEOAEA80xKKhWp4dtMQi1Gr8GaMb49SSBksFQ0HkCLrDY1WkkAAA7",
	blockbuster: 'data:image/gif;base64,R0lGODlhEAAQAKIAACMiNunXmvXRY9u4aGVJIKOFSRAibXF0fCH5BAAAAAAALAAAAAAQABAAAANjaLp7zgoQd2S4gJ0y7ijEIASZclyCGAyhIBBLyxYjQQsFI7JhALqDkmEgKtB4gZGQs0sRWgGYIrTbcUaVDIDIcxmBNgPg+rS6VgFTkeMjXN6mVOpCGIMAQq6xDtHUhX2BggYJADs=',
	ebert:
'data:image/gif;base64,R0lGODlhEAAQAKIAALCLa6g2NXggHMGjfqhpVdHHls2/kYFOPiH5BAAAAAAALAAAAAAQABAAAANbGKrUdCLKBYwt1gAp1MAXWAwTAVrAkBVEFHxXS6ykYmCYq2ZQsBqHIMwCmWWOx0IPWWg6m8sjYEqdRm+kzmLRuWVcqYG4N1R2ncAOQLQxXWqBmYjZWhiRt40iAQA7',

	noFavicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGHSURBVHjaYvz%2F%2Fz8DIyOjDAMDgzgQMzPgB6%2BA%2BBFQzz%2BYAEAAMYAMAALjHz9%2BfPj9%2B%2FffP3%2F%2B%2FMeGgfL%2Fp0yZMhGoVgGImUD6QBgggGAGmIE0f%2Fny5f%2FXr1%2Fh%2BOPHj%2F%2Ffv3%2F%2F%2F%2BXLl2BDnj9%2F%2Fn%2Fq1KkohgAE4GiOUQCAQhCA8u9%2Fgq7YFASGkx8dwkVfHj8DLtydSCZ9u6uZUXcHACA%2FqaogBr4AYoQaYApUcPLv379wr%2F379w%2FsOqA4A9BQBkFBQZTAYGFhMQdSpwECiAVZkImJCRSgcDbIQGZmZgY2NjYGoEvAhoIMFBMTg%2BsBCCAUA2CaYWyQZmQ%2BzEBkABBALPjiDNkQEBuEYQEHAwABxEIg3sGakL2GDgACiImBCADTDHINyDBkABBAOF2A7FRoagUHIjoACCCCXkA2CN12EAAIIBZ8zobZjA8ABBCyAf%2BhiQprtKKBf1DX%2FQcIIFB6Bmn8B4zj7zAJAgCk9huQBidbgABihDpTFpqdiYoVqOZXQL2PAQIMAIeX65Ph3kulAAAAAElFTkSuQmCC'
};

var SiteGroups = [
	["Information", ["imdb", "allmovie", "wikipedia", "filmspot"]],
	["Social", ["filmaff", "flixster"]],
	["Rentals", ["netflix", "greencine", "intelliflix"]],
	["", ["bb", "bb_uk"]],
	["Critics", ["ebert","rotten", "metacritic", "slant"]],
	["Times &amp; Sales", ["yahoo", "walmart"]],
	["Amazon", ["am_us", "am_uk", "am_ca"]]
];

// -- Site definitions
var Sites = {
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

	bb: {
		name: "Blockbuster (US)",
		xpath: "//div[@class='pagetitle']//h1",
		link: "http://www.blockbuster.com/online/search/PerformKeyWordSearchAction?channel=Movies&subChannel=sub&keyword={search}",
		icon: "http://www.blockbuster.com/app/v.4.12.2/img/favicon.png",
		scanURL:"blockbuster.com",
	},

	bb_uk: {
		name: "Blockbuster (UK)",
		xpath: "//table//div[@class='roundedYellow']/h2/div",
		link: "http://www.blockbuster.co.uk/{search}/0/basic.aspx",
		icon: icons.blockbuster,
		scanURL:"blockbuster.co.uk",
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

	filmaff: {
		name: "FilmAffinity",
		link: "http://www.filmaffinity.com/en/search.php?stype=title&stext={search}",
		scanURL: "filmaffinity.com",
		},
		
	filmspot: {
		name: "FilmSpot",
		link: "http://www.filmspot.com/search/index.php?qs={search}&tag=search%3Bbutton",
		// scanURL: "filmspot.com",
		xpath: "//div[@id='content_head']//h1/a"
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

	greencine: {
		name: "GreenCine",
		xpath: "//*[@class='header1']",
		icon: "http://www.greencine.com/favicon.ico",
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

	netflix: {
		name: "NetFlix",
		xpath: "//div[@class='title']",
		link: "http://www.netflix.com/Search?v1={search}",
		icon: "http://cdn.nflximg.com/us/icons/nficon.ico",
		scanURL:"netflix.com",
	},

	rotten: {
		name: "Rotten Tomatoes",
		xpath: "//div[@id='main']//td//div",
		link: "http://www.rottentomatoes.com/search/full_search.php?search={search}",
		icon: "http://www.rottentomatoes.com/favicon.ico",
		scanURL:"rottentomatoes.com",
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
};

var UserSites = {};

<%= include 'dude_framework.js' %>
