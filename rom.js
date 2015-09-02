
var fs = require ('fs');
var util = require ('util');
var ee = require ('events').EventEmitter;

exports.Rom = function () {
	this.bytes = null;
	ee.call (this);
}

util.inherits (exports.Rom, ee);

exports.Rom.prototype.load = function (path) {
	
	var obj = this;
	var offset = 0;
	var stat = fs.statSync (path);
	
	// Some ROMs have a superflous 512 byte header.
	if (stat['size'] % 1024) {
		offset = 512;
	}
	
	this.bytes = new Buffer (stat['size'] - offset);			
	var readable = fs.createReadStream (path, { start : offset });
	
	readable
		.on ('data', function (chunk) {
			chunk.copy (obj.bytes);
			obj.emit ('chunk', chunk);
		})
		.on ('end', function () {
			obj.emit ('done');
			obj = null;
		});	
}
