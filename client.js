
var ipc = require ('ipc');
var Rom = require ('./rom.js');

var groups_per_line = 4;
var groups = [];
var rom = null;

/**
 * The ByteGroup object maintains the HTML representation for a group
 * of 8 bytes.
 */
var ByteGroup = function (bytes) {
	
	this.ascii_frag = document.createDocumentFragment ();
	this.hex_frag = document.createDocumentFragment ();
	
	for (var k=0; k<bytes.length; ++k) {
		
		var byte = bytes[k].toString (16);
		if (byte.length == 1) {
			byte = '0' + byte;
		}
		
		var hex_node = document.createElement ('div');
		var ascii_node = document.createElement ('div');
		
		hex_node.className = 'byte';
		hex_node.textContent = byte;					
		this.hex_frag.appendChild (hex_node);	

		ascii_node.className = 'ascii';
		
		if (bytes[k] >= 32 && bytes[k] <= 126) {
			ascii_node.textContent = String.fromCharCode (bytes[k]);		
		}
		else {
			ascii_node.textContent = '.';
		}
		
		this.ascii_frag.appendChild (ascii_node);
	}
	
	var gap_node = document.createElement ('div');
	gap_node.className = 'gap';
	this.hex_frag.appendChild (gap_node);
}

/**
 * Get notified when a new ROM has been selected.
 */
ipc.on ('load-rom', function (path) {
	
	rom = new Rom.Rom ();
	
	rom.on ('chunk', function (chunk) {
		for (var k=0; k < chunk.length; k += 8) {
			groups.push (new ByteGroup (chunk.slice (k, k + 8)));
		}		
	})
	.on ('done', render);
	
	rom.load (path);
});

/**
 * Render the hex output of the ROM.
 */
function render () {
	
	var hex = document.querySelector ('#hex');
	hex.innerHTML = '';
		
	for (var k=0; k < groups.length; k += groups_per_line) {
				
		var node = document.createElement ('div');
		var address_node = document.createElement ('div');					
		var ascii_frag = document.createDocumentFragment ();

		node.className = 'row';
		address_node.className = 'addr';
		address_node.textContent = pad ((k * groups_per_line).toString (16), 8); 
		node.appendChild (address_node);
			
		for (var j=0; j < groups_per_line; ++j) {
			node.appendChild (groups[k+j].hex_frag);
			ascii_frag.appendChild (groups[k+j].ascii_frag);	
		}
		
		node.appendChild (ascii_frag);
		hex.appendChild (node);
	}
}

function pad (num, size) {
    var s = "000000000" + num;
    return s.substr (s.length - size);
}