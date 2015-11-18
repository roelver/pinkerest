'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var moment = require('moment');

var tokencfg = require('../config');

var User = require('../../api/user/user.model');

router.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Wrong email and/or password' });
    }
    if (user.authenticate(req.body.password)) {
      res.send({ token: createJWT(user) });
    }
    else {
      return res.status(401).send({ message: 'Wrong email and/or password' });
    }
  });
});

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
router.post('/signup', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken' });
    }
    var user = new User({
      displayName: req.body.displayName,
      email: req.body.email,
      provider: 'local',
      password: req.body.password
    });
    user.save(function() {
      res.send({ token: createJWT(user) });
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, tokencfg.TOKEN_SECRET);
}



module.exports = router;