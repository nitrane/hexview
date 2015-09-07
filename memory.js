
var fs = require ('fs');
var util = require ('util');
var ee = require ('events').EventEmitter;

exports.Memory = function () {
	this.bytes = null;
	ee.call (this);
};

util.inherits (exports.Memory, ee);

exports.Memory.prototype.loadFile = function (path) {

	var obj = this;
	var stat = fs.statSync (path);

	this.bytes = new Buffer (stat.size);
	var readable = fs.createReadStream (path);

	readable
		.on ('data', function (chunk) {
			chunk.copy (obj.bytes);
			obj.emit ('chunk', chunk);
		})
		.on ('end', function () {
			obj.emit ('done');
			obj = null;
		});
};

exports.Memory.prototype.loadString = function (str) {
	this.bytes = new Buffer (str, 'binary');
	this.emit ('chunk', this.bytes);
	this.emit ('done');
};
