var Coord = require('./mongo/coord');
var Geolib = require('geolib');
var Mongoose = require('mongoose');
var Promise = require('promise');

var db = Mongoose.connect('mongodb://127.0.0.1:27017/geolocation');
Mongoose.connection.once('connected', function() {
	console.log("Database connected successfully")
});

var compare = function(a,b) {
  if (a.distance < b.distance)
    return -1;
  else if (a.distance > b.distance)
    return 1;
  else
    return 0;
}

var lng = process.argv[2];
var lat = process.argv[3];
var distance = process.argv[4] / 6371 || 2 / 6371;
var coordinates = [lng, lat];
var result = [];

var fetchCoordinates = new Promise(function(resolve, reject){
  console.time('Time');
  Coord.find({
    geo: {
      $nearSphere: coordinates,
      $maxDistance: distance
    }
  }).exec(function(err, coords){
    coords.forEach(function(coord, coordsKey){
      result[coordsKey] = {
        id: coord._id,
        name: coord.name,
        type: coord.type,
        geo: coord.geo,
        distance: Geolib.getDistance(coordinates, coord.geo)
      };

      if((coordsKey + 1) == coords.length){
        resolve(result);
      }
    });
  });
});

fetchCoordinates.then(function(result){

  console.log(result.sort(compare));
  console.log('Center:', coordinates);
  console.log('Search range', process.argv[4], 'km');

  console.log('Result count:', result.length);
  console.timeEnd('Time');
}, function(){
  console.log('Error');
});
