
var ChunkReader = require ('./chunkreader.js');

var ByteGroup = function (bytes) {
	
	this.ascii_frag = document.createDocumentFragment ();
	this.hex_frag = document.createDocumentFragment ();
	
	for (var k=0; k < bytes.length; ++k) {				
		
		var hex_node = document.createElement ('span');
		var ascii_node = document.createElement ('span');
		
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
			
			// Add a gap every 8 bytes.
			if (k+1 % 8 == 0) {
				var gap_node = document.createElement ('span');
				gap_node.className = 'gap';
				this.hex_frag.appendChild (gap_node);
			}
							
			if (bytes[k] >= 32 && bytes[k] <= 126) {
				ascii_node.textContent = String.fromCharCode (bytes[k]);		
			}
			else {
				ascii_node.textContent = '.';
			}
		}
	}	
}

exports.View = function () {
	this.source = null;
	this.bytes_per_line = 32;
	render (this);
}

exports.View.prototype.setSource = function (source) {
	this.source = source;
	render (this);
}

function render (view) {
	
	var height = window.innerHeight;
	var total_lines = Math.round (2 * height / 14 + 0.5);
	
	var addr = document.querySelector ('#addr');
	var hex = document.querySelector ('#hex');
	var ascii = document.querySelector ('#ascii');

	addr.innerHTML = '';
	hex.innerHTML = '';
	ascii.innerHTML = '';
	
	if (view.source === null) {
		return;
	}
	
	var cr = new ChunkReader.ChunkReader (view.source, 
										  view.bytes_per_line * total_lines);
	var chunk = cr.fetch (0);	// 0 should be the current scroll position.
	
	for (var k=0; k < chunk.length; k += view.bytes_per_line) {
		
		var group = new ByteGroup (chunk.slice (k, k + view.bytes_per_line));
		
		var address_node = document.createElement ('div');		
		var hex_node = document.createElement ('div');
		var ascii_node = document.createElement ('div');
		var gap_node = document.createElement ('span');
		
		gap_node.className = 'gap';
		address_node.className = 'row';
		hex_node.className = 'row';
		ascii_node.className = 'row';
		address_node.classList.add ('row', 'addr');
		address_node.textContent = pad ((k * view.bytes_per_line).toString (16), 8); 
		addr.appendChild (address_node);
		hex_node.appendChild (group.hex_frag);
		hex_node.appendChild (gap_node);
		ascii_node.appendChild (group.ascii_frag);
		
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