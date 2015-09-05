
var fs = require ('fs');

exports.Source = function (path) {
	this.path = path;
	this.total_bytes = 0;
	this.fd = null;
}

exports.Source.prototype.totalBytes = function () {
	if (this.total_bytes == 0) {
		var stat = fs.statSync (this.path);
		this.total_bytes = stat['size'];
	}
	
	return this.total_bytes;
}

exports.Source.prototype.read = function (start, length, callback) {
	
	if (this.fd === null) {
		this.fd = fs.openSync (this.path, "r");
	}
	
	var buffer_offset = 0;
	var bytes_left = Math.min (length, this.totalBytes ());
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