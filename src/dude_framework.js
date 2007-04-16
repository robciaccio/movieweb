/*
	<%= @script_info['title'] %>

	<%= @script_info['version'] %>
	<% require 'date' %><%= DateTime.now().strftime('%e %b %Y, %I:%M%P') %>

	Developed 2005-<%= DateTime.now().year % 10 %>, Adam Vandenberg
	Released under the GPL license
	http://www.gnu.org/copyleft/gpl.html
*/
<%= include 'basics.js', 'html.js' %>

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
	validPage: function(pageTitle){return true;},
	
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
	
	prepareToInsert: function(titleNode){}
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


function ShowPreferences(){	
	var prefs = $("_md_prefs");
	if(!prefs){
		prefs = document.createElement("div")
		prefs.id = "_md_prefs";
		
		var s = "<div>";
		s += "<b><%= @script_info['title'] %></b><br />"
		s += "Version <font color='#336699'><%= @script_info['version'] %></font> &bull; ";
		s += "<a href='<%= @script_info['home'] %>'>Home Page</a> &bull; <a href='mailto:<%= @script_info['contact'] %>'>Contact</a><br />";
		s += "<br />";
		
		s += "<b>Display as:</b> ";
		s += Html.Select("_md_display_type", GM_getValue("linkStyle", "0"), 
			[["0", "Text &amp; Icons"],["1", "Icons only"],["2","Text only"]]);

		s += '<br />';
		s += "<b>Show links to:</b><br />";
		var linkStyle = GM_getValue("linkStyle", "0");
		
		var table = [];
		foreach(SiteGroups, function(group){
			var row = [];
			if (group[0] != "")
				row.push("<font color='#336699'>"+group[0] + ":</font>");
			else
				row.push("")
				
			foreach(group[1], function(siteID){
				var siteName = Sites[siteID].name;
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
		
		addEvent("_md_close", "click", function (e){ hide("_md_prefs");});
		addEvent("_md_display_type", "change", function(e){
			var select = $("_md_display_type");
			GM_setValue("linkStyle", select.options[select.selectedIndex].value);
		});
		xpath("//input[@name='_md_pref']", prefs, function(box){addEvent(box, "click", setPreference);} );
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
			
			if (whichSite.getTitleFromTitleNode)
				movieName = whichSite.getTitleFromTitleNode(titleNode);
			else
				movieName = $T(titleNode);
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

	titleNode.innerHTML += ( "<span id='_md_links'><br />" + s + "</span>");
	addEvent("_md_prefs_link", "click", ShowPreferences);
	addEvent("_md_config", "click", ShowPreferences);
}

addCSS(
	"#_md_links, #_md_prefs, #_md_links a {font-size:10pt;font-weight:normal;text-transform: none;}",
	"#_md_prefs_link {cursor: pointer;}",
	"a._md_config { font-size:10pt;font-weight:normal;text-transform: none; text-decoration: none; cursor: pointer; color: black;}",
	"a._md_config:hover { background: #336699; color: white; cursor: pointer;}",
	"#_md_prefs {position:fixed; bottom:auto; left:0; right:0; top:0; color:black; font: normal 11px sans-serif; background:#eee; border-bottom:2px #69c solid;}",
	"#_md_prefs, #_md_prefs td {font-family: verdana, sans-serif; font-size: 10pt;}",
	"#_md_prefs div {padding:5px 0 0.4em 0; margin: 0px auto;width: 700px;}",
	"#_md_prefs button {font: normal 11px sans-serif; border: 1px solid #0080cc; color: #333; cursor: pointer; background: #FFF;}"
	);

GM_registerMenuCommand("<%= @script_info['title_short'] %> Settings...", ShowPreferences);
LinkEmUp();
