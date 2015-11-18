'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var User = require('../api/user/user.model');
var tokencfg = require('./config');

router.use('/local', require('./local'));
router.use('/github', require('./github'));
router.use('/twitter', require('./twitter'));

/*
 |--------------------------------------------------------------------------
 | GET /auth/me
 |--------------------------------------------------------------------------
 */
router.get('/me', ensureAuthenticated, function(req, res) {
	var query = User.findById(req.user);
//	query.select('_id name username provider email role');
	query.exec(function (err, user) {
   	if (err) {res.send(err)}
      res.send(user);
     });
  });

router.post('/unlink', ensureAuthenticated, function(req, res) {

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User Not Found' });
    }
    user.save(function() {
      res.status(200).end();
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.headers.authorization.split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, tokencfg.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
}


module.exports = router;