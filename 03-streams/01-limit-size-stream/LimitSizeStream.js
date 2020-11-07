const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor({ limit, ...options }) {
    if(!limit || typeof limit !== "number")
        throw Error("Please provide corect limit option");
    super(options);
    this.limit = limit;
    this.transferedDataSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.transferedDataSize += chunk.length;

    if(this.transferedDataSize > this.limit) {
      callback(new LimitExceededError());
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
