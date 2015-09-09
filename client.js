
var ipc = require ('ipc');
var View = require ('./view.js');
var Source = require ('./source.js');

var g_view = null;

/**
 * Notification for when the browser window has loaded the webcontents.
 */
ipc.on ('init', function () {
	g_view = new View.View ();
});

/**
 * Notification for when the browser window has been resized.
 */
ipc.on ('resize', function () {
	g_view.render ();
});

/**
 * Notification for when a new file has been selected.
 */
ipc.on ('file-open', function (path) {
	var source = new Source.Source (path);
	g_view.setSource (source);
});

/**
 * Notification for when the file is closed.
 */
ipc.on ('file-close', function () {
	g_view.setSource (null);
});
