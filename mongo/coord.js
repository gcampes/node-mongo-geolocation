var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CitySchema = new Schema({
  name: String,
  type: String,
  cd_estabelecimento: String,

  geo: {
    type: [Number],
    index: '2d'
  }
});

module.exports = mongoose.model('Point', CitySchema);
