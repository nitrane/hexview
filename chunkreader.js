
exports.ChunkReader = function (source, lines_per_chunk, bytes_per_line) {
	this.source = source;
	this.chunk_length = lines_per_chunk * bytes_per_line;
}

exports.ChunkReader.prototype.totalChunks = function () {
	return Math.round (this.source.totalBytes () / this.chunk_length + 0.5);
}

exports.ChunkReader.prototype.fetch = function (which) {
	
	if (which < 0) {
		which = 0;
	}
	
	var start = which * this.chunk_length;
	
	if (start >= this.source.totalBytes ()) {
		start = this.source.totalBytes () - this.chunk_length;
	}
	
	var buffer = this.source.read (start, this.chunk_length);
}
