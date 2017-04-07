"use strict";


const util = require('util'),
      _ = require('lodash'),
      passport = require('passport'),
      localStrategy = require('passport-local').Strategy,
      mongoose = require('mongoose'),
      dbModel = require('./model'),
      httpUtil = require('./httpUtil');


var Users = mongoose.model("Users");
var UserDirectory = mongoose.model("UserDirectory");
var OperationQueue = mongoose.model("OperationQueue");


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

module.exports.passport = passport;

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
  return httpUtil.sendJsonRes(res, 200, "success", "logout");

};

/**
 * Create user
 */
module.exports.createUser = function(req, res) {
  var users = new Users(req.body);
  users.save(function(error) {
    if (error) {
      return httpUtil.sendErrorRes(res, 400, error.toString());
    }
    else {
      return httpUtil.sendJsonRes(res, 200, "success", users);
    }
  });
};

/**
 * get profile
 */
module.exports.getProfile = function(req, res, next) {

  if(!req.user) {
    return httpUtil.sendErrorRes(res, 400, 'Please login first');
  }
  else {
    return httpUtil.sendJsonRes(res, 200, "success", req.user);
  }
};

/**
 * save profile
 */
module.exports.saveProfile = function(req, res, next) {

  Users.update({"_id": req.body._id}, req.body, {"runValidators": true}, function(error, numAffected) {
    if (error) {
      return httpUtil.sendErrorRes(res, 400, error.toString());
    }
    else {
      return httpUtil.sendJsonRes(res, 200, "success", req.body);
    }
  });
};

/**
 * Create user directory
 */
module.exports.createUserDirectory = function(req, res) {
  var record = _.cloneDeep(req.body);
  _.assign(record, {"ownerId": req.user._id});
  var userDirectory = new UserDirectory(record);
  userDirectory.save(function(error) {
    if (error) {
      httpUtil.sendErrorRes(res, 400, error.toString());
    } else {
      httpUtil.sendJsonRes(res, 200, "success", userDirectory);
    }
  });
};

/**
 * Read all user directory
 */
module.exports.readAllUserDirectory = function(req, res) {
  UserDirectory.find({"ownerId": req.user._id}, "_id name birthday birthdayType", function(error, items) {
    if (error) {
      httpUtil.sendErrorRes(res, 400, error.toString());
    } else {
      httpUtil.sendJsonRes(res, 200, "success", items);
    }
  });
};

/**
 * Read user directory by id
 */
module.exports.readUserDirectoryById = function(req, res) {
  httpUtil.sendJsonRes(res, 200, "success", req.userDirectory);
};

/**
 * Update user directory
 */
module.exports.updateUserDirectory = function(req, res) {
  _.assignIn(req.userDirectory, req.body);
  req.userDirectory.save(function(error) {
    if (error) {
      httpUtil.sendErrorRes(res, 400, error.toString());
    } else {
      httpUtil.sendJsonRes(res, 200, "success", req.userDirectory);
    }
  });
};

/**
 * Delete user directory
 */
module.exports.deleteUserDirectory = function(req, res) {
  var userDirectory = req.userDirectory;
  userDirectory.remove(function(error) {
    if (error) {
      httpUtil.sendErrorRes(res, 400, error.toString());
    } else {
      httpUtil.sendJsonRes(res, 200, "success", userDirectory);
    }
  });
};

/**
 * pending birthday remainder to db, another program will send birthday remainder
 */
module.exports.sendBirthdayRemainder = function(req, res) {
  var operationQueue = new OperationQueue({"name": "birthdayRemainder", "parameters": [req.user._id.toString()]});
  operationQueue.save(function(error) {
    if (error) {
      httpUtil.sendErrorRes(res, 400, error.toString());
    } else {
      httpUtil.sendJsonRes(res, 200, "success", operationQueue);
    }
  });
};

/**
 * user directory middleware: get user directory by id
 */
module.exports.userDirectoryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return httpUtil.sendErrorRes(res, 400, "user directory's id is invalid");
  }

  UserDirectory.findById(id).exec(function (error, userDirectory) {
    if (error) {
      return httpUtil.sendErrorRes(res, 400, util.format("find user directory by id (%s) error: %s", id, error));
    } else if (!userDirectory) {
      return httpUtil.sendErrorRes(res, 404, util.format("No user directory with id: %s", id));
    } else if(userDirectory.ownerId.toString() !== req.user._id.toString()) {
      return httpUtil.sendErrorRes(res, 404, util.format("No user directory with id %s and owner id %s", id, req.user._id));
    }
    req.userDirectory = userDirectory;
    next();
  });
};
