<%
	@script_info = {
		'title' => 'The Movie Dude',
		'title_short' => 'Movie Dude',
		'home' => 'http://adamv.com/dev/grease/moviedude',
		'contact' => 'Movie.Dude.Script@gmail.com',
		'version' => '1.6.1',
		'description' => "Cross-links game sites so you don't have to.",
	}
%>
// ==UserScript==
// @name The Movie Dude: Working Version
// @namespace	http://adamv.com/greases/
// @description 	<%= @script_info['description'] %>
// @include	http://adamv.com/dev/grease/moviedude*
// @include	http://imdb.com/title/*
// @include	http://*.imdb.com/title/*
// @include	http://netflix.com/MovieDisplay?*
// @include	http://www.netflix.com/MovieDisplay?*
// @include	http://blockbuster.com/*
// @include	http://www.blockbuster.com/*
// @include http://blockbuster.co.uk/*
// @include http://www.blockbuster.co.uk/*
// @include	http://movies.yahoo.com/*
// @include	http://www.rottentomatoes.com/m/*
// @include	http://rogerebert.suntimes.com/*
// @include	http://amazon.com/*
// @include	http://*.amazon.com/*
// @include	http://allmovie.com/*
// @include	http://*.allmovie.com/*
// @include	http://www.greencine.com/webCatalog?*
// @include	http://www.metacritic.com/tv/*
// @include	http://www.metacritic.com/video/*
// @include	http://www.metacritic.com/film/*
// @include http://www.filmaffinity.com/*
// @include http://www.intelliflix.com/*
// ==/UserScript==

var Defaults = { xpath: "//*[@class='title']" };

var icons = {
	allmovie : "data:image/gif;base64,R0lGODlhEAAQAKIAAJPH5S%2BPyQx7v1yq2f3%2B%2F7%2Fg8%2B32%2FN3t%2BCH5BAAAAAAALAAAAAAQABAAAANJKLrcriA8FwiYrZCDVzAEIXXDEV4dAIDH%2BAyXSQwYQANhMQXFEOAEA80xKKhWp4dtMQi1Gr8GaMb49SSBksFQ0HkCLrDY1WkkAAA7",
	blockbuster: 'data:image/gif;base64,R0lGODlhEAAQAKIAACMiNunXmvXRY9u4aGVJIKOFSRAibXF0fCH5BAAAAAAALAAAAAAQABAAAANjaLp7zgoQd2S4gJ0y7ijEIASZclyCGAyhIBBLyxYjQQsFI7JhALqDkmEgKtB4gZGQs0sRWgGYIrTbcUaVDIDIcxmBNgPg+rS6VgFTkeMjXN6mVOpCGIMAQq6xDtHUhX2BggYJADs=',
	ebert:
'data:image/gif;base64,R0lGODlhEAAQAKIAALCLa6g2NXggHMGjfqhpVdHHls2/kYFOPiH5BAAAAAAALAAAAAAQABAAAANbGKrUdCLKBYwt1gAp1MAXWAwTAVrAkBVEFHxXS6ykYmCYq2ZQsBqHIMwCmWWOx0IPWWg6m8sjYEqdRm+kzmLRuWVcqYG4N1R2ncAOQLQxXWqBmYjZWhiRt40iAQA7',

	noFavicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGHSURBVHjaYvz%2F%2Fz8DIyOjDAMDgzgQMzPgB6%2BA%2BBFQzz%2BYAEAAMYAMAALjHz9%2BfPj9%2B%2FffP3%2F%2B%2FMeGgfL%2Fp0yZMhGoVgGImUD6QBgggGAGmIE0f%2Fny5f%2FXr1%2Fh%2BOPHj%2F%2Ffv3%2F%2F%2F%2BXLl2BDnj9%2F%2Fn%2Fq1KkohgAE4GiOUQCAQhCA8u9%2Fgq7YFASGkx8dwkVfHj8DLtydSCZ9u6uZUXcHACA%2FqaogBr4AYoQaYApUcPLv379wr%2F379w%2FsOqA4A9BQBkFBQZTAYGFhMQdSpwECiAVZkImJCRSgcDbIQGZmZgY2NjYGoEvAhoIMFBMTg%2BsBCCAUA2CaYWyQZmQ%2BzEBkABBALPjiDNkQEBuEYQEHAwABxEIg3sGakL2GDgACiImBCADTDHINyDBkABBAOF2A7FRoagUHIjoACCCCXkA2CN12EAAIIBZ8zobZjA8ABBCyAf%2BhiQprtKKBf1DX%2FQcIIFB6Bmn8B4zj7zAJAgCk9huQBidbgABihDpTFpqdiYoVqOZXQL2PAQIMAIeX65Ph3kulAAAAAElFTkSuQmCC'
};

var SiteGroups = [
	["Information", ["imdb", "allmovie", "wikipedia"]],
	["Social", ["filmaff"]],
	["Rentals", ["netflix", "greencine", "intelliflix"]],
	["", ["bb", "bb_uk"]],
	["Critics", ["ebert","rotten", "metacritic"]],
	["Times &amp; Sales", ["amazon","yahoo", "walmart"]],
];

// -- Site definitions
var Sites = {
	allmovie: {
		name: "All Movie",
		icon: icons.allmovie,
		form: ["http://www.allmovie.com/cg/avg.dll", {P: "avg", srch: "*", TYPE:"12"}],
		scanURL:"allmovie.com",
		
		getTitle: function(title){return title.after(':');}
	},

	amazon: {
		name: "Amazon",
		xpath: "//b[@class='sans']",
		icon: "http://www.amazon.com/favicon.ico",
		link: "http://www.amazon.com/s/?url=search-alias%3Ddvd&field-keywords={search}", 
		scanURL:"amazon.com",
			
		validPage: function(pageTitle){return (pageTitle.indexOfAny(["DVD:", "movie info:"]) > -1);}
	},

	bb: {
		name: "Blockbuster",
		xpath: "//*[@class='headline1']",
		icon: icons.blockbuster,
		form: ["http://blockbuster.com/search/PerformKeyWordSearchAction.action",
			{schannel: "Movies", keyword: "*", searchType:"Movies"}],
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

	greencine: {
		name: "GreenCine",
		xpath: "//*[@class='header1']",
		icon: "http://www.greencine.com/favicon.ico",
		form: ["http://www.greencine.com/catalogQuickSearch", {SEARCH_STRING: "*"}],
		scanURL:"greencine.com",
	},

	imdb: {
		name: "IMDb",
		link: "http://imdb.com/find?q={search};tt=on;nm=on;mx=20",
		icon: "http://imdb.com/favicon.ico",
		scanURL:"imdb.com",
		xpath: Defaults.xpath,
		validPage: function(pageTitle){return (pageTitle.indexOfAny(["(VG)"]) == -1);}
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
		link: "http://www.netflix.com/Search?v1={search}&type=title&row=title&dtl=1",
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

	walmart: {
		name: "Wal*Mart",
		link: "http://www.walmart.com/catalog/search-ng.gsp?search_constraint=4096&search_query={search}",
		icon: "http://www.walmart.com/favicon.ico",
		scanURL: "walmart.com",
		xpath: Defaults.xpath,
	},

	wikipedia: {
		name: "Wikipedia",
		link: "http://en.wikipedia.org/wiki/Special:Search?search={search}&go=Go",
		icon: "http://en.wikipedia.org/favicon.ico",
		xpath: Defaults.xpath,
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
