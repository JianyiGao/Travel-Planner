var request = require('request');
var config = require('../config/config');

exports.getCoordinates = function(req, callback){
  if(req.body.address){
    let options = {
      key: config.googleMaps.key,
      address: req.body.address
    };
    request({
      url: 'https://maps.googleapis.com/maps/api/geocode/json',
      qs: options
      }, function(error, response, body) {
        if(error) {
          console.log("Error on request");
          callback(error, null);
        }
        let data = JSON.parse(body);
        if(!data.results) return "Error";
        callback(null, data.results[0].geometry.location);
    });
  }
};

exports.getDirections = function(req, callback){
  if(req.origin && req.destination){
    let options = {
      key: config.googleMaps.key,
      origin: req.origin,
      destination: req.destination
    };
    request({
      url: 'https://maps.googleapis.com/maps/api/directions/json',
      qs: options
    }, function(error, response, body) {
      if(error) {
        console.log("Error on request");
        callback(error, null);
      }
      let data = JSON.parse(body);
      if(!data.routes) return "Error";
      callback(null, data.routes[0].legs[0]);
    });
  }
};
