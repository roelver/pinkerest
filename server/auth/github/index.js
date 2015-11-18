'use strict';

var express = require('express');
var router = express.Router();
var qs = require('querystring');
var logger = require('morgan');
var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var moment = require('moment');
var request = require('request');
var async = require("async");
var User = require('../../api/user/user.model');

var config = require('./config');
var tokencfg = require('../config');

router.post('/', function(req, res) {
  var accessTokenUrl = 'https://github.com/login/oauth/access_token';
  var userApiUrl = 'https://api.github.com/user';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.GITHUB_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params }, function(err, response, accessToken) {
    accessToken = qs.parse(accessToken);
    var headers = { 'User-Agent': 'Satellizer' };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, function(err, response, profile) {

      // Step 3a. Link user accounts.
      if (req.headers.authorization) {
        User.findOne({ username: profile.login , provider: "github"}, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a GitHub account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, tokencfg.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
	          user.save(function() {
	            var token = createJWT(user);
   	         res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ username: profile.login, provider: "github" }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({ token: token });
          }
            var newUser = new User();
            newUser.username = profile.login;
            newUser.name = profile.name;
            newUser.email = profile.email;
            newUser.provider = 'github';
            newUser.role = 'user';
            newUser.save(function(err, user) {
              var token = createJWT(user);
              res.send({ token: token });
            });
        });
      }
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