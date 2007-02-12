// #region Class support
// Adds items from props to obj.
function _extend(obj, props){
	for(var key in props){obj[key]=props[key];}
}
// #endregion

// #region String support
_extend(String.prototype,{	
	important: function(){ return this.replace(";", " !important;");},
	trim: function() { return this.replace(/^\s+|\s+$/g, ""); },
	template: function(vars){
		return this.replace( 
			/\{(\w*)\}/g,
			function(match,submatch,index){return vars[submatch];});
	 },
	endsWith: function(suffix){
		var lastIndex = this.lastIndexOf(suffix);
		return (-1 < lastIndex) && (lastIndex == (this.length-suffix.length));
	},
	removeSuffix: function(suffix){
		return (this.endsWith(suffix))? this.substring(0, this.length-suffix.length) : this;
	},
	after: function(s){
		var index = this.indexOf(s);
		var length = s.length || 1;
		return (-1<index) ? this.substring(index+length) : this;
	},
	indexOfAny: function(charsOrStringList){
		var index=-1;
		var s = this;
		foreach(charsOrStringList, function(token){
			index = s.indexOf(token);
			if (-1 < index) return true;
		});
		return index;
	},
	escapeHTML: function(){
		return this
			.replace(/&/g, "&amp;")
			.replace(/\"/g, "&quot;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	}
});
// #endregion

// #region Collection support
function foreach(stuff, f){ for(var i=0; i < stuff.length; i++) if (f(stuff[i])) return; }
function foreach_dict(stuff, f){ for(var name in stuff) if ( f(name, stuff[name]) ) return; }
function collect(f, stuff) {
	var list = [];
	foreach(stuff, function(item){list.push(f(item))});
	return list;
}
//#endregion

// #region DOM & Events support
function $(o) {
	if (typeof(o) == "string") return document.getElementById(o)
	else return o;
}

function hide(id){
	var e = $(id);
	if (e) e.style.display = "none";
}

function addEvent(elementID, eventName, handler, capture){
	var e = $(elementID);
	if (e) e.addEventListener(eventName, handler, capture);
}

// Extract the text from the given DOM node.
function $T(node) {
	var aNode = $(node);
	if (aNode == null) return "";
	
	function extract(n){
		var s = "";
		if (n.nodeType == 3){
			s+= n.nodeValue;
		}
		
		foreach(n.childNodes, function(child){
			s += extract(child);
		});
		return s;
	}
	
	return extract(aNode).trim();
}
// #endregion

//#region Xpath Support
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
//#endregion

function stringify(){
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
