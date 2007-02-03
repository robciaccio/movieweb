/*
	Snippy
	Version 0.93
	9 June 2006
	Copyright (C) 2006 Adam Vandenberg

	Uses the Silk icon set:
	http://www.famfamfam.com/lab/icons/silk/
*/
// ==UserScript==
// @name Snippy
// @namespace	http://adamv.com/greases/
// @description	Creates an HTML formatted link to the current page with the selected text.
// @include	*
// ==/UserScript==

var Table = {
	create: function(rows){
		var s = "<table>";
		foreach(rows, function(row){
			s += "<tr>";
			foreach(row, function(cell){ s += "<td>" + cell.toString() + "</td>"; });
			s += "</tr>";
		});
		s += "</table>";
		return s;
	}
};

// -- Forms helper
var Form = {
	text: function(name, value, attrs){
		var v="";
		if (value != null) v = " value='" + value.toString().escapeHTML() + "'";
		return '<input type="text" name="' + name.escapeHTML() + '"' + v.escapeHTML() + '" size="80" '+ attrs +' />';
	},
	
	button: function(id, caption){ return '<button id="' + id.escapeHTML() + '">' + caption.escapeHTML() + '</button>'; },
	
	radio: function(set, value, checked){
		var strCheck = (checked)?"checked='checked' ":"";
		return '<input type="radio" name="' + set.escapeHTML() + '" value="'+value.escapeHTML()+'" ' + strCheck + '/>';
	}
};
// Library configuration.
var panelPrefix = "__snippy";

// -- Panel library.
var Panel = {
	install: function (panelDef){
		if (panelDef.panel != null)
			return;
			
		AddStyles();
		
		// Create the HTML node for the panel.
		var node = document.createElement('div');
		node.id = panelPrefix + panelDef.id;
		node.className = panelPrefix;
		node.innerHTML = ("<div>" + makeCloseButton() + stringify(panelDef.contents) + "</div>");
		document.body.appendChild(node);

		panelDef.panel = node;
		panelDef.show = Panel.panel_show;
		panelDef.close = Panel.panel_close;
	
		// Install close behavior on close button.
		xpath('//img[@behavior="close"]', node, function(button){
			Panel.install_event([button, panelDef.close], panelDef);
		});
		
		// Install other events.
		if (panelDef.events != null){
			foreach(panelDef.events, function(event_def){Panel.install_event(event_def, panelDef);});
		}	
		
		if (panelDef.OnCreate != null)
			panelDef.OnCreate();
	},
	
	panel_show: function(){this.panel.style.display="";},
	panel_close: function(){Panel.tryToClose(this);},
	
	install_event: function(event_def, panelDef){
		var eventType = "click";
		if (event_def.length == 3)
			eventType = event_def.pop();
		
		var nodes = $(event_def[0]);
		if (nodes == null)
			nodes = $N(event_def[0]);

		foreach(nodes, function(node){
			node.addEventListener(eventType, event_def[1].handler(panelDef), true);
		});
	},
	
	tryToClose: function(panelDef){
		if (panelDef.OnClose != null){
			var cancelled = panelDef.OnClose();
			if (cancelled)
				return;
		}
		
		panelDef.panel.style.display='none';
	}
};

function ShowPanel(panelDef){
	if (panelDef.panel == null)
		Panel.install(panelDef);
		
	if (panelDef.OnShow != null)
		panelDef.OnShow();
	
	panelDef.show();
}

// -- Panel definitions.
var Panels = {
	Main: {
		id: "main",
		contents: function(){
			var s = [
				"<b>Snippy:</b> &nbsp; &nbsp;",
				makeLink(p.get("newEntryURL"), "New entry", "_md_link"),
				" &nbsp; &nbsp;",
				makeLink(p.get("blogURL"), "Go to your blog", "_md_blog"),
				"<br />",
				Form.button("_snippy_swap", "Swap"),
				"<br />",
				"Quote with: ",
				Form.radio("quote_tag", "i", true),
				"&lt;i&gt; &nbsp;",
				Form.radio("quote_tag", "blockquote"),
				"&lt;blockquote&gt; &nbsp;",
				"<br /><br />",
				"<textarea id='_md_snip' rows='5'></textarea>",
				'<input type="checkbox" id="_snippy_HTML" value="1" /> Use HTML &nbsp; ',
				'<input type="checkbox" id="_snippy_nolinks" value="1" checked="checked" disabled="disabled" /> Strip links',
			];
		
			return s;
		},
		events: [
			["_snippy_swap", function(){swapParts();setTheSnip();}],
			["quote_tag", function(sender){setQuoteTag(sender.value);setTheSnip();}],
			["_md_link", function(){this.close();}],
			["_md_blog", function(){this.close();}],
		],
		OnShow: function(){
			setupParts();
			setTheSnip();
		}
	},
	
	Prefs: {
		id: "prefs",
		contents: function(){
			var s = "";
			s += "<b>Snippy Preferences:</b><br />";

			var rows = p.createtable();

			rows[0].push(Form.button("__snippy_usecurrent1", "Use this page"));
			rows[1].push(Form.button("__snippy_usecurrent2", "Use this page"));

			rows.push(["", Form.button("__snippy_saveprefs", "Save Preferences")]);
			rows.push(["", Form.button("__snippy_resetprefs", "Reset")]);

			s += Table.create(rows);
			
			return s;
		},
		events: [
			["__snippy_usecurrent1", function(){this.grabUrl('newEntryURL');}],
			["__snippy_usecurrent2", function(){this.grabUrl('blogURL');}],
			["__snippy_resetprefs", function(){p.reset();this.close();}],
			["__snippy_saveprefs", function(){p.write(this.panel);this.close();}]
		],
		OnShow: function(){p.filltable(this.panel);},
		
		grabUrl: function(settingName){SetSetting(settingName, window.location.href, this.panel);}
	}
};

var icons = {
	Close:
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALnSURBVHjaYvz%2F%2Fz8DJQAggFjQBZ62NsQx%2FPub%2Bf%2FvP32Gv3%2B%2F%2F%2F%2F7h%2BH%2F37%2BcQHyR4c%2Bf6fITpi1CVg8QQIzILgBqjmfl41ogYKTJwMrPw%2FD%2F9x8Ghr%2F%2FGBiBcr%2Fevmd4e%2BQMw89Xb5IUZy6YD9MDEEBwA5621Cey8HLNEzTWYmD79pSB4dUjBoZ%2F%2FxgYQIb8%2FMnAwC%2FJ8JNXhuH1wRMMP1%2B%2FTVZetHIeSB9AAIENeNpcl8jCB9RsBNT8Faj52T0GoHOB1v4GGvAbYsivXwwM4goMPwXkGF4eOA5ySaLq6k0LAAKICWQK0J%2BZgoaaDGwfHzMwPLrNwCAow8Cg4wjU%2BJeB4TvQdk0rBgYhaQaGW1cY2J%2FcYBCzNAJ671cmSC9AAEEC8c9fPVZubgaGa0CbfwJt4uBnYLDyY2DgEmRg%2BPYZyPZiYFg1BSh%2FiYHh9lUGdmU9oAG%2F9UFaAQIIbMD%2FP7%2B%2F%2Ff%2F5k50RZOMPoI3nDjIwsHAyMLiGQ0Lq4EYGhsM7IHKMTAz%2FfvwCGfANJAUQQGAD%2FoH8C3Pu918QTazsiLhiBRr25x%2FcAKCLQZaCpQACCOKC37%2B5GRmAsfHtG8QQY3sGBocABoZdaxgYPn9gYAhOAQYsMFZWzGQAKWNiBOn5ww3SCxBAkDD4%2Ffvy77fvjdmEgQF15xoDw70bDAyLJjAw7NsEtA1o06vnwHh%2BDIlOJS2GH6%2FegFxwGaQVIICgXvg9%2FdWR03NETfUZ2L99Z2C4CZS7dhESjSDv7VgPNuiPshbDTyUdhme79wEN%2BDsdpBcggOAJ6W5MaAorL89sMTMjBo77V4AuAbri%2Fz9wavz98wfDPzllhl%2FA0H%2B5Zz8wDbxO1TlzZQ5IH0AAoSTlW8E%2Biez8vPPEzIwZ2AT4Gf4CE8%2B%2Ff3%2FBAff9zVuGN%2FsPMvx8%2FjJJ5%2BxVeFIGCCBG9Nx408sp7v%2BfP8DM9FcfSH9nQGSmS0A8XffstYXI6gECiJHS7AwQYACMV1YWXm%2BMdQAAAABJRU5ErkJggg%3D%3D",
}

/// Set up a function as an event handler, bound to the given "self" object.
/// The handler will be called as self.handler(eventSource, eventObject);
Function.prototype.handler = function(self) {
  var innerFunction = this;
  return function(event) {
	var eventSender = this;
    return innerFunction.call(self, eventSender, event || window.event);
  }
}

function $(o) {
	if (typeof(o) == "string") return document.getElementById(o)
	else return o;
}

function $N(name){
	return document.getElementsByName(name);
}

function encodeRE(s) {
  return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
}

function reOptions(args){
	var s = collect(args, encodeRE).join("|");
	return new RegExp(s);
}

function selectNode(selector, rootElement)
{ 
	return xpath(selector, rootElement, null, true);
}

function xpath(selector, rootElement, f_each, firstOnly){
	var results = document.evaluate(
		selector, rootElement || document, null,
		XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

	var nodes = null;

	if (firstOnly){ 
		nodes =  results.iterateNext(); 
	} else {
		nodes = new Array();var result = null;
		while(result = results.iterateNext()) nodes.push(result);	
	}
		
	// If we have a callback function, run it on the results
	if (f_each != null && nodes != null)
		foreach(nodes, f_each);
	else
		return nodes;
}

function Setting(name, default_value, caption)
{
	return {
		name: name,
		value: default_value,
		default_: default_value,
		caption: (caption == null)?name:caption
	};
}

function Preferences(settings){
	var _Settings = {};
	foreach(settings, function(setting){
		var s = Setting.apply(null, setting);
		_Settings[s.name] = s;
	});
	
	this.Settings = _Settings;

	this.get = Preferences_get;
	this.read = Preferences_read;
	this.write = Preferences_write;
	this.reset = Preferences_reset;
	this.tablerows = Preferences_tablerows;
	this.createtable = Preferences_createtable;
	this.filltable = Preferences_filltable;

	this.__dict = this.Settings;
}

function Preferences_reset(){
	foreach_dict(this, function(k,v){
		v.value = v.default_;
	});
	this.write();
}

function Preferences_get(name, default_){
	if (default_ == null) default_ = null;
	var v = this.Settings[name];
	return (v != null) ? v.value : default_;
}

function Preferences_read(){
	foreach_dict(this, function(k,v){
		v.value = GM_getValue(k, v.value);
	});
	
	return this;
}

function Preferences_write(node){
	var _this=this;
	if (node != null){
		xpath('//input[@setting]', node, function(input){
			var name = input.getAttribute("setting");
			_this.Settings[name].value = input.value;
		});
		
		this.write();
	}
	else
		foreach_dict(this, function(k,v){GM_setValue(k, v.value);});
}

function Preferences_tablerows(){
	var rows = new Array();
	foreach_dict(this.Settings, function(k, setting){
		rows.push([setting.caption+":", Form.text("", setting.value, ' setting="'+setting.name+'"')]);
	});
	
	return rows;
}

function Preferences_createtable(){
	var rows = new Array();
	foreach_dict(this.Settings, function(k, setting){
		rows.push([setting.caption+":", Form.text("", '', ' setting="'+setting.name+'"')]);
	});
	
	return rows;
}

function Preferences_filltable(node){
	var _this=this;
	xpath('//input[@setting]', node, function(input){
		var name = input.getAttribute("setting");
		input.value = _this.Settings[name].value;
	});
}

String.prototype.escapeHTML = function (){
	return this
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

String.prototype.trim = function() {
	var s = this.replace(/^\s*(.*)/m, "$1");
	s = s.replace(/(.*?)\s*$/m, "$1");
	return s; 
}

String.prototype.template = function(vars){
	return this.replace( /\{(\w*)\}/g,
		function(match,submatch,index){return vars[submatch];}
	);
}

function foreach(stuff, f){
	if (stuff == null) return;
	
	if ((typeof(stuff)=="string") || (stuff.length == null)) {
		f(stuff);
		return;
	}
	
	for(var i=0; i < stuff.length; i++)
		if (f(stuff[i])) return;
}

function foreach_dict(obj, f, ignore__dict){
	var whichDict = (!ignore__dict && (obj.__dict!=null))?obj.__dict:obj;
	for(var name in whichDict) if (f(name, whichDict[name])) return;
}

function collect(stuff, f) {
	var list = [];
	foreach(stuff, function(item){list.push(f(item))});
	return list;
}

function addCSS(){ 
	for(var i=0;i<arguments.length;i++)
		GM_addStyle(arguments[i]);
}

var addedStyles = false;
function AddStyles(){
	if (!addedStyles){
		addCSS(
".__snippy {position:fixed; left:0; right:0; bottom:0; top:auto; width:100%;  color:black; font: normal 11px sans-serif; z-index: 9999 !important;}",
".__snippy div {padding:5px 10px 0.4em 10px; border-top:1px #aaf solid; background:#eee;}",
".__snippy button {font: normal 11px sans-serif; border: 1px solid #0080cc; color: #333; cursor: pointer; background: #FFF;}",
".__snippy button[disabled] {background: #CCC;}",
".__snippy textarea {width:100%; padding-top: 5px; }",
".__snippy img {cursor:pointer;}",
".__snippy input { font: normal 11px sans-serif; }"
		);
	}
	addedStyles = true;
}

function makeLink(url, contents, id){
	return "<a id='" + id + "' href='" + url + "' target='_blank'>" + contents + "</a>";
}

function makeCloseButton(){
	return '<img src="' + icons.Close + '" style="float: right; width: 16px; height: 16px;" behavior="close" title="Close Panel" />';
}

function stringify(){
	var q = []; var output = [];
	foreach(arguments, function(item){q.unshift(item);});
	
	var item = null;
	while (q.length > 0){
		item = q.pop();

		if (item == null)
			continue;

		if (typeof(item) == "function")
			q.unshift(item());
		else if ((typeof(item) != "string") && (item.length))
			foreach(item, function(item){q.unshift(item);});
		else 
			output.push(item.toString());
	}	
	return output.join("");
}

function SetSetting(name,value,node){
	var input = selectNode("//input[@setting='" + name + "']", node);
	input.value = value;
}

function setTheSnip(){
	var textArea = $("_md_snip");
	textArea.value = vars.output();
	textArea.select();
	textArea.focus();
}

function swapParts(){
	var temp = vars.pageName;
	vars.pageName = vars.siteName;
	vars.siteName = temp;
}

function setQuoteTag(newTag){
	vars.quote_tag = newTag;
}

function setupParts(){
	// The list of possible title separators.
	var reSep = reOptions(['»', ':', ' - ', '|']);
	vars = {
		siteName: "",
		pageName: "",
		selection: window.getSelection().toString().trim(),
		here: window.location.href,
		items: (document.title).split(reSep),
		quote_tag: "i",
		
		output: function(){return vars.template.template(vars);}
	};
	
	if (vars.items.length == 1){
		vars.pageName = vars.items[0].trim();
		vars.template = '<b>{pageName}:</b> <a href="{here}">{selection}</a>';
	}
	else if (vars.items.length >= 2){
		vars.siteName = vars.items.shift().trim();
		vars.pageName = vars.items.join(" ").trim();
		vars.template = '<b>{siteName}:</b> <a href="{here}">{pageName}</a>.';

		if (vars.selection != "")
			vars.template += " <{quote_tag}>{selection}</{quote_tag}>";
	}
}

var p = new Preferences([
	["newEntryURL", "", "New Entry"],
	["blogURL",  "", "Your Site"]
]).read();

var vars = {}

function Snippy(){ShowPanel(Panels.Main);}
function SnippyPreferences(){ShowPanel(Panels.Prefs);}

GM_registerMenuCommand("Snippy", Snippy);
GM_registerMenuCommand("Snippy Preferences", SnippyPreferences);
