
var ipc = require ('ipc');
var loader = require ('./loader.js');
var bytegroup = require ('./byte_group.js');

var g_groups_per_line = 4;
var g_line = [];
var g_line_count = 0;
var g_loader = new loader.Loader ();

g_loader.on ('chunk', function (chunk) {	
	for (var k=0; k < chunk.length; k += 8) {
		var group = new bytegroup.ByteGroup (chunk.slice (k, k+8));
		g_line.push (group);
		if (g_line.length == g_groups_per_line) {
			render_line ();
		}
	}
})
.on ('done', function () {
	if (g_line.length > 0 ) {
		render_line ();
	}
});

/**
 * Get notified when a new ROM has been selected.
 */
ipc.on ('load-file', function (path) {
	reset ();
	g_loader.loadFile (path);
});

/**
 * Get notified when the file is closed.
 */
ipc.on ('close-file', intro);

function intro () {
	reset ();
	g_loader.loadString ('hexview v0.0')
}

/**
 * Reset the view and free up resources.
 */
function reset () {
	
	g_line_count = 0;
	
	var addr = document.querySelector ('#addr');
	var hex = document.querySelector ('#hex');
	var ascii = document.querySelector ('#ascii');
	
	addr.innerHTML = '';
	hex.innerHTML = '';
	ascii.innerHTML = '';	
}

function render_line () {
	
	var addr = document.querySelector ('#addr');
	var hex = document.querySelector ('#hex');
	var ascii = document.querySelector ('#ascii');
	var address_node = document.createElement ('div');		
	var hex_node = document.createElement ('div');
	var ascii_node = document.createElement ('div');
	
	var address = (g_line_count * g_groups_per_line * 8).toString (16);

	address_node.className = 'row';
	hex_node.className = 'row';
	ascii_node.className = 'row';
	address_node.classList.add ('row', 'addr');
	address_node.textContent = pad (address, 8); 
	addr.appendChild (address_node);
	
	for (var j = 0; j < g_line.length; ++j) {
		hex_node.appendChild (g_line[j].hex_frag);
		ascii_node.appendChild (g_line[j].ascii_frag);
	}
	
	hex.appendChild (hex_node);
	ascii.appendChild (ascii_node);

    g_line.length = 0;	
	++g_line_count;
}

/**
 * Simple zero padding function. This needs work.
 */
function pad (num, size) {
    var s = "000000000" + num;
    return s.substr (s.length - size);
}