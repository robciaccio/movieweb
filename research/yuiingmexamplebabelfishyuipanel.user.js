// ==UserScript==
// @name            YUI-in-GM Example: Babelfish YUI Panel
// @namespace       http://developer.yahoo.com/yui/examples/greasemonkey/
// @description     (v20070103.1) Highlight a word or phrase with your mouse on yuiblog.com or news.yahoo.com or carlo.zottmann.org, hold the Shift key when you let go of the mouse button, and the marked text will be translated using Babelfish and displayed in a YUI panel.
// @author          Carlo Zottmann <zottmann@yahoo-inc.com>
// @include         http://*yuiblog.com/*
// @include         http://news.yahoo.com/*
// @include         http://carlo.zottmann.org/*
// ==/UserScript==


// Settings used by the loader
var GM_YUILOADER_CONFIG = {
    // List of JS libraries and CSS files to load. obj is used for the object
    // detection used in the loader. Basically, if the object already exists,
    // the script is not injected in the page.
    assets: [
        { type: 'css', url: 'http://developer.yahoo.com/yui/build/container/assets/container.css' },
        { type: 'js', obj: 'YAHOO', url: 'http://us.js2.yimg.com/us.js.yimg.com/lib/common/utils/2/yahoo_2.1.0.js' },
        { type: 'js', obj: 'YAHOO.util.Event', url: 'http://us.js2.yimg.com/us.js.yimg.com/lib/common/utils/2/event_2.1.0.js' },
        { type: 'js', obj: 'YAHOO.util.Dom', url: 'http://us.js2.yimg.com/us.js.yimg.com/lib/common/utils/2/dom_2.1.0.js' },
        { type: 'js', obj: 'YAHOO.util.Anim', url: 'http://us.js2.yimg.com/us.js.yimg.com/lib/common/utils/2/animation_2.1.0.js' },
        { type: 'js', obj: 'YAHOO.widget.Panel', url: 'http://us.js2.yimg.com/us.js.yimg.com/lib/common/widgets/2/container/container_2.1.0.js' }
    ],

    // What should be the max allowed loading time? In this example, the
    // script has 6 seconds to load the libraries and CSS files.
    timeout: 6000,

    // How often should the script check if everything was loaded?
    interval: 300,

    // What to trigger once all assets are loaded (a string). Example: execute
    // YBFLOOKUP.run() (this will be eval()'ed later on, hence the string)
    runFunction: 'YBFLOOKUP.run()',
}



// START LOADER CODE //////////////////////////////////////////////////////////

var YAHOO;
var GM_YUILOADER = {
    // Version of the loader
    VERSION: 20070103,

    // Simple internal timer to keep track of the passed time.
    loaderTimer: 0,
};


// This function checks whether everything was loaded yet; if not, it'll wait
// some more and call itself again. It'll do so until either all assets are
// loaded or the max loading time (GM_YUILOADER.loaderTimer.timeout) is
// reached.

GM_YUILOADER.loaderCheck = function() {
    var ud = unsafeWindow.document;

    // Do we have a green light yet?
    if (ud.GM_YUILOADER_DOC.go) {
        YAHOO = unsafeWindow.YAHOO;
        delete ud.GM_YUILOADER_DOC;
        GM_YUILOADER.run();
    }
    // Nope, not yet. Rinse & repeat!
    else {
        GM_YUILOADER.loaderTimer += GM_YUILOADER_CONFIG.interval;

        if (GM_YUILOADER.loaderTimer >= GM_YUILOADER_CONFIG.timeout) {
            return;
        }

        setTimeout(GM_YUILOADER.loaderCheck, GM_YUILOADER_CONFIG.interval);
    }
}


// Main function that initiates loading the external JS and/or CSS files

GM_YUILOADER.loader = function() {
    if (document.contentType != 'text/html' || !document.body) { return; }

    var ud = unsafeWindow.document;

    // This object holds the important stuff to make this work. It's a property
    // of GM's unsafeWindow.document object.

    ud.GM_YUILOADER_DOC = {
        // Number of JS libraries loaded so far (increased by countLoaded()
        // below)
        numberLoaded: 0,

        // Total number of JS files.
        numberTotal: 0,

        // If this is bool true, we're good to go! This is checked by
        // GM_YUILOADER.loaderCheck().
        go: false,

        // This function will be called by the onLoad events.
        countLoaded: function() {
            if (++this.numberLoaded == this.numberTotal) { this.go = true; }
        }
    };

    // Now let's add the extra tags to the page that'll load the libraries and
    // CSS files.

    var numAssets = GM_YUILOADER_CONFIG.assets.length;

    for (var a = 0; a < numAssets; a++) {
        var tag;
        var asset = GM_YUILOADER_CONFIG.assets[a];

        switch (asset.type) {
            // CSS file
            case 'css':
                tag = document.createElement('link');
                tag.href = asset.url;
                tag.type = 'text/css';
                tag.rel = 'stylesheet';
                break;

            // Javascript library.
            case 'js':
                var injectScript = true;

                // Object detection
                try {
                    injectScript = eval('window.' + asset.obj + ' === undefined');
                }
                catch (e) {}

                if (injectScript) {
                    tag = document.createElement('script');
                    tag.src = asset.url;

                    // The crucial part: triggering document.GM_YUILOADER.countLoaded()
                    // means keeping track whether all scripts are loaded yet.

                    tag.setAttribute('onload', 'document.GM_YUILOADER_DOC.countLoaded();');

                    // How many JS libraries are we dealing with again? Let's keep
                    // track.

                    ud.GM_YUILOADER_DOC.numberTotal++;
                }
                break;
        }

        document.body.appendChild(tag);
    }

    // Did we actually include anything in the page? If so, trigger the
    // GM_YUILOADER.loaderCheck "watchdog". If not, just tell it to run the
    // main part of the script.

    if (ud.GM_YUILOADER_DOC.numberTotal > 0) {
        setTimeout(GM_YUILOADER.loaderCheck, GM_YUILOADER_CONFIG.interval);
    }
    else {
        ud.GM_YUILOADER_DOC.go = true;
        GM_YUILOADER.loaderCheck();
    }
}

GM_YUILOADER.run = function() {
    // When we're here, we're good to go!
    eval(GM_YUILOADER_CONFIG.runFunction);
}


// The initial GM_YUILOADER trigger.
setTimeout(GM_YUILOADER.loader, 500);

// END LOADER CODE ////////////////////////////////////////////////////////////



// START PAYLOAD SECTION //////////////////////////////////////////////////////

// "YBFLOOKUP" == "Yahoo! Babelfish Lookup (english to german)"
var YBFLOOKUP = {
    panelTitle: 'Babelfish.yahoo.com Translation EN-DE',
    panel: null,
};


// Event handler for mouseUp events
YBFLOOKUP.subscriberSelect = function(e) {
    var selection = window.getSelection();
    var selectionText = selection.toString();

    // Shift key pressed? Anything selected?
    if (!e.shiftKey || selectionText == '') { return; }

    YBFLOOKUP.panel.setBody('Loading Babelfish EN-DE translation, just a second...');
    YBFLOOKUP.panel.cfg.setProperty('x', e.clientX + 20);
    YBFLOOKUP.panel.cfg.setProperty('y', e.pageY + 20);
    YBFLOOKUP.panel.show();

    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://babelfish.yahoo.com/translate_txt?ei=UTF-8&doit=done&fr=bf-home&intl=1&tt=urltext&trtext=' + encodeURIComponent(selectionText) + '&lp=en_de&btnTrTxt=Translate',
        payload: { selectionText: selectionText },
        onload: function(details) {
            // Quick'n'dirty translation results parsing
            var bfPage = details.responseText.replace(/\n/g, ' ');
            var bfParse = bfPage.match(/<div id=\"result\"><div[^>]*>(.+?)<\/div>/);

            if (bfParse) {
                YBFLOOKUP.panel.setBody(bfParse[1]);
            }
            else {
                YBFLOOKUP.panel.setBody('Sorry, could not translate <em>&quot;' + this.payload.selectionText + '&quot;</em>!');
            }

            YBFLOOKUP.panel.show();
        }
    });
}


// This function is triggered by the loader engine once the scripts are loaded
YBFLOOKUP.run = function() {
    // Build a panel that shows the translations later on
    YBFLOOKUP.panel = new YAHOO.widget.Panel("dictionaryPanel",
                                              { width: '400px', visible: false, draggable: false, close: true }
                                             );
    YBFLOOKUP.panel.setHeader(YBFLOOKUP.panelTitle);
    YBFLOOKUP.panel.setBody('Loading...');
    YBFLOOKUP.panel.render(document.body);

    YBFLOOKUP.kl = new YAHOO.util.KeyListener(document,
                                               { keys: [27] },
                                               { fn: function() { if (YBFLOOKUP.panel) { YBFLOOKUP.panel.hide(); } } }
                                              );
    YBFLOOKUP.kl.enable();

    // Listen to mouseUp events
    YAHOO.util.Event.addListener(document.body, 'mouseup', YBFLOOKUP.subscriberSelect);
}

// END PAYLOAD SECTION ////////////////////////////////////////////////////////

