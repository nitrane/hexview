
var ipc = require ('ipc');
var Memory = require ('./memory.js');

var groups_per_line = 4;
var groups = [];
var memory = null;

/**
 * The ByteGroup object maintains the HTML representation for a group
 * of 8 bytes.
 */
var ByteGroup = function (bytes) {
	
	this.ascii_frag = document.createDocumentFragment ();
	this.hex_frag = document.createDocumentFragment ();
	
	for (var k=0; k < bytes.length; ++k) {				
		
		var hex_node = document.createElement ('div');
		var ascii_node = document.createElement ('div');
		
		hex_node.className = 'byte';
		ascii_node.className = 'ascii';
				
		this.hex_frag.appendChild (hex_node);
		this.ascii_frag.appendChild (ascii_node);	
		
		if (k < bytes.length) {
		
			var byte = bytes[k].toString (16);
			if (byte.length == 1) {
				byte = '0' + byte;
			}
		
			hex_node.textContent = byte;				
			if (bytes[k] >= 32 && bytes[k] <= 126) {
				ascii_node.textContent = String.fromCharCode (bytes[k]);		
			}
			else {
				ascii_node.textContent = '.';
			}
		}
	}
	
	var gap_node = document.createElement ('div');
	gap_node.className = 'gap';
	this.hex_frag.appendChild (gap_node);
}

/**
 * Get notified when a new ROM has been selected.
 */
ipc.on ('load-file', function (path) {

	reset ();
	
	memory = new Memory.Memory ();	
	memory.on ('chunk', function (chunk) {
		for (var k=0; k < chunk.length; k += 8) {
			groups.push (new ByteGroup (chunk.slice (k, k + 8)));
		}
	})
	.on ('done', function () {
		render ();
	});
	
	memory.loadFile (path);
});

/**
 * Get notified when the file is closed.
 */
ipc.on ('close-file', intro);

function intro () {
	
	reset ();
	memory = new Memory.Memory ();
	memory.on ('chunk', function (chunk) {
		for (var k=0; k < chunk.length; k += 8) {
			groups.push (new ByteGroup (chunk.slice (k, k + 8)));
		}
	})
	.on ('done', function () {
		render ();
	});
	
	memory.loadString ('hexview v0.0')
}

/**
 * Reset the view and free up resources.
 */
function reset () {
	
	memory = null;
	groups.length = 0;
	
	var addr = document.querySelector ('#addr');
	var hex = document.querySelector ('#hex');
	var ascii = document.querySelector ('#ascii');
	
	addr.innerHTML = '';
	hex.innerHTML = '';
	ascii.innerHTML = '';	
}

/**
 * Render the hex output of the ROM.
 */
function render () {
	
	var addr = document.querySelector ('#addr');
	var hex = document.querySelector ('#hex');
	var ascii = document.querySelector ('#ascii');
	
	for (var k=0; k < groups.length; k += groups_per_line) {
		
		var address_node = document.createElement ('div');		
		var hex_node = document.createElement ('div');
		var ascii_node = document.createElement ('div');

		address_node.className = 'row';
		hex_node.className = 'row';
		ascii_node.className = 'row';
		address_node.classList.add ('row', 'addr');
		address_node.textContent = pad ((k * groups_per_line).toString (16), 8); 
		addr.appendChild (address_node);
			
		for (var j=0; k+j < groups.length && j < groups_per_line; ++j) {			
			hex_node.appendChild (groups[k+j].hex_frag);
			ascii_node.appendChild (groups[k+j].ascii_frag);	
		}

		hex.appendChild (hex_node);
		ascii.appendChild (ascii_node);
	}
}

/**
 * Simple zero padding function. This needs work.
 */
function pad (num, size) {
    var s = "000000000" + num;
    return s.substr (s.length - size);
}