var fs = require('fs');
var mongoose = require('mongoose');

//This code requires mongoose node module
var mongoose = require('mongoose');

//connecting local mongodb database named test
var db = mongoose.connect('mongodb://127.0.0.1:27017/geolocation');

//testing connectivity
mongoose.connection.once('connected', function() {
	console.log("Database connected successfully")
});

var Coord = require('./mongo/coord');

var coordObj = JSON.parse(fs.readFileSync('coords.json', 'utf8'));
var geolibCoords = [];
coordObj.forEach(function(item, key){
  if(item.lat && item.lon){
    geolibCoords.push({longitude:item.lon, latitude: item.lat, name: item.name, type: item.type});
  }
});

var coordModel = null;

console.log(geolibCoords.length);

Coord.remove({}, function(){
    geolibCoords.forEach(function(coord, key){
      coordModel = new Coord();
      coordModel.name = coord.name;
      coordModel.type = coord.type;
      coordModel.geo = [ coord.longitude, coord.latitude ];

      coordModel.save(function (err, coordinate) {
        if (err){
          console.log(err);
        }
        else{
          console.log('saved');
          console.log(coordinate);
          console.log(geolibCoords.length);
        }
      });
    });
})
