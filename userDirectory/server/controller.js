'use strict';


const util = require('util'),
      _ = require('lodash'),
      mongoose = require('mongoose'),
      dbModel = require('./model'),
      httpUtil = require('../../lib/httpUtil');


var UserDirectory = mongoose.model("UserDirectory");

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
