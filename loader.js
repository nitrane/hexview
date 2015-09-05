
var fs = require ('fs');
var util = require ('util');
var ee = require ('events').EventEmitter;

exports.Loader = function () {
	ee.call (this);
}

util.inherits (exports.Loader, ee);

exports.Loader.prototype.loadFile = function (path) {
		
	var obj = this;
	var readable = fs.createReadStream (path);
	
	readable
		.on ('data', function (chunk) {
			obj.emit ('chunk', chunk);
		})
		.on ('end', function () {
			obj.emit ('done');
			obj = null;
		});	
}

exports.Loader.prototype.loadString = function (str) {	
	var chunk = new Buffer (str, 'binary');
	this.emit ('chunk', chunk);
	this.emit ('done');
}
