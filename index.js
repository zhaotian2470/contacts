/**
 * contacts
 */

"use strict";


const express = require('express'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      expressSession = require('express-session'),
      passport = require('passport'),
      flash = require('connect-flash'),
      morgan = require('morgan'),
      serveIndex = require('serve-index'),
      mongoose = require('mongoose'),
      util = require('util'),
      commonUtil = require('./lib/commonUtil'),
      httpUtil = require('./lib/httpUtil'),
      usersRoutes = require('./users/server/routes'),
      usersClient = require('./users/client/routes'),
      userDirectoryRoutes = require('./userDirectory/server/routes'),
      userDirectoryClient = require('./userDirectory/client/routes');


// setup app
var app = express();
exports.app = app;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressSession({ secret: 'tian', resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(httpUtil.allowOrgin);
if(process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(httpUtil.logHttp);

app.get('/', function(req, res) {
  res.send("welcom to contacts!");
});

const publicRoot = commonUtil.config.get("publicRoot");
app.use('/' + publicRoot, express.static(publicRoot));
app.use('/' + publicRoot, serveIndex(publicRoot, {"icons": true, "view": "details"}));

app.use("/users/api", usersRoutes);
app.use("/users/view", usersClient);

app.use("/userDirectory", function(req, res, next) {
  if(!req.user) {
    return res.redirect('/users/view/index.html');
  }
  next();
});
app.use("/userDirectory/api", userDirectoryRoutes);
app.use("/userDirectory/view", userDirectoryClient);

// connect mangodb and listen http port
const mangoUrl = util.format("mongodb://%s/%s",
			     commonUtil.config.get("dbConfig.host"),
			     commonUtil.config.get("dbConfig.dbName"));
var listenPort = commonUtil.config.get("listenPort");
var logger = commonUtil.logger;

mongoose.connect(mangoUrl, function(mongoError) {
  if(mongoError) {
    logger.error("failed to connect to %s: %j", mangoUrl, mongoError);
    return;
  }

  app.listen(listenPort, function(listenError) {
    logger.info('app is listening on port %s!', listenPort);
  });
});
