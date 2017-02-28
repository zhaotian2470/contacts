"use strict";


const express = require('express'),
      controller = require('./controller');


var router = express.Router();
module.exports = router;

router.post('/login', controller.login);
router.get('/logout', controller.logout);
router.post('/register', controller.createUser);
router.get('/profile', controller.getProfile);
router.post('/profile', controller.saveProfile);

