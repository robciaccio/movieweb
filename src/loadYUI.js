// GM additions
try {test=GM_includeOnce;}
catch (err) {
    GM_log('adding GM_includeOnce function');
    function GM_includeOnce(assets, callbackOnComplete, callbackOnTimeout, timeout, context) {
        /*
            GM_includeOnce(assets[, callbackOnComplete[, callbackOnTimeout[, timeout[, context]]]])
            assets = [{url:'', existenceTest:func[, type: typeEnum]}] type is calculated from extension if not included
            no callback is made without callbackOnComplete
            default timeout is 10000 (10 seconds)
            context is the object that the scripts are run on, defaults to this
            callbackOnComplete is sent a closure style function as its only parameter which allows access to the variables 
            created in the scripts
        */
        
        //private functions
        var numAssets=assets.length, numJSAssets=0, numJSLoaded=0;
        var timeoutTimer=setTimeout(callbackOnTimeout, timeout||10000);
        var allScript='', allCSS='', importScript='';
        var asset, type, styleLink;
        
        function accessFunc(localVar) {try{return eval(localVar);} catch (err) {}}
        
	    function allScriptsLoaded() {
	        GM_log('allScriptsLoaded');
            clearTimeout(timeoutTimer);
	        //it may be better to add these scripts immediately rather than compiling the big string in some circumstances
	        GM_log('compiling scripts');
	        for (var a=0;a<numAssets;a++) if (assets[a].JSLoaded) allScript+=assets[a].content + '\n';
	        GM_log('setting script(' + allScript.substr(0,20) + '...[' + allScript.length + ']');
	        //execute the script including a closure func at the end for access to the scripts variables
	        GM_log('proceeding to loader completed callback');
	        var func=new Function(allScript + '\nreturn ' + accessFunc.toString() + '\n');
            callbackOnComplete(func.call(context||this));
	    }
	    function aScriptLoaded(asset, responseDetails) {
	        GM_log('GM_includeOnce(' + asset.url + ') loaded, total:' + ++numJSLoaded);
            asset.content=responseDetails.responseText;
            asset.JSLoaded=true;
            if (numJSLoaded==numJSAssets) allScriptsLoaded();
        }

        GM_log('GM_includeOnce started: processing asset requests');
        for (var a = 0; a < numAssets; a++) {
	        asset = assets[a];
	        if (asset.obj&&window[asset.obj]) GM_log('asset window[' + asset.obj + '] already exists');
            else {
    	        type=asset.type||asset.url.substr(asset.url.length-3, 3).replace(/\./g, '');
                switch (type) {
                    case 'js': {
                        numJSAssets++;
                        asset.type='js';
                        GM_xmlhttpRequest({
                            method:"GET",
                            url:asset.url,
                            onload:paramCall(aScriptLoaded, this, [asset]) //will have responseDetails append to parameter list by the event call
                        });
                        break;
                    }
                    case 'css': {
                        asset.type='css';
	                    styleLink =gEBTN('head')[0].appendChild(cE('link'));
    			        styleLink.href = asset.url;
			            styleLink.type = 'text/css';
			            styleLink.rel = 'stylesheet';
                        break;
                    }
                    default: GM_log('unknown asset type [' + type + ']');
                }
	            GM_log('GM_includeOnce(' + asset.url + ') requested');
	        }
        }
    }
}

try {test=GM_addScript;}
catch (err) {
    GM_log('adding GM_addScript function');
    function GM_addScript(scripts) {
	    GM_log('adding scripts');
        //adds a script into unsafeWindow. This poses security and invisibility issues.
	    if (typeof scripts == 'string') { scripts = [scripts]; }
	    var script = gEBTN('head')[0].appendChild(cE('script'));
	    script.appendChild(cTN(scripts.join('\n')));    
    }
}
try {test=GM_addStyle;}
catch (err) {
    GM_log('adding GM_addStyle function');
    function GM_addStyle(styles){
	    GM_log('adding styles');
	    if (typeof styles == 'string') { styles = [styles]; }
	    var style = gEBTN('head')[0].appendChild(cE('style'));
	    style.type = 'text/css';
	    style.appendChild(cTN(styles.join(' ')));
    }
}

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
//initialisation object
var hackHUD = {
    markupComplete: false,
    YUILoadComplete: false,
	init: function(){
        GM_log('hackHUD:init');
		var article = getArticle();
		var context = getArticleContext(article);
		var query = getArticleQuery(article);
		var YUIversion='2.3.0';
		var baseYUIURL='http://yui.yahooapis.com/' + YUIversion + '/build/';
		GM_includeOnce([
		    {url: baseYUIURL + 'container/assets/container.css' },
            {url: baseYUIURL + 'menu/assets/menu.css' },
            {obj: 'YAHOO', url: baseYUIURL + 'utilities/utilities.js' },
            {obj: 'YAHOO.util.Dom', url: baseYUIURL + 'dom/dom-min.js' },
            {obj: 'YAHOO.util.Event', url: baseYUIURL + 'event/event-min.js' },
            {obj: 'YAHOO.util.Anim', url: baseYUIURL + 'animation/animation-min.js' },
            {obj: 'YAHOO.widget.Container', url: baseYUIURL + 'container/container-min.js' },
            {obj: 'YAHOO.util.Menu', url: baseYUIURL + 'menu/menu-min.js' }
		    ], this.YUIComplete, this.YUITimeout
		);
		getTags(context, query, hackHUD.MarkupComplete); //get content analysis asynchronously
	    GM_log(new Date() + ':init completed');
	},
	
	MarkupComplete: function(aTags){
	    addHackTags(aTags);
	    hackHUD.markupComplete=true;
	    if (hackHUD.YUILoadComplete) addMenuListeners();
	    else GM_log('still waiting for the YUI to load before addMenuListeners');
	    GM_log(new Date() + ':Markup completed');
	},
	
	YUIComplete: function(closureFunc){
	    if (window.YAHOO||(window.YAHOO=closureFunc('YAHOO'))) {
	        unsafeWindow.YAHOO=YAHOO;
	        YAHOO.namespace('HUD');
	        YAHOO.HUD.currentMenuID = 1;
	        hackHUD.YUILoadComplete=true;
	        if (hackHUD.markupComplete) addMenuListeners();
	        else GM_log('still waiting for content analysis to return before addMenuListeners');
	    } else alert('could not get YAHOO variable from GM_includeOnce scripts');
	    GM_log(new Date() + ':YUI completed');
    },
	
	YUITimeout: function(){
	    alert('Failed to load Yahoo libraries. Cannot display menus.');
	}
}

// Closure for parameterised object reference calls
function paramCall(func, obj, params) {
    //return pointer to an inner function creating closure, maintaining the scope chain and its values
    //closure lasts for the lifetime of the variable assigned to the return of this function
    return function(){
        var totalParams=params;
        //add in any parameters passed directly to the function call (like from events etc.)
        for (var i=0;i<arguments.length;i++) totalParams=totalParams.concat(arguments[i]);
        func.apply(obj, totalParams);
    };
}
