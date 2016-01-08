//This code requires mongoose node module
var mongoose = require('mongoose');

//connecting local mongodb database named test
var db = mongoose.connect('mongodb://127.0.0.1:27017/geolocation');

//testing connectivity
mongoose.connection.once('connected', function() {
	console.log("Database connected successfully")
});
