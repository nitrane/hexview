
var ChunkReader = require ('./chunkreader.js');

/**
 * Create a new view object.
 */
exports.View = function () {
	this.source = null;
	this.source_position = 0;
	this.bytes_per_line = 32;
	this.render ();
}

/**
 * Set the source for a view and update the display.
 */
exports.View.prototype.setSource = function (source) {
	this.source = source;
	this.source_position = 0;
	this.render ();	
}

/**
 * Set the source position.  Doesn't update the view.
 */
exports.View.prototype.setSourcePosition = function (source_position) {
	this.source_position = source_position;
}

/**
 * Render a view worth of content starting at the current source position.
 */
exports.View.prototype.render = function () {
	
	// Figure out how much content to show.
	var height = window.innerHeight;
	var total_lines = Math.round (1.25 * height / 14);
	
	var container = document.querySelector ('#container');
	container.innerHTML = '';
	
	if (this.source === null) {
		return;
	}
	
	// Get a chunk of data and render it.	
	var cr = new ChunkReader.ChunkReader (this.source, 
										  this.bytes_per_line * total_lines);
	var chunk = cr.fetch (this.source_position);
	
	for (var k=0; k < chunk.length; k += this.bytes_per_line) {
		
		var line = document.createElement ('div');	
		var address = k * this.bytes_per_line;
				
		line.className = 'row';
		line.appendChild (gap ());
		line.appendChild (render_line (address, chunk.slice (k, k + this.bytes_per_line)));		
		container.appendChild (line);
	}
}

/**
 * Generates document fragments for a line worth of bytes.
 */
function render_line (address, bytes) {
	
	var address_node = document.createElement ('span');
	var hex_container = document.createElement ('span');
	var ascii_container = document.createElement ('span');
	
	address_node.className = 'addr';
	address_node.textContent = pad (address.toString (16), 8);
				
	for (var k=0; k < bytes.length; ++k) {
		
		var hex_node = document.createElement ('span');
		var ascii_node = document.createElement ('span');
		
		hex_node.className = 'byte';
		ascii_node.className = 'ascii';
		hex_container.appendChild (hex_node);
		ascii_container.appendChild (ascii_node);	
		
		var byte = bytes[k].toString (16);
		if (byte.length == 1) {
			byte = '0' + byte;
		}
	
		hex_node.textContent = byte;
		
		// Add a gap every 8 bytes.
		if ((k+1) % 8 == 0) {
			hex_container.appendChild (gap ());
		}
						
		if (bytes[k] >= 32 && bytes[k] <= 126) {
			ascii_node.textContent = String.fromCharCode (bytes[k]);		
		}
		else {
			ascii_node.textContent = '.';
		}
	}
	
	var frag = document.createDocumentFragment ();
	frag.appendChild (address_node);
	frag.appendChild (hex_container);
	frag.appendChild (ascii_container);
	
	return frag;
}

/**
 * Returns a "gap" element.
 */
function gap () {
	var gap = document.createElement ('span');
	gap.className = 'gap';
	return gap;
}

/**
 * Simple zero padding function. This needs work.
 */
function pad (num, size) {
    var s = "000000000" + num;
    return s.substr (s.length - size);
}