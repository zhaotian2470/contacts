"use strict";


const config = require('config'),
      bunyan = require('bunyan');


module.exports.config = config;
module.exports.logger = bunyan.createLogger({name: config.get("mainLogName"),
					     'level': config.get("mainLogLevel"),
					     'src': config.get("mainLogSrc")});

