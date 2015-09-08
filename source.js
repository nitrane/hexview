
var fs = require ('fs');

/**
 * The Source class represents a source of data we read bytes from. 
 */

/**
 * Source constructor.
 * 
 * @param path
 */
exports.Source = function (path) {
	this.path = path;
	this.total_bytes = 0;
	this.fd = null;
}

/**
 * Returns the total number bytes are available.
 */
exports.Source.prototype.totalBytes = function () {
	if (this.total_bytes == 0) {
		var stat = fs.statSync (this.path);
		this.total_bytes = stat['size'];
	}
	
	return this.total_bytes;
}

/**
 * Read 'length' bytes from the source starting at 'start'. 
 * Returns a buffer.
 * 
 * @param start
 * @param length
 */
exports.Source.prototype.read = function (start, length) {
	
	if (this.fd === null) {
		this.fd = fs.openSync (this.path, "r");
	}
	
	var buffer_offset = 0;
	var bytes_left = Math.min (length, this.totalBytes () - start);
	var buffer = new Buffer (bytes_left);
	 
	while (bytes_left > 0) {
		
		var nread = fs.readSync (this.fd, buffer, buffer_offset, bytes_left, start);
		if (nread == 0) {
			break;
		}
		
		bytes_left -= nread;
		start += nread;
		buffer_offset += nread;
	}
	
	return buffer;
}