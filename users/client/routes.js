"use strict";


const path = require('path'),
      express = require('express'),
      serveStatic = require('serve-static');

var router = express.Router();
module.exports = router;


router.use(serveStatic(path.join(__dirname, "view")));
