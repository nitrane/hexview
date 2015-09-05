
// simple test node test driver for the source and chunk reader.
// to run node test.js

var Source = require ('./source.js');
var ChunkReader = require ('./chunkreader.js');

var s = new Source.Source ('./junk.bin');
var cr = new ChunkReader.ChunkReader (s, 4096, 32);

var chunk = cr.fetch (0);
