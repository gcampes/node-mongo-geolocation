var Coord = require('./mongo/coord');
var Geolib = require('geolib');
var Mongoose = require('mongoose');
var Promise = require('promise');

var db = Mongoose.connect('mongodb://127.0.0.1:27017/geolocation');
Mongoose.connection.once('connected', function() {
	console.log("Database connected successfully")
});

var fetchCoordinates = new Promise(function(resolve, reject){
  console.time('Time');
  var result = [];
  Coord.find().exec(function(err, coordinates){
    coordinates.forEach(function(coordinate, key){
      // console.log(key, coordinates.length);
      result.push({
        id: coordinate._id,
        name: coordinate.name,
        type: coordinate.type,
        geo: coordinate.geo,
        coords: []
      });

      Coord.find({
        geo: {
          $nearSphere: coordinate.geo,
          $maxDistance: 200 / 6371
        }
      }).exec(function(err, coords){
        coords.forEach(function(coord, coordsKey){
          if(result[key].id.toString() != coord._id.toString())
          result[key].coords.push({
            id: coord._id,
            name: coord.name,
            type: coord.type,
            geo: coord.geo,
            distance: Geolib.getDistance(coordinate.geo, coord.geo)
          });

          if((key + 1) == coordinates.length && (coordsKey + 1) == coords.length){
            resolve(result);
            console.timeEnd('Time');
          }
        });
      });
    })
  });
});

fetchCoordinates.then(function(result){
  console.log(result[result.length-1]);
}, function(){
});
