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
  async function(username, password, done) {
    try {
      const user = await Users.findOne({username: username});
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await Users.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
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

  req.logout(function(err) {
    if (err) {
      return httpUtil.sendErrorRes(res, 400, err.toString());
    }
    return httpUtil.sendJsonRes(res, 200, "success", "logout");
  });

};

/**
 * Create user
 */
module.exports.createUser = async function(req, res) {
  try {
    const users = new Users(req.body);
    await users.save();
    return httpUtil.sendJsonRes(res, 200, "success", users);
  } catch (error) {
    return httpUtil.sendErrorRes(res, 400, error.toString());
  }
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
module.exports.saveProfile = async function(req, res, next) {
  try {
    await Users.updateOne({"_id": req.body._id}, req.body, {"runValidators": true});
    return httpUtil.sendJsonRes(res, 200, "success", req.body);
  } catch (error) {
    return httpUtil.sendErrorRes(res, 400, error.toString());
  }
};

/**
 * check user log in
 */
module.exports.checkUserLogin = function(req, res, next) {
  if(!req.user) {
    return httpUtil.sendErrorRes(res, 403, "Please login");
  }
  next();
}

/**
 * Create user directory
 */
module.exports.createUserDirectory = async function(req, res) {
  try {
    var record = _.cloneDeep(req.body);
    _.assign(record, {"ownerId": req.user._id});
    const userDirectory = new UserDirectory(record);
    await userDirectory.save();
    httpUtil.sendJsonRes(res, 200, "success", userDirectory);
  } catch (error) {
    httpUtil.sendErrorRes(res, 400, error.toString());
  }
};

/**
 * Read all user directory
 */
module.exports.readAllUserDirectory = async function(req, res) {
  try {
    const items = await UserDirectory.find({"ownerId": req.user._id}, "_id name birthday birthdayType");
    httpUtil.sendJsonRes(res, 200, "success", items);
  } catch (error) {
    httpUtil.sendErrorRes(res, 400, error.toString());
  }
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
module.exports.updateUserDirectory = async function(req, res) {
  try {
    _.assignIn(req.userDirectory, req.body);
    await req.userDirectory.save();
    httpUtil.sendJsonRes(res, 200, "success", req.userDirectory);
  } catch (error) {
    httpUtil.sendErrorRes(res, 400, error.toString());
  }
};

/**
 * Delete user directory
 */
module.exports.deleteUserDirectory = async function(req, res) {
  try {
    const userDirectory = req.userDirectory;
    await userDirectory.deleteOne();
    httpUtil.sendJsonRes(res, 200, "success", userDirectory);
  } catch (error) {
    httpUtil.sendErrorRes(res, 400, error.toString());
  }
};

/**
 * pending birthday remainder to db, another program will send birthday remainder
 */
module.exports.sendBirthdayRemainder = async function(req, res) {
  try {
    const operationQueue = new OperationQueue({"name": "birthdayRemainder", "parameters": [req.user._id.toString()]});
    await operationQueue.save();
    httpUtil.sendJsonRes(res, 200, "success", operationQueue);
  } catch (error) {
    httpUtil.sendErrorRes(res, 400, error.toString());
  }
};

/**
 * user directory middleware: get user directory by id
 */
module.exports.userDirectoryByID = async function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return httpUtil.sendErrorRes(res, 400, "user directory's id is invalid");
  }

  try {
    const userDirectory = await UserDirectory.findById(id);
    if (!userDirectory) {
      return httpUtil.sendErrorRes(res, 404, util.format("No user directory with id: %s", id));
    }
    if (userDirectory.ownerId.toString() !== req.user._id.toString()) {
      return httpUtil.sendErrorRes(res, 404, util.format("No user directory with id %s and owner id %s", id, req.user._id));
    }
    req.userDirectory = userDirectory;
    next();
  } catch (error) {
    return httpUtil.sendErrorRes(res, 400, util.format("find user directory by id (%s) error: %s", id, error));
  }
};
