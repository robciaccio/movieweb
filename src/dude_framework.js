/*
	<%= @script_info['title'] %>

	<%= @script_info['version'] %>
	<% require 'date' %><%= DateTime.now().strftime('%e %b %Y, %I:%M%P') %>

	Developed 2005-<%= DateTime.now().year % 10 %> by Adam Vandenberg
	Released under the GPL license: http://www.gnu.org/copyleft/gpl.html
*/
<%= 
	include 'basics.js', 'html.js'
%>

function addCSS(){ 
	for(var i=0;i<arguments.length;i++) GM_addStyle(arguments[i]);
}

function addImportantCSS(){
	for(var i=0;i<arguments.length;i++) GM_addStyle(arguments[i].important);
}

function NameValue(n,v){ return ' {n}="{v}"'.template({n:n,v:v}); }
function FormValue(n,v){ return '<input type="hidden" name="{n}" value="{v}" />'.template({n:n,v:v}); }

/// Creates new Site objects.
function Site(definition, key){
	_extend(this, definition);
	this.id = key;
}

_extend(Site.prototype, {
	icon: icons.noFavicon,
	insertBreak: true,
	validPage: function(pageTitle){return true;},
	
	canLinkTo: function(){
		return (this.form != null || this.link != null);
	},
	
	GetForm: function(movieTitle){
		if (this.form == null)
			return '';
			
		var s = '<form method="post" style="display:none;" action="{action}" id="_md_{id}_search">'.
			template ({
				action: this.form[0], 
				id: this.id
			});

		foreach_dict(this.form[1], function(k,v){s += FormValue(k, v=="*" ? movieTitle : v);} );
		s += "</form>";	
		return s;
	},
	
	GetLink: function(movieTitle){
		var link = this.link.template( {
				search: encodeURIComponent(movieTitle),
				form: "javascript:document.forms['_md_"+this.id+"_search'].submit()"
			} );

		var html = this.LinkTemplate.template( {
			href: link, 
			name: this.name.replace(/\s/, "&nbsp;"),
			icon: this.icon
		});

		return html;
	},
	
	GetHTML: function(movieTitle){
		var html = '';
		if (this.form != null && this.link==null)
			this.link = "{form}";
		
		if (this.link!=null)
			html += this.GetLink(movieTitle);
			
		if (this.form != null)
			html += this.GetForm(movieTitle);
			
		return html;
	},
	
	processTitleNode: function(titleNode){return titleNode;},
	
	prepareToInsert: function(titleNode){},
	
	getWhereToInsert: function(titleNode){return titleNode;},
	
	getTitleFromTitleNode: function(titleNode){return $T(titleNode);},
});

function setPreference(event){GM_setValue(this.value, this.checked);}

function removeBrackets(movieName){
	do {
		var bracketIndex = movieName.indexOfAny("([");
		if (-1 < bracketIndex) movieName = movieName.substring(0,bracketIndex).trim();
	} while (bracketIndex != -1)
	
	return movieName;
}

function removeSuffix(movieName){
	foreach([" - Criterion Collection", " - Used", " - The Complete Collections"], function(suffix){
		if (movieName.endsWith(suffix)){
			movieName = movieName.removeSuffix(suffix).trim();
			return true;
		}
	});
	
	return movieName;
}

function GetSitePref(siteID){
	var siteName = Sites[siteID].name;
	var checked = (GM_getValue(siteID, true)) ? " checked='checked'" : "";
	
	return ( "&nbsp;<input type='checkbox' name='_md_pref' id='_md_pref_{siteID}' value='{siteID}'{checked} /> <label for='_md_pref_{siteID}'><img src='{icon}' width='16' height='16' border='0' /> {siteName}</label>".template({siteID: siteID, checked: checked, siteName: siteName, icon: Sites[siteID].icon}));
}

function GetNewPreferenceRow(rowNumber){
	var row = [];

	for(var col=0; col < 4; col++){
		var realIndex = col*6+rowNumber;
		
		if (realIndex < site_names.length){
			row.push(GetSitePref(site_names[realIndex]))
		} else {
			row.push("");
		}
	}
	
	return row;
}

function CreatePreferencesPanel(prefs_div){
	prefs_div.innerHTML="";

	var s = "<div class='_md_centered'><div id='_md_wrapper'><div id='_md_title'><b>The Movie Dude</b> <a href='http://adamv.com/dev/grease/moviedude'>Home Page</a> &bull; <a href='mailto:Movie.Dude.Script@gmail.com'>Contact</a> &bull; <a href='https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=paypal@adamv.com&amount=&return=&item_name=Buy+Me+a+Beer'>Buy Me a Beer</a></div></div></div>";
	
	s += "<hr id='header-shadow'><div id='_md_wrapper2'>";
	
	s += "<b>Display as:</b> ";
	s += Html.Select("_md_display_type", GM_getValue("linkStyle", "0"), 
		[["0", "Text &amp; Icons"],["1", "Icons only"],["2","Text only"]]);

	s += '<br />';

	var linkStyle = GM_getValue("linkStyle", "0");
	
	
	var table = [];
	for(var row=0; row < 6; row++){
		table.push(GetNewPreferenceRow(row));
	}
	
	table_html = Table(table);
	table_html = table_html.replace("<table>", "<table id='_md_link_table'><caption>Show links to these sites:</caption>");
	
	s += table_html;
	s += "<br /><div id='_md_version'>Version <%= @script_info['version'] %></div><button id='_md_close'>Close &amp; Refresh</button></div>"
	s += "<hr id='footer-break'></div>"
	prefs_div.innerHTML = s;
	document.body.appendChild(prefs_div);
	
	AddPreferencePanelEvents(prefs_div);
}

function AddPreferencePanelEvents(prefs_div){
	addEvent("_md_close", "click", function (e){
		hide("_md_prefs");
		
		var md_links = $('_md_links');
		md_links.parentNode.removeChild(md_links);
		LinkEmUp();
	});
	
	addEvent("_md_display_type", "change", function(e){
		var select = $("_md_display_type");
		GM_setValue("linkStyle", select.options[select.selectedIndex].value);
	});
	
	xpath("//input[@name='_md_pref']", prefs_div, function(box){
		addEvent(box, "click", setPreference);
	});
}

function ShowPreferences(){	
	var prefs = $("_md_prefs");
	if(!prefs){
		prefs = document.createElement("div")
		prefs.id = "_md_prefs";
		
		CreatePreferencesPanel(prefs);
	}

	prefs.style.display="";
}

function getSiteBeingViewed(){
	var whichSite = null;
	foreach_dict(Sites, function(key, site){
		if ( -1 < location.host.indexOf(site.scanURL)){
			whichSite = site;
			return true;
		}
	});
	
	return (whichSite && whichSite.validPage(document.title)) ? whichSite : null;
}

// -- Main code
function LinkEmUp(){	
	// Convert site definitions to site objects.
	foreach_dict(Sites, function(key, def){
		Sites[key] = new Site(def, key);
	});

	// Add any user supplied sites.
	foreach_dict(UserSites, function(key, def){
		Sites[key] = new Site(def, key);
	});

	var whichSite = getSiteBeingViewed();
	if (whichSite == null) return;

	var LinkTemplates = [
	'&bull;&nbsp;<a href="{href}" title="{name}">{name}</a>&nbsp;<a href="{href}" title="{name}"><img src="{icon}" width="16" height="16" border="0" /></a> ',
	'<a href="{href}" title="{name}"><img src="{icon}" width="16" height="16" border="0" /></a> ',
	'&bull;&nbsp;<a href="{href}" title="{name}">{name}</a> ',
	];

	Site.prototype.LinkTemplate = LinkTemplates[parseInt(GM_getValue("linkStyle", "0"))];
	
	var movieName = "";
	var titleNode = null;
	
	if (whichSite.xpath)
	{
		titleNode = selectNode(whichSite.xpath);
		if (titleNode != null) {
			titleNode = whichSite.processTitleNode(titleNode);
			
			movieName = whichSite.getTitleFromTitleNode(titleNode);
		}
		else return; // abort if the xpath gave us nothing
	}
	else
	{
		movieName = document.title;
		titleNode = document.createElement("div");
		document.body.insertBefore(titleNode, document.body.firstChild);
	}

	if (whichSite.getTitle)
		movieName = whichSite.getTitle(movieName);
	
	movieName = removeBrackets(movieName);
	movieName = removeSuffix(movieName);
	movieName = movieName.trim();

	var s = "<a id='_md_config' class='_md_config' title='Configure <%= @script_info['title_short'] %>'><%= @script_info['title'] %></a>: ";
	
	foreach_dict(Sites, function(key, site){
		if ((site == whichSite) || !GM_getValue(site.id, true))
			return false;
			
		s += site.GetHTML(movieName);
	});
	
	whichSite.prepareToInsert(titleNode);

	var insertBreak = (!whichSite.insertBreak) ? "" : "<br />";
	
	var whereToInsert = whichSite.getWhereToInsert(titleNode);
	
	whereToInsert.innerHTML += ( "<span id='_md_links'>" + insertBreak + s + "</span>");
	addEvent("_md_prefs_link", "click", ShowPreferences);
	addEvent("_md_config", "click", ShowPreferences);
}

function runHomepageCode(){
	if ( -1 == location.pathname.indexOf('/dev/grease/moviedude/'))
			return false;
			
	var your_version = $('your-version');
	if (your_version != null){
		your_version.innerHTML = "(You have version <%= @script_info['version'] %>.)"
	}
			
	return true;
}

addCSS("<%= includeCSS 'dude.css' %>");

GM_registerMenuCommand("<%= @script_info['title_short'] %> Settings...", ShowPreferences);

var site_names = [];

if(!runHomepageCode())
{
	LinkEmUp();
	foreach_dict(Sites, function(key,value){if (value.canLinkTo()) site_names.push(key);});
}
