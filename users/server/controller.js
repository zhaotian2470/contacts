"use strict";


const passport = require('passport'),
      localStrategy = require('passport-local').Strategy,
      mongoose = require('mongoose'),
      dbModel = require('./model'),
      httpUtil = require('../../lib/httpUtil');


var Users = mongoose.model("Users");

module.exports.passport = passport;

// set passport
passport.use(new localStrategy(
  function(username, password, done) {
    Users.findOne({username: username}, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  Users.findById(id, function(error, user) {
    done(error, user);
  });
});

/**
 * login
 */
module.exports.login = function(req, res, next) {
  
  passport.authenticate('local', function(error, user, info) {

    if (error) {
      return httpUtil.sendErrorRes(res, 400, error.toString());
    }

    if (!user) {
      return httpUtil.sendErrorRes(res, 400, info.message.toString());
    }

    req.login(user, function(error) {
      if (error) {
        return httpUtil.sendErrorRes(res, 400, error.toString());
      }
      return httpUtil.sendJsonRes(res, 200, "success", user);
    });
  })(req, res, next);

};

/**
 * logout
 */
module.exports.logout = function(req, res, next) {

  req.logout();
  res.redirect('/users/view/index.html');

};

/**
 * Create user
 */
module.exports.createUser = function(req, res) {
  var users = new Users(req.body);
  users.save(function(error) {
    if (error) {
      return httpUtil.sendErrorRes(res, 400, error.toString());
    } else {
      return httpUtil.sendJsonRes(res, 200, "success", users);
    }
  });
};
