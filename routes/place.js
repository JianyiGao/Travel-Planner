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
  var dests = req.body.destinations;
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
  bestRoute.fill(dests.length);
  var usedDests = new Array(dests.length);
  doSleep(function(){
    let k = 0;
    for(let i=0; i<dests.length; i++){
      let minVar = Number.MAX_SAFE_INTEGER;
      store.forEach(function(value, key){
        let destPair = key.split("~");
        if(dests[k] === destPair[0]){
          if(value.distance.intVal < minVar){
            let index = dests.indexOf(destPair[1]);
            if(!usedDests[index]){
              minVar = value.distance.intVal;
              if(bestRoute[k]<dests.length)
                usedDests[bestRoute[k]] = false;
              bestRoute[k] = index;
              usedDests[index] = true;
            }
          }
        } else if(dests[k] === destPair[1]){
          if(value.distance.intVal < minVar){
            let index = dests.indexOf(destPair[0]);
            if(!usedDests[index]){
              minVar = value.distance.intVal;
              if(bestRoute[k]<dests.length)
                usedDests[bestRoute[k]] = false;
              bestRoute[k] = index;
              usedDests[index] = true;
            }
          }
        }
      });
      k = bestRoute[k];
    }
    let obj = {};
    let nextDest = dests[0];
    for(let i=0; i<dests.length; i++){
      let key = dests[i]+'~'+dests[bestRoute[i]];
      if(store.get(key))
        obj[key] = store.get(key);
      else {
        let alternateKey = dests[bestRoute[i]]+'~'+dests[i];
        obj[key] = store.get(alternateKey);
      }
    }
    res.json(obj);
  }, 600 * time);
});

function doSleep(callback, ms) {
  setTimeout(callback, ms);
}

module.exports = router;
