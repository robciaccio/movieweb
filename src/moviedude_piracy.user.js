/*
The Movie Dude, w/ piracy sites

Version 1.5.13b
10 June 2006
Copyright (c) 2005-6, Adam Vandenberg
Released under the GPL license
http://www.gnu.org/copyleft/gpl.html
*/
// ==UserScript==
// @name The Movie Dude
// @namespace	http://adamv.com/greases/
// @description 	Cross-links movie sites so you don't have to.
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
// @include http://www.peerflix.com/*
// ==/UserScript==

var Version = "1.5.13b";

var icons = {
	allmovie : "data:image/gif;base64,R0lGODlhEAAQAKIAAJPH5S%2BPyQx7v1yq2f3%2B%2F7%2Fg8%2B32%2FN3t%2BCH5BAAAAAAALAAAAAAQABAAAANJKLrcriA8FwiYrZCDVzAEIXXDEV4dAIDH%2BAyXSQwYQANhMQXFEOAEA80xKKhWp4dtMQi1Gr8GaMb49SSBksFQ0HkCLrDY1WkkAAA7",
	blockbuster: 'data:image/gif;base64,R0lGODlhEAAQAKIAACMiNunXmvXRY9u4aGVJIKOFSRAibXF0fCH5BAAAAAAALAAAAAAQABAAAANjaLp7zgoQd2S4gJ0y7ijEIASZclyCGAyhIBBLyxYjQQsFI7JhALqDkmEgKtB4gZGQs0sRWgGYIrTbcUaVDIDIcxmBNgPg+rS6VgFTkeMjXN6mVOpCGIMAQq6xDtHUhX2BggYJADs=',
	ebert:
'data:image/gif;base64,R0lGODlhEAAQAKIAALCLa6g2NXggHMGjfqhpVdHHls2/kYFOPiH5BAAAAAAALAAAAAAQABAAAANbGKrUdCLKBYwt1gAp1MAXWAwTAVrAkBVEFHxXS6ykYmCYq2ZQsBqHIMwCmWWOx0IPWWg6m8sjYEqdRm+kzmLRuWVcqYG4N1R2ncAOQLQxXWqBmYjZWhiRt40iAQA7',

	noFavicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGHSURBVHjaYvz%2F%2Fz8DIyOjDAMDgzgQMzPgB6%2BA%2BBFQzz%2BYAEAAMYAMAALjHz9%2BfPj9%2B%2FffP3%2F%2B%2FMeGgfL%2Fp0yZMhGoVgGImUD6QBgggGAGmIE0f%2Fny5f%2FXr1%2Fh%2BOPHj%2F%2Ffv3%2F%2F%2F%2BXLl2BDnj9%2F%2Fn%2Fq1KkohgAE4GiOUQCAQhCA8u9%2Fgq7YFASGkx8dwkVfHj8DLtydSCZ9u6uZUXcHACA%2FqaogBr4AYoQaYApUcPLv379wr%2F379w%2FsOqA4A9BQBkFBQZTAYGFhMQdSpwECiAVZkImJCRSgcDbIQGZmZgY2NjYGoEvAhoIMFBMTg%2BsBCCAUA2CaYWyQZmQ%2BzEBkABBALPjiDNkQEBuEYQEHAwABxEIg3sGakL2GDgACiImBCADTDHINyDBkABBAOF2A7FRoagUHIjoACCCCXkA2CN12EAAIIBZ8zobZjA8ABBCyAf%2BhiQprtKKBf1DX%2FQcIIFB6Bmn8B4zj7zAJAgCk9huQBidbgABihDpTFpqdiYoVqOZXQL2PAQIMAIeX65Ph3kulAAAAAElFTkSuQmCC'
};

function $(o) {
	if (typeof(o) == "string") return document.getElementById(o)
	else return o;
}

function hide(id){
	var e = $(id);
	if (e) e.style.display = "none";
}

function addEvent(elementID, eventName, handler, b){
	var e = $(elementID);
	if (e) e.addEventListener(eventName, handler, b);
}

function indexOfAny(s, charsOrStringList){
	var index=-1;
	foreach(charsOrStringList, function(token){
		index = s.indexOf(token);
		if (-1 < index) return true;
	});
	return index;
}

String.prototype.important = function(){ return this.replace(";", " !important;");}

String.prototype.trim = function() {
	var s = this.replace(/^\s*(.*)/m, "$1");
	s = s.replace(/(.*?)\s*$/m, "$1");
	return s; };

String.prototype.template = function(vars){
	return this.replace( 
		/\{(\w*)\}/g,
		function(match,submatch,index){return vars[submatch];}
	) };

String.prototype.endsWith = function(suffix){
	var lastIndex = this.lastIndexOf(suffix);
	return (-1 < lastIndex) && (lastIndex == (this.length-suffix.length));
}

String.prototype.removeSuffix = function(suffix){
	if (this.endsWith(suffix)) return this.substring(0, this.length-suffix.length);
	else return this;
}

String.prototype.after = function(s){
	var index = this.indexOf(s);
	var length = s.length || 1;
	if (-1 < index) return this.substring(index+length);
	else return this;
}

function can(f){}
function foreach(stuff, f){ for(var i=0; i < stuff.length; i++) if ( f(stuff[i]) ) return; }
function foreach_dict(stuff, f){ for(var name in stuff) if ( f(name, stuff[name]) ) return; }
function collect(f, stuff) {
	var list = [];
	foreach(stuff, function(item){list.push(f(item))});
	return list;
}
	
function selectNode(selector, rootElement){ return xpath(selector, rootElement, null, true); }
function xpath(selector, rootElement, f_each, firstOnly){
	var results = document.evaluate(
		selector, rootElement || document, null,
		XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
		
	// If we have a callback function, run it on the results
	if (f_each != null){
		while(result = results.iterateNext()) { f_each(result); }
		return;
	}
	
	// If we're only getting the first result, do that
	if (firstOnly){ return results.iterateNext(); }
}

function addCSS(){ 
	for(var i=0;i<arguments.length;i++)
		GM_addStyle(arguments[i]);
}

function HidePreferences(event){ hide("_md_prefs");}

function setPreference(event){GM_setValue(this.value, this.checked);}

function AddOurStyles(){
addCSS(
"#_md_prefs {position:fixed; bottom:auto; left:0; right:0; top:0; color:black; font: normal 11px sans-serif; background:#eee; border-bottom:2px #69c solid}",
"#_md_prefs, #_md_prefs td {font-family: verdana, sans-serif; font-size: 10pt}",
"#_md_prefs div {padding:5px 0 0.4em 0; margin: 0px auto;width: 700px}",
"#_md_prefs button {font: normal 11px sans-serif; border: 1px solid #0080cc; color: #333; cursor: pointer; background: #FFF}"
);}

function wodge(){
	var q = [], output = [];
	foreach(arguments, function(item){q.unshift(item);});
	
	var item = null;
	while (q.length > 0){
		item = q.pop();
		
		if (typeof(item) == "function")
			q.unshift(item());
		else if ((typeof(item) != "string") && (item.length != null))
			foreach(item, function(item){q.unshift(item);});
		else if (item != null)
			output.push(item.toString());
	}	
	return output.join("");
}

function Maker(label){
	return function(){
		var s =  "<"+label+">"+wodge(arguments)+"</"+label+">";
		return s; } }

var Html = {};
foreach(['table','tr','td'], function(item){Html[item]=Maker(item);})

function rowify(row /* array of cells */){ 
	return Html.tr(collect(Html.td, row));  }

function Table(rows){ return Html.table(collect(rowify,rows)); }

var Select = {
	create: function (name, selectedValue, options){
		var s = '<select id="{name}">'.template({name: name});
		foreach(options, function(option){
			var selected = (option[0] == selectedValue)?' selected="selected"':"";
			s += '<option value="{value}"{selected}>{caption}</option>'.template({value: option[0], caption: option[1], selected: selected});
		});
		s += "</select>";
		return s;
	}
};

function ShowPreferences(){	
	var prefs = document.getElementById("_md_prefs");
	if(!prefs){
		AddOurStyles();
		var siteMenu = [
			["Information", ["imdb", "allmovie", "wikipedia"]],
			["Social", ["filmaff"]],
			["Rentals", ["netflix", "greencine", "peerflix"]],
			["", ["bb", "bb_uk"]],
			["Critics", ["ebert","rotten", "metacritic"]],
			["Times &amp; Sales", ["amazon","yahoo", "walmart"]],
			["Piracy", ["piratebay","newzbin"]],
		];
		
		var prefs = document.createElement("div")
		prefs.id = "_md_prefs";
		
		var s = "<div>";
		s += "<b>The Movie Dude</b><br />"
		s += "<font color='#336699'>"+Version+"</font> - ";
		s += "<a href='http://adamv.com/dev/grease/moviedude'>Home Page</a> - <a href='mailto:Movie.Dude.Script@gmail.com'>Contact</a><br />";
		s += "<br />";
		
		s += "<b>Display as:</b> ";
		s += Select.create("_md_display_type", GM_getValue("linkStyle", "0"), 
			[["0", "Text &amp; Icons"],["1", "Icons only"],["2","Text only"]]);

		s += '<br />';
		s += "<b>Show links to:</b><br />";
		var linkStyle = GM_getValue("linkStyle", "0");
		
		var table = [];
		foreach(siteMenu, function(group){
			var row = [];
			row.push("<font color='#336699'>"+group[0] + ":</font>");
			foreach(group[1], function(siteID){
				var siteName = siteNames[siteID];
				var checked = (GM_getValue(siteID, true)) ? " checked='checked'" : "";
				
				row.push( "&nbsp;<input type='checkbox' name='_md_pref' value='{siteID}'{checked} />{siteName} ".template({siteID: siteID, checked: checked, siteName: siteName}));
			});
			table.push(row);
		});
		
		s += Table(table);
		s += "<br /><button id='_md_close'>Close</button>"
		s += "</div>"
		prefs.innerHTML = s;
		document.body.appendChild(prefs);
		
		addEvent("_md_close", "click", HidePreferences);
		addEvent("_md_display_type", "change", function(e){
			var select = $("_md_display_type");
			GM_setValue("linkStyle", select.options[select.selectedIndex].value);
		});
		xpath("//input[@name='_md_pref']", prefs, function(box){addEvent(box, "click", setPreference);} );
	}

	prefs.style.display="";
}

// These are the sites we can link to.
var movieSiteIDs = [
	"imdb", "netflix", "peerflix", "yahoo", "amazon", "bb", "bb_uk", "rotten","piratebay", "ebert", "wikipedia", 
	"allmovie", "greencine", "metacritic", "newzbin", "filmaff", "walmart"
];

var siteNames = {
	imdb: "IMDb",
	netflix: "NetFlix",
	yahoo: "Yahoo",
	amazon: "Amazon",
	bb: "Blockbuster",
	bb_uk: "Blockbuster (UK)",
	allmovie: "All Movie",
	rotten: "Rotten Tomatoes",
	ebert: "Ebert",
	piratebay: "The Pirate Bay",
	wikipedia: "Wikipedia",
	greencine: "GreenCine",
	metacritic: "Metacritic",
	newzbin: "Newzbin",
	filmaff: "FilmAffinity",
	walmart: "Wal*Mart",
	peerflix: "PeerFlix"
}

// The XPath query used to find the title note.
// The movie title is taken from this node's contents, and links are added underneath it.
var siteXPath = {
	bb: "//*[@class='headline1']",
	bb_uk: "//table//div[@class='roundedYellow']/h2/div",
	yahoo: "//td/h1/strong|//td/big/b",
	rotten: "//div[@id='main']//td//div",
	ebert: "//span[@class='moviename']",
	amazon: "//b[@class='sans']",
	greencine: "//*[@class='header1']",
	metacritic: "//td[@id='rightcolumn']/h1",
	peerflix: "//td[@class='PFHeaderNoIndent']",
	netflix: "//div[@class='title']"
}

// How to link to site "key"
// {search} is replaced with the movie title.
// {form} is replaced with a javascript form submit link.
var tUrlToSearchPage = {
	netflix: "http://www.netflix.com/Search?v1={search}&type=title&row=title&dtl=1",
	imdb: "http://imdb.com/find?q={search};tt=on;nm=on;mx=20",
	allmovie: "{form}",
	bb: "{form}",
	bb_uk: "http://www.blockbuster.co.uk/{search}/0/basic.aspx",
	amazon:  "{form}",
	yahoo: "http://movies.yahoo.com/mv/search?p={search}",
	rotten: "http://www.rottentomatoes.com/search/full_search.php?search={search}",
	piratebay: "http://thepiratebay.org/search.php?video=1&q={search}",
	ebert: "{form}",
	wikipedia: "http://en.wikipedia.org/wiki/Special:Search?search={search}&go=Go",
	greencine: "{form}",
	metacritic: "{form}",
	newzbin: "http://www.newzbin.com/search/query/p/?q={search}&Category=6&searchFP=n",
	filmaff: "http://www.filmaffinity.com/en/search.php?stype=title&stext={search}",
	walmart: "http://www.walmart.com/catalog/search-ng.gsp?search_constraint=4096&search_query={search}&ics=20&ico=0",
	peerflix: "http://www.peerflix.com/Default.aspx?tabid=87&sd={search}&st=k&pg=0"
}

var siteIcons = {
	imdb: "http://imdb.com/favicon.ico",
	netflix: "http://cdn.nflximg.com/us/icons/nficon.ico",
	amazon: "http://www.amazon.com/favicon.ico",
	yahoo: "http://www.yahoo.com/favicon.ico",
	rotten: "http://www.rottentomatoes.com/favicon.ico",
	piratebay: "http://piratebay.org/favicon.ico",
	wikipedia: "http://en.wikipedia.org/favicon.ico",
	greencine: "http://www.greencine.com/favicon.ico",
	metacritic: "http://www.metacritic.com/favicon.ico",
	newzbin: "http://www.newzbin.com/favicon.ico",
	walmart: "http://www.walmart.com/favicon.ico",
	peerflix: "http://www.peerflix.com/favicon.ico",
	allmovie: icons.allmovie,
	bb: icons.blockbuster,
	bb_uk: icons.blockbuster,
	ebert: icons.ebert
}

// The hidden Form to inject to link to site "key"
var tForm = {
	bb: ["http://blockbuster.com/search/PerformKeyWordSearchAction.action",
		{schannel: "Movies", keyword: "*", searchType:"Movies"}],
		
	amazon: ["http://amazon.com/exec/obidos/search-handle-form/002-3340566-5062428",
		 {url: "index=dvd", "field-keywords": "*"}],
		 
	ebert: ["http://rogerebert.suntimes.com/apps/pbcs.dll/classifieds?category=search3", {
			Class: "60",
			Type: "",
			FromDate: "19150101",
			ToDate: "20051231",
			Start: 1,
			SortOrder: "AltTitle",
			Genre: "",
			GenreMultiSearch: "",
			RatingMultiSearch: "",
			MPAASearch: "",
			SearchType: "1",
			qrender: "",
			Partial: "",
			q: "*"}],
			
	allmovie: ["http://www.allmovie.com/cg/avg.dll", {P: "avg", srch: "*", TYPE:"12"}],
	greencine: ["http://www.greencine.com/catalogQuickSearch", {SEARCH_STRING: "*"}],
		
	metacritic: ["http://www.metacritic.com/search/process", { 
			sort: "relevance",
			termtype: "all",
			ts: "*",
			ty: "1" }],
			
	newzbin: ["http://www.newzbin.com//search/query/p/", {q: "*", Category: "", searchFP: ""}],
}

function GetHTML(_linkTo, _movie){
	var templates = [
	'&bull;&nbsp;<a href="{href}" title="{name}">{name}</a>&nbsp;<a href="{href}" title="{name}"><img src="{icon}" width="16" height="16" border="0" /></a> ',
	'<a href="{href}" title="{name}"><img src="{icon}" width="16" height="16" border="0" /></a> ',
	'&bull;&nbsp;<a href="{href}" title="{name}">{name}</a> ',
	];
	
	var template = templates[parseInt(linkStyle)];

	var link = tUrlToSearchPage[_linkTo].template( {
			search: encodeURIComponent(_movie),
			form: "javascript:document.forms['_md_"+_linkTo+"_search'].submit()"
		} );
	
	var html = template.template( {
		href: link, 
		name: siteNames[_linkTo].replace(/\s/, "&nbsp;"),
		icon: siteIcons[_linkTo] || icons.noFavicon
	});
	
	return html;
}

function NameValue(n,v){ return ' {n}="{v}"'.template({n:n,v:v}); }
function FormValue(n,v){ return '<input type="hidden" name="{n}" value="{v}" />'.template({n:n,v:v}); }

function GetForm(movieSiteID, formDef, _movie){
	var s = '<form method="post" style="display:none;" action="{action}" id="_md_{id}_search">' . template ({
		action:formDef[0], 
		id: movieSiteID
	});
	
	foreach_dict(formDef[1], function(k,v){s += FormValue(k, v=="*" ? _movie : v);} );
	s += "</form>";	
	return s;
}

function removeBrackets(movieName){
	do {
		var bracketIndex = indexOfAny(movieName, "([");
		if (-1 < bracketIndex) movieName = movieName.substring(0,bracketIndex).trim();
	} while (bracketIndex != -1)
	
	return movieName;
}

function removeSuffix(movieName){
	foreach([" - Criterion Collection"], function(suffix){
		if (movieName.endsWith(suffix)){
			movieName = movieName.removeSuffix(suffix).trim();
			return true;
		}
	});
	
	return movieName;
}

function getSiteBeingViewed(){
	var whichSite = null;
	foreach_dict(
		{
			"imdb":"imdb.com",
			"netflix":"netflix.com",
			"bb":"blockbuster.com",
			"bb_uk":"blockbuster.co.uk",
			"yahoo":"movies.yahoo.com",
			"rotten":"rottentomatoes.com",
			"ebert":"rogerebert.suntimes.com",
			"amazon":"amazon.com",
			"allmovie":"allmovie.com",
			"greencine":"greencine.com",
			"metacritic":"metacritic.com",
			"filmaff": "filmaffinity.com",
			"walmart": "walmart.com",
			"peerflix": "peerflix.com"
		}, 
		function(name, host){
			if ( -1 < location.host.indexOf(host)){
				whichSite = name;
				return true;
			}
		});
		
	// Only link movie-related amazon pages
	if (whichSite == "amazon"){
		var pageTitle = document.title;
		if (indexOfAny(pageTitle, ["DVD:", "movie info:"]) == -1)
			whichSite = null;
	}
		
	return whichSite;
}

function LinkEmUp(){	
	var whichSite = getSiteBeingViewed();
	if (whichSite == null) return;
	
	var movieName = "";
	var titleNode = null;
	
	if (whichSite == "allmovie")
	{
		movieName = document.title.after(":");
		titleNode = document.createElement("div");
		document.body.insertBefore(titleNode, document.body.firstChild);
	}
	else if (whichSite == "filmaff")
	{
		movieName = document.title;
		titleNode = document.createElement("div");
		document.body.insertBefore(titleNode, document.body.firstChild);
	}
	else
	{
		titleNode = selectNode(siteXPath[whichSite] || "//*[@class='title']");
		if (titleNode) movieName = titleNode.firstChild.nodeValue;
	}
	
	movieName = removeBrackets(movieName);
	movieName = removeSuffix(movieName);
	movieName = movieName.trim();

	var s = "";
	s += "<a id='_md_config' class='_md_config' title='Configure Movie Dude'>The Movie Dude</a>: ";
	
	foreach(movieSiteIDs, function(movieSiteID){
		if ((movieSiteID == whichSite) || (!GM_getValue(movieSiteID, true)))
			return false;

		s += GetHTML(movieSiteID, movieName);

		var formDef = tForm[movieSiteID];
		if (formDef) s += GetForm(movieSiteID, formDef, movieName);
	} );

	titleNode.innerHTML += ( "<span id='_md_links'><br />" + s + "</span>");
	addCSS(
"#_md_links, #_md_prefs, #_md_links a {font-size:10pt;font-weight:normal;text-transform: none;}".important(),
"#_md_prefs_link {cursor: pointer;}",
"a._md_config { text-decoration: none; cursor: pointer; color: black;}",
"a._md_config:hover { background: #336699; color: white; cursor: pointer;}");
	
	addEvent("_md_prefs_link", "click", ShowPreferences);
	addEvent("_md_config", "click", ShowPreferences);
}

function UnsafeDebug(){
	unsafeWindow.selectNode = selectNode;
	unsafeWindow.xpath = xpath;
}

var linkStyle = GM_getValue("linkStyle", "0");
GM_registerMenuCommand("Movie Dude Settings...", ShowPreferences);
LinkEmUp();
