var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var googleapi = require('../controller/googleapi');
// var Book = require('../models/Book.js');

router.post('/getCoordinates', function(req, res) {
  googleapi.getCoordinates(req, function(err, result){
    if(err)
      res.send(err);
    res.json(result);
  });
});

module.exports = router;
