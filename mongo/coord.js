var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CitySchema = new Schema({
  name: String,
  type: String,

  geo: {
    type: [Number],
    index: '2d'
  }
});

module.exports = mongoose.model('Coord', CitySchema);
