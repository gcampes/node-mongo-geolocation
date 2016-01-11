var mongoose = require('mongoose');
var geolib = require('geolib');

var db = mongoose.connect('mongodb://127.0.0.1:27017/geolocation');

mongoose.connection.once('connected', function() {
	console.log("Database connected successfully")
});

var Coord = require('./mongo/coord');

var Promise = require('promise');

var fetchInRange = new Promise(function (resolve, reject) {
	console.time('stopwatch');
	var distance = 100 / 6371
	var coords = [];
	var count = 0;
	var output = [];
	Coord.find().exec(function(err, coordinates){
	  console.log('City.length: ' + coordinates.length);
		startTime = new Date().getTime();
		console.timeEnd('stopwatch');
	  coordinates.forEach(function(coordinate, key){
	      coords[0] = coordinate.geo[0];
	      coords[1] = coordinate.geo[1];

	      Coord.find({
	        geo: {
	          $nearSphere: coords,
	          $maxDistance: distance
	        }
	      }).exec(function(err, locations) {
	        if (err) {
	          console.log(err);
	        }

					var tempCoord = {
						id: coordinate._id,
						name: coordinate.name,
						type: coordinate.type,
						geo: coordinate.geo,
						nearCoords: []
					};
					locations.forEach(function(nearCoord){
						if(nearCoord._id.toString() != tempCoord.id.toString()){
							tempCoord.nearCoords.push({
								id: nearCoord._id,
								name: nearCoord.name,
								type: nearCoord.type,
								geo: nearCoord.geo
							});
						}
					});
					// console.log(tempCoord);
	        // console.log('Current Location:' + coordinate.name);
	        count++;
					output.push(tempCoord);
					if(coordinates.length === count){
						// console.log(output.length);
						resolve(output);
					}
	      });
	  })
	});
});

fetchInRange.then(function(coordinates){
	console.timeEnd('stopwatch');
	var calculateChildrenDistance = new Promise(function (resolve, reject) {
		coordinates.forEach(function(coordinate, parentKey){

			coordinate.nearCoords.forEach(function(childCoord, childKey){
				childCoord.distance = geolib.getDistance(coordinate.geo, childCoord.geo);
				console.log(coordinate);
				if((parentKey + 1) == coordinates.length && coordinate.nearCoords.length == (childKey + 1)){
					console.log('done with this');
					resolve();
				}
			});
		});
	});

	calculateChildrenDistance.then(function(){
		console.log('RESOLVE - calculateChildrenDistance');
		console.timeEnd('stopwatch');
	}, function(){
		console.log('FAIL - calculateChildrenDistance');
	});
	console.log('RESOLVE - fetchInRange');
}, function(){
	console.log('FAIL - fetchInRange');
})
