var mongoose = require('mongoose');

var travelSchema = new mongoose.Schema({
  destination: String,
  date: String,
  author: String,
  description: String,
  published_year: Number,
  publisher: String,
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Book', travelSchema);
