'use strict';

var _ = require('lodash');
var Pinkture = require('./pinkture.model');

// Get list of Pinktures
exports.index = function(req, res) {
  Pinkture.find(function (err, pinktures) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(pinktures);
  });
};

// Get a single Pinkture
exports.show = function(req, res) {
  Pinkture.findById(req.params.id, function (err, pinkture) {
    if(err) { return handleError(res, err); }
    if(!pinkture) { return res.status(404).send('Not Found'); }
    return res.json(pinkture);
  });
};

// Creates a new Pinkture in the DB.
exports.create = function(req, res) {
  Pinkture.create(req.body, function(err, pinkture) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(pinkture);
  });
};

// Updates an existing Pinkture in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Pinkture.findById(req.params.id, function (err, pinkture) {
    if (err) { return handleError(res, err); }
    if(!pinkture) { return res.status(404).send('Not Found'); }
    var updated = _.merge(pinkture, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(pinkture);
    });
  });
};

// Deletes a Pinkture from the DB.
exports.destroy = function(req, res) {
  Pinkture.findById(req.params.id, function (err, pinkture) {
    if(err) { return handleError(res, err); }
    if(!pinkture) { return res.status(404).send('Not Found'); }
    Pinkture.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}