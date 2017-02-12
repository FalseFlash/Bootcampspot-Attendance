// ==UserScript==
// @name         Better Bootcampspot Attendance
// @namespace    raymccann.com.bootcamp
// @version      1.0
// @description  Make the attendance table better.
// @author       You
// @match        http://www.bootcampspot.com/
// @match        www.bootcampspot.com
// @grant        none
// ==/UserScript==

function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
     specifies the desired element(s).
     */
    actionFunction, /* Required: The code to run when elements are
     found. It is passed a jNode to the matched
     element.
     */
    bWaitOnce,      /* Optional: If false, will continue to scan for
     new elements even after the first match is
     found.
     */
    iframeSelector  /* Optional: If set, identifies the iframe to
     search.
     */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
            .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
         are new.
         */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey];
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                        actionFunction,
                        bWaitOnce,
                        iframeSelector
                    );
                },
                500
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

var cssHead = '//cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css';
var jsHead = '//cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js';

var head = document.querySelector('head');
var body = document.querySelector('body');

var css = document.createElement('link');
css.setAttribute('href', cssHead);
css.setAttribute('rel', 'stylesheet');
css.setAttribute('type', 'text/css');

var js = document.createElement('script');
js.setAttribute('src', jsHead);

head.appendChild(css);
body.appendChild(js);

function updateTable() {
    $('.table').DataTable({
        "pageLength": 10,
        "order": [[ 1, 'asc' ]]
    });
}

waitForKeyElements(".table", updateTable);
