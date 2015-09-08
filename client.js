
var ipc = require ('ipc');
var View = require ('./view.js');
var Source = require ('./source.js');

var g_view = null;

ipc.on ('init', function () {
	g_view = new View.View ();
});

/**
 * Get notified when a new file has been selected.
 */
ipc.on ('file-open', function (path) {
	var source = new Source.Source (path);
	g_view.setSource (source);
});

/**
 * Get notified when the file is closed.
 */
ipc.on ('file-close', function () {
	g_view.setSource (null);
});
