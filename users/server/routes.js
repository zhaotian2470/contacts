"use strict";


const express = require('express'),
      controller = require('./controller');


var router = express.Router();
module.exports = router;

router.post('/login', controller.login);
router.post('/register', controller.createUser);
