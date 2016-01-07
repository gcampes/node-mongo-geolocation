var City = require('./mongo/coord');
var fs = require('fs');
var coordObj = JSON.parse(fs.readFileSync('coords.json', 'utf8'));
var geolibCoords = []
coordObj.forEach(function(item, key){
  if(item.lat && item.lon && item.continent == "NA"){
    geolibCoords.push({latitude: item.lat, longitude:item.lon});
  }
})

var cityModel = null;
geolibCoords.forEach(function(coord, key){

  cityModel = new City();
  cityModel.name = key;
  cityModel.geo = [ coord.latitude, coord.longitude ];

  cityModel.save(function (err, res) {
    if (err){
      console.log(err);
      console.log(coord);
    }
  });
});

City.find(function (err, cities) {
  if (err) return console.error(err);
  console.log(cities);
})
console.log('done');
//
// var distance = 1000 / 6371;
//
// var query = City.findOne({'geo': {
//   $near: [
//     req.body.lat,
//     req.body.lng
//   ],
//   $maxDistance: distance
//
//   }
// });
//
// query.exec(function (err, city) {
//   if (err) {
//     console.log(err);
//     throw err;
//   }
//
//   if (!city) {
//     res.json({});
//   } else {
//     console.log('Cant save: Found city:' + city);
//     res.json(city);
//  }
//
// });
