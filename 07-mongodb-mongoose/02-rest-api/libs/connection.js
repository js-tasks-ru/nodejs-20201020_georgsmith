const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const config = require('../config');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.set('debug', false);

mongoose.plugin(beautifyUnique);

mongoose.Schema.prototype.toJSONNormalize = function() {
  this.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: (doc, converted) => {
      delete converted._id;
    }
  });
}

module.exports = mongoose.createConnection(config.mongodb.uri);
