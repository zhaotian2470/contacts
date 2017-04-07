/**
 * contacts server
 */
"use strict";


const express = require('express'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      expressSession = require('express-session'),
      mongoStore = require('connect-mongo')(expressSession),
      passport = require('passport'),
      flash = require('connect-flash'),
      morgan = require('morgan'),
      serveIndex = require('serve-index'),
      mongoose = require('mongoose'),
      util = require('util'),
      globals = require('./globals'),
      httpUtil = require('./httpUtil'),
      serverRoutes = require('./routes');

const mongoUrl = util.format("mongodb://%s/%s",
			     globals.config.get("dbConfig.host"),
			     globals.config.get("dbConfig.dbName"));

// setup app
var app = express();
exports.app = app;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressSession({secret: 'tian', resave: true, saveUninitialized: false, store: new mongoStore({url: mongoUrl})}));
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

const viewRoot = globals.config.get("viewRoot");
app.use('/view', express.static(viewRoot));
app.use('/view', serveIndex(viewRoot, {"icons": true, "view": "details"}));
app.use("/api", serverRoutes);

// connect mongodb and listen http port
var listenPort = globals.config.get("listenPort");
var logger = globals.logger;

mongoose.connect(mongoUrl, function(mongoError) {
  if(mongoError) {
    logger.error("failed to connect to %s: %j", mongoUrl, mongoError);
    return;
  }

  app.listen(listenPort, function(listenError) {
    logger.info('app is listening on port %s!', listenPort);
  });
});
