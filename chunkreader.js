
/**
 * ChunkReader constructor.
 * 
 * @param source
 * @param chunk_length
 */
exports.ChunkReader = function (source, chunk_length) {
	this.source = source;
	this.chunk_length = chunk_length;
}

/**
 * Total number of chunks that can be read.
 */
exports.ChunkReader.prototype.totalChunks = function () {
	return Math.round (this.source.totalBytes () / this.chunk_length + 0.5);
}

/**
 * Get a chunk starting at source position 'pos'.
 * 
 * @param which
 */
exports.ChunkReader.prototype.fetch = function (pos) {
	pos = Math.max (pos, 0);
	pos = Math.min (pos, this.source.totalBytes ());
	return this.source.read (pos, this.chunk_length);
}
