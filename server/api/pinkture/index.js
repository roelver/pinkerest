'use strict';

var express = require('express');
var controller = require('./pinkture.controller');

var router = express.Router();

router.get('/img/:img', controller.download);
router.get('/', controller.index);
router.post('/store', controller.storeImg);
router.post('/', controller.create);
router.delete('/:id', controller.destroy);
router.delete('/', controller.removeImg);

module.exports = router;