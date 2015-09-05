
/**
 * The ByteGroup object maintains the HTML representation for a group
 * of 8 bytes.
 */
exports.ByteGroup = function (bytes) {
	
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
			if (bytes[k] >= 32 && bytes[k] <= 126) {
				ascii_node.textContent = String.fromCharCode (bytes[k]);		
			}
			else {
				ascii_node.textContent = '.';
			}
		}
	}
	
	var gap_node = document.createElement ('span');
	gap_node.className = 'gap';
	this.hex_frag.appendChild (gap_node);
}