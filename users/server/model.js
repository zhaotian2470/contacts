'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UsersSchema = new Schema({
  username: {
    type: String,
    required: 'Please fill user name',
    trim: true
  },
  password: {
    type: String,
    required: 'Please fill user password (md5)',
    trim: true
  },
  email: {
    type: String,
    validate: /^.*@.*$/,
    required: 'Please fill user email',
    trim: true
  }
});

exports.Users = mongoose.model('Users', UsersSchema);
