var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var googleapi = require('../controller/googleapi');
// var Book = require('../models/Book.js');

router.post('/getCoordinates', function(req, res) {
  googleapi.getCoordinates(req, function(err, result){
    if(err)
      res.send(err);
    res.json(result);
  });
});

router.post('/getDirections', function(req, res){
  googleapi.getDirections(req.body, function(err, result){
    if(err)
      res.send(err);
    res.json(result);
  });
});

router.post('/planTrip', function(req, res){
  let dests = req.body.destinations;
  var store = new Map();
  for(let i=0; i < dests.length-1; i++){
    let minRoute = Number.MAX_SAFE_INTEGER;
    for(let j=i+1; j < dests.length; j++){
      let request = {
        origin: dests[i],
        destination: dests[j]
      };
      googleapi.getDirections(request, function(err, result){
        if(result){
          result.distance.intVal = result.distance.text.split(" ")[0];
          let time = result.duration.text.split(" ");
          result.duration.hour = time[0];
          result.duration.minute = time[2];
          store.set(dests[i]+'~'+dests[j], result);
        }
      });
    }
  }
  let time = dests.length-1;
  for(let i=time-1; i>0; i--){
    time += i;
  }
  var bestRoute = new Array(dests.length);
  doSleep(function(){
    console.log(bestRoute);
    let obj = {};
    store.forEach(function(value, key){
      obj[key] = value;
    });
    res.json(obj);
  }, 500 * time);
});

function doSleep(callback, ms) {
  setTimeout(callback, ms);
}

module.exports = router;
