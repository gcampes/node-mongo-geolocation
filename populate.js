var fs = require('fs');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://127.0.0.1:27017/geolocation');
var Coord = require('./mongo/coord');
var Converter = require("csvtojson").Converter;

console.time('Time');
mongoose.connection.once('connected', function() {
	console.log("Database connected successfully")
});


var converter = new Converter({});
converter.fromFile("./ecs_rs.csv",function(err,result){
	var geolibCoords = [];
	result.forEach(function(item, key){
	  if(item.NR_LONGITUDE != '(null)' && item.NR_LATITUDE != '(null)'){
	    geolibCoords.push({longitude:item.NR_LONGITUDE, latitude: item.NR_LATITUDE, name: item.DS_CIDADE, type: item.type});
	  }
	});

	var coordCollection = [];
	Coord.remove({}, function(){
	    geolibCoords.forEach(function(coord, key){
	      coordCollection[key] = {};
	      coordCollection[key].name = coord.name;
	      coordCollection[key].type = '123';
	      coordCollection[key].geo = [ coord.longitude, coord.latitude ];
	    });

			Coord.collection.insert(coordCollection, function(err, docs){
				if(err){
					console.log(err);
				}
				else{
					console.log('Success');
					console.timeEnd('Time');
				}
			})
	})
});
