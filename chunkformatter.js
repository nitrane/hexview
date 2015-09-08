
/**
 * Chunk formatters take a chunk read from a source and formats the chunk
 * for display.
 */

/**
 * Constructor.
 * 
 * @param bytes_per_line must be a multiple of 8.
 */
exports.ChunkFormatter = function (bytes_per_line) 
{
	this.bytes_per_line = bytes_per_line;
}

/**
 * Format a chunk.
 */
exports.ChunkFormatter.prototype.format = function (chunk)
{
}