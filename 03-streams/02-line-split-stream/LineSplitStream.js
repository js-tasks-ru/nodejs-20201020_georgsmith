const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor({ delimiter, ...options }) {
    super(options);
    this.stringChunkAccumulator = "";
    this.delimiter = delimiter || os.EOL;
  }

  _transform(chunk, encoding, callback) {
    this.stringChunkAccumulator += chunk.toString("utf8");

    if (this.stringChunkAccumulator.includes(this.delimiter)) {
      const lines = this.stringChunkAccumulator.split(this.delimiter);
      this.stringChunkAccumulator = lines.pop();
      lines.forEach(line => this.push(line));
    }

    callback();
  }

  _flush(callback) {
    callback(null, this.stringChunkAccumulator);
  }
}

module.exports = LineSplitStream;
