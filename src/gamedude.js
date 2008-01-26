<%
	@script_info = {
		'title' => 'The Game Dude',
		'title_short' => 'Game Dude',
		'home' => 'http://adamv.com/dev/grease/gamedude',
		'contact' => 'Movie.Dude.Script@gmail.com',
		'version' => '1.6 (in development)',
		'description' => "Cross-links game sites so you don't have to.",
		'icon' => "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIsSURBVDjLnZPNi1JhFMbvKtoHBa1atgmCtv0VrVq0aCkGCn6mYH47ip8IflAKhibpRke00BnnKiKoiKA7qSkF08FvvToak%2Ff0ngu2qBYzXngu3Jf3%2Bb3nPee5VCAQcPj9%2FucAQB0iyufzPXS73Wd2u%2F3RQQB8Wa1Wiclkqms0mrsHAQwGwy21Wn2qUCjOxGLxHVyrVCpHpVKJpWmazeVy20wmQyeTyaf%2FBaAKhcIrkUh04XA4vhSLxTIxX5IHULMCDd%2BPkxCLxbaRSETxD6DVamUbjcavWq22LZfLMBqNgGEYuJgs4TxbhG9PHnManuQgGAyypOnv%2FwCazaat2%2B1yJ735pOCMy%2BUSBuMFvPzIwosPAMW3xzDwemA%2BHHL78vk82Gy2Iw5APtZoms%2FnHGCv2WwGP4Zz6AwWsFgsYLVacUI47jUajTvS9GcUaQ6LgL%2FNe3U6HSBVgtPpZFHT6ZSrst1ug1Kp%2FEolEokdUveGPWAymUA2m4V0Og1kD5AxX1osFo1er2fxGpvNBiQSCVDxeJzp9%2FtcWWjEcsfjMVSrVUilUth5IEYgo%2F6Md1apVDSu46FCoRCoaDR6gp1HIwLQ7PV6ezKZbMnj8YBoKZVKUzqd7h4C5HL5bZKVU4FAMOHz%2BU4qHA6%2FRiJOAgFIJvFmrp3EUCj0gMyVqdfr0Ov1YL1eg8vl2t0oyh6P5x2JKZAwAQkVNuznjQDkb7xPgnFuNpuvyHyvtFpt%2BbqA3zDZAQQexaeGAAAAAElFTkSuQmCC"
	}
	
	@user_script = <<END_USER_SCRIPT
%>
// ==UserScript==
// @name The Game Dude: Working Version
// @namespace	http://adamv.com/greases/
// @description 	<%= @script_info['description'] %>
// @include	http://adamv.com/dev/grease/moviedude*
// @include	http://imdb.com/title/*
// @include	http://*.imdb.com/title/*
// @include	http://amazon.com/*
// @include	http://*.amazon.com/*
// @include http://*.mobygames.com/game/*
// @include http://mobygames.com/game/*
// @include http://www.gamefaqs.com/*
// @include http://www.the-underdogs.info/*
// @include http://www.gamespot.com/*
// @include http://*.ign.com/objects/*
// @include http://www.ebgames.com/product.asp?*
// @include       http://www.gamefly.com/products/*
// @include       http://www.lemon64.com/*
// @include       http://product.half.ebay.com/*
// ==/UserScript==
<%
END_USER_SCRIPT
%>

var Version = "1.6";

var icons = {
	allmovie : "data:image/gif;base64,R0lGODlhEAAQAKIAAJPH5S%2BPyQx7v1yq2f3%2B%2F7%2Fg8%2B32%2FN3t%2BCH5BAAAAAAALAAAAAAQABAAAANJKLrcriA8FwiYrZCDVzAEIXXDEV4dAIDH%2BAyXSQwYQANhMQXFEOAEA80xKKhWp4dtMQi1Gr8GaMb49SSBksFQ0HkCLrDY1WkkAAA7",
	
	blockbuster: 'data:image/gif;base64,R0lGODlhEAAQAKIAACMiNunXmvXRY9u4aGVJIKOFSRAibXF0fCH5BAAAAAAALAAAAAAQABAAAANjaLp7zgoQd2S4gJ0y7ijEIASZclyCGAyhIBBLyxYjQQsFI7JhALqDkmEgKtB4gZGQs0sRWgGYIrTbcUaVDIDIcxmBNgPg+rS6VgFTkeMjXN6mVOpCGIMAQq6xDtHUhX2BggYJADs=',

	noFavicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGHSURBVHjaYvz%2F%2Fz8DIyOjDAMDgzgQMzPgB6%2BA%2BBFQzz%2BYAEAAMYAMAALjHz9%2BfPj9%2B%2FffP3%2F%2B%2FMeGgfL%2Fp0yZMhGoVgGImUD6QBgggGAGmIE0f%2Fny5f%2FXr1%2Fh%2BOPHj%2F%2Ffv3%2F%2F%2F%2BXLl2BDnj9%2F%2Fn%2Fq1KkohgAE4GiOUQCAQhCA8u9%2Fgq7YFASGkx8dwkVfHj8DLtydSCZ9u6uZUXcHACA%2FqaogBr4AYoQaYApUcPLv379wr%2F379w%2FsOqA4A9BQBkFBQZTAYGFhMQdSpwECiAVZkImJCRSgcDbIQGZmZgY2NjYGoEvAhoIMFBMTg%2BsBCCAUA2CaYWyQZmQ%2BzEBkABBALPjiDNkQEBuEYQEHAwABxEIg3sGakL2GDgACiImBCADTDHINyDBkABBAOF2A7FRoagUHIjoACCCCXkA2CN12EAAIIBZ8zobZjA8ABBCyAf%2BhiQprtKKBf1DX%2FQcIIFB6Bmn8B4zj7zAJAgCk9huQBidbgABihDpTFpqdiYoVqOZXQL2PAQIMAIeX65Ph3kulAAAAAElFTkSuQmCC'
};

var Defaults = {
	xpath: "//*[@class='title']",
};

var SiteGroups = [
	["Information", ["mobygames", "gamefaqs", "imdb", "wikipedia", "gamespot", "ign"]],
	["Downloads", ["hotu"]],
	["Rentals", ["bb"]],
	["Critics", ["metacritic"]],
	["Sales", ["amazon", "ebgames", "goodwill", "ebay", "walmart"]]
];


// -- Site definitions
var Sites = {
	mobygames: {
		name: "Moby Games",
		icon: "http://www.mobygames.com/favicon.ico",
		scanURL: "mobygames.com",
		link: "http://www.mobygames.com/search/quick?q={search}",
		xpath: "//div[@id='gameTitle']"
	},
	
	gamefaqs: {
		name: "GameFaqs",
		icon: "http://www.gamefaqs.com/favicon.ico",
		scanURL: "gamefaqs.com",
		link: "http://www.gamefaqs.com/search/index.html?game={search}&platform=All+Platforms",
		xpath: "//div[@id='content']/h1"
	},
	
	gamespot: {
		name: "GameSpot",
		icon: "http://www.gamespot.com/favicon.ico",
		scanURL: "gamespot.com",
		link: "http://www.gamespot.com/search.html?type=11&stype=all&tagg=search;button&qs={search}",
		xpath: "//div[@id='content_wrap']//h1",
		
		processTitleNode: function(titleNode){
			var node = document.createElement("div");
			node.innerHTML = "<h3>"+$T(titleNode)+"</h3>";
			var parent = titleNode.parentNode.parentNode;
			parent.removeChild(titleNode.parentNode);
			parent.insertBefore(node, parent.firstChild);
			
			return node;
		},
	},
	
	gamefly: {
		name: "Game Fly",
		link: "http://www.gamefly.com/products/search.asp?k={search}&sb=alpha",
		icon: "http://www.gamefly.com/favicon.ico",
		scanURL: "gamefly.com",
		xpath: "//span[@class='producttitle']",
	},
	
	ign: {
		name: "IGN",
		icon: "http://media.ign.com/ign/favicon.ico",
		link: "http://search.ign.com/products?qtype=0&query={search}&objtName=game&sort=date&so=exact&ns=true&genNav=true",
		scanURL: "ign.com",
		xpath: "//div[@id='objectName']",
		
		processTitleNode: function(titleNode){
			var node = document.createElement("span");
			node.innerHTML = selectNode("text()",titleNode).nodeValue;
			titleNode.replaceChild(node, titleNode.firstChild);
			return node;
		}
	},
	
	hotu: {
		name: "Home of the Underdogs",
		icon: "http://www.the-underdogs.info/favicon.ico",
		scanURL: "underdogs.info",
		link: "http://www.the-underdogs.info/search.php?search_game={search}",
		xpath: "//div[@class='gameheader']"
	},
	
	goodwill: {
		name: "Shop Goodwill",
		icon: "http://shopgoodwill.com/favicon.ico",
		link: "http://shopgoodwill.com/search/searchKey.asp?itemTitle={search}&srchdesc=on&catID=7&sellerID=all&closed=no&minPrice=&maxPrice=&sortBy=itemEndTime&sortOrder=a&submit1=Search",
	},
	
	froogle: {
		name: "Froogle",
		icon: "http://froogle.google.com/favicon.ico",
		link: "http://froogle.google.com/froogle?q={search}",
	},
	
	ebay: {
		name: "eBay",
		icon: "http://cgi.ebay.com/favicon.ico",
		link: "http://video-games.search-desc.ebay.com/{search}_Video-Games_W0QQcatrefZC5QQfbdZ1QQfclZ3QQflocZ1QQfposZ27514QQfromZR14QQfrppZ50QQfsclZ1QQfsooZ1QQfsopZ1QQfssZ0QQftrtZ1QQftrvZ1QQftsZ2QQnojsprZyQQpfidZ0QQsaaffZafdefaultQQsacatZ1249QQsacqyopZgeQQsacurZ0QQsadisZ200QQsargnZQ2d1QQsaslcZ0QQsaslopZ1QQsofocusZbsQQsorefinesearchZ1",
		
	},
	
	half: {
		name: "Half.com",
		link: "http://search.half.ebay.com/{search}_W0QQmZvideoQ2dgames",
		icon: "http://cgi.ebay.com/favicon.ico",
		xpath: "//b[@class='pagetitle']",
		scanURL: "half.ebay.com",
	},

	amazon: {
		name: "Amazon",
		xpath: "//b[@class='sans']",
		icon: "http://www.amazon.com/favicon.ico",
		form: ["http://amazon.com/exec/obidos/search-handle-form/102-1662869-1268955",
			 {"url": "index=videogames", "field-keywords": "*"}],
		scanURL:"amazon.com",			
		validPage: function(pageTitle){return (pageTitle.indexOfAny(["ames"]) > -1);}
	},

	bb: {
		name: "Blockbuster",
		xpath: "//*[@class='headline1']",
		icon: icons.blockbuster,
		form: ["http://blockbuster.com/search/PerformKeyWordSearchAction.action",
			{schannel: "Games", keyword: "*", searchType:"Games"}],
		scanURL:"blockbuster.com",
	},

	imdb: {
		name: "IMDb",
		link: "http://imdb.com/find?q={search};tt=on;nm=on;mx=20",
		icon: "http://imdb.com/favicon.ico",
		xpath: Defaults.xpath,
		scanURL:"imdb.com",
		validPage: function(pageTitle){return (pageTitle.indexOfAny(["(VG)"]) > -1);}
	},

	metacritic: {
		name: "Metacritic",
		xpath: "//td[@id='rightcolumn']/h1",
		icon: "http://www.metacritic.com/favicon.ico",
		form: ["http://www.metacritic.com/search/process", { 
				sort: "relevance", termtype: "all", ts: "*", ty: "3" }],
		scanURL:"metacritic.com",
	},

	ebgames: {
		name: "EBgames",
		icon: "http://www.ebgames.com/gs/sites/eb/common/images/favicon.ico",
		link: "http://www.ebgames.com/search.asp?sortby=default&searchtype=quicksearch&searchcount=12&Keyword={search}",
		scanURL: "ebgames.com",
		xpath: "//td[@class='prodtitle']"
	},
	
	walmart: {
		name: "Wal*Mart",
		link: "http://www.walmart.com/catalog/search-ng.gsp?search_constraint=2636&search_query={search}",
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
	
	allgame: {
		name: "All Game",
		icon: icons.allmovie,
		form: ["http://www.allgame.com/cg/agg.dll", {P: "agg", SRCH: "*", TYPE:"1"}],
		scanURL:"allgame.com",
		
		getTitle: function(title){return title;}
	},
	
	lemon64: {
		name: "Lemon 64",
		icon: "http://www.lemon64.com/favicon.ico",
		scanURL: "lemon64.com",
		link: "http://www.lemon64.com/games/list.php?type=title&name={search}",
		xpath: "//td[@class='normalheadblank']//b[@class='mediumhead']",
	}
};

var UserSites = {};

<%= include 'dude_framework.js' %>
