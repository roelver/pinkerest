'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PinktureSchema = new Schema({
  title: String,
  imgUrl: String,
  pinkScore: Number,
  likes: Number,
  existing: Boolean,
  owner: {
  	   type: mongoose.Schema.Types.ObjectId,
  		ref: 'User'
  }
});

module.exports = mongoose.model('Pinkture', PinktureSchema);