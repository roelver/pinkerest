'use strict';

var _ = require('lodash');
var  fs = require("fs");
var http = require("http");
var url = require('url');

var publicDir =  __dirname + '/../../public';

var Pinkture = require('./pinkture.model');

exports.download = function (req, res) {
  if (req.params.img) {
      var start = req.params.img.lastIndexOf('.');
      var ext = req.params.img.substring(start).toLowerCase();

      var data = fs.readFileSync(publicDir+'/'+req.params.img);

      if (!data) {
        res.status(404);
      }
      else {
        var ctype  = 'image/'+ext;
        if (ext === 'jpg') {
          ctype = 'image/jpeg';
        }
        res.writeHead(200, {'Content-Type': ctype });
        res.end(data);
      }
  }
  else {
    res.status(500).send(req.params.img + ' is not a valid name');
  }
};


/*
 *  This method just stores an image on the filesystem to avoid CORS issues 
 */
exports.storeImg = function (req, res) {

  var imgUrl = req.body.myurl;
  var lastSlash = imgUrl.lastIndexOf('/');
  var filenm = imgUrl;
  if (lastSlash >= 0) {
    filenm = imgUrl.substring(lastSlash+1);
    var ext = filenm.substring(filenm.length - 3).toLowerCase();
    if (ext !== 'jpg' && ext !== 'png' && ext !== 'gif') {  
       filenm = 'tmpimg.jpg';  
    }
  }
  try {
    fs.unlinkSync(publicDir+'/'+filenm);
  }
  catch(err) {
    console.log('Catch', err.message);
  }
  var urldata = url.parse(imgUrl);
  var opts = { host: urldata.host,
      port: urldata.port || 80,
      path: urldata.path,
      protocol: 'http:',
      headers: {
          'User-Agent': 'Mozilla/5.0'
         } 
      };

  var f=fs.createWriteStream(publicDir+'/'+filenm);

  http.get(opts,function(resp){
      resp.on('data', function (chunk) {
          f.write(chunk);
      });
      resp.on('error', function (chunk) {
          f.end();
          res.status(404);
      });
      resp.on('end',function(){
          f.end();
          res.status(200).send(filenm);
          res.end();
      });
  });
};


exports.removeImg = function (req, res) {

  var filename = req.query.filename;
  if (filename) {

      try {
        fs.unlinkSync(publicDir+'/'+filename);
      }
      catch(err) {
      }
  }
  res.status(200).end();
};


// Get list of Pinktures
exports.index = function(req, res) {
  Pinkture.find(function (err, pinktures) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(pinktures);
  });
};

// Creates a new Pinkture in the DB.
exports.create = function(req, res) {
  Pinkture.create(req.body, function(err, pinkture) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(pinkture);
  });
};

// Deletes a Pinkture from the DB.
exports.destroy = function(req, res) {
    Pinkture.remove({"_id": req.params.id}, function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
}