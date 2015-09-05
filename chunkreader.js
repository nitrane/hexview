
/**
 * ChunkReader constructor.
 * 
 * @param source
 * @param lines_per_chunk
 * @param bytes_per_line
 */
exports.ChunkReader = function (source, lines_per_chunk, bytes_per_line) {
	this.source = source;
	this.chunk_length = lines_per_chunk * bytes_per_line;
}

/**
 * Total number of chunks that can be read.
 */
exports.ChunkReader.prototype.totalChunks = function () {
	return Math.round (this.source.totalBytes () / this.chunk_length + 0.5);
}

/**
 * Get a chunk at index 'which'.
 * 
 * @param which
 */
exports.ChunkReader.prototype.fetch = function (which) {
	which = Math.max (which, 0);
	which = Math.min (which, this.totalChunks () - 1);
	var start = which * this.chunk_length;
	return this.source.read (start, this.chunk_length);
}
