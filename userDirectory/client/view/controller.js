"use strict";

angular.module('userDirectory', [])
  .controller('MainCtrl', ['userDirectoryService', function(userDirectoryService) {

    var self = this;

    self.status = "normal";
    self.url = "editUserDirectory.html";
    self.userDirectories = [];
    self.addItem = {};
    self.editItem = {};

    self.showAddUserDirectory = function() {
      self.addItem.name = "";
      self.addItem.birthday = new Date();
      self.addItem.birthdayType = "阳历";
      self.status='add';
    };

    self.addUserDirectory = function() {
      self.addItem.birthday = new Date(Date.UTC(self.addItem.birthday.getFullYear(),
                                                self.addItem.birthday.getMonth(),
                                                self.addItem.birthday.getDate(), 0, 0, 0, 0));
      userDirectoryService.addUserDirectory(self.addItem)
        .then(function(result) {
          self.status = "normal";
          self.getAllUserDirectory();
          console.log("success to add user directory");
        })
        .catch(function(error) {
          console.error("error to add user directory");
        });
    };

    self.cancelAddUserDirectory = function() {
      self.status = "normal";
      self.getAllUserDirectory();
      console.log("success to cancel user directory");
    };

    self.getAllUserDirectory = function() {
      userDirectoryService.getAllUserDirectory()
        .then(function(result) {
          console.log("success to get all user directory");
          self.userDirectories = result;
        })
        .catch(function(error) {
          console.error("error to get all user directory");
          self.userDirectories = [];
        });
    };

    self.showEditUserDirectory = function(param) {
      self.editItem=_.cloneDeep(param);
      self.editItem.birthday = new Date(self.editItem.birthday.getUTCFullYear(),
                                        self.editItem.birthday.getUTCMonth(),
                                        self.editItem.birthday.getUTCDate(), 0, 0, 0, 0);
      self.status='edit';
    };

    self.editUserDirectory = function() {
      self.editItem.birthday = new Date(Date.UTC(self.editItem.birthday.getFullYear(),
                                                 self.editItem.birthday.getMonth(),
                                                 self.editItem.birthday.getDate(), 0, 0, 0, 0));
      userDirectoryService.editUserDirectory(self.editItem)
        .then(function(result) {
          self.status = "normal";
          self.getAllUserDirectory();
          console.log("success to edit user directory");
        })
        .catch(function(error) {
          console.error("error to edit user directory");
        });
    };

    self.cancelEditUserDirectory = function() {
      self.status = "normal";
      self.getAllUserDirectory();
      console.log("success to cancel user directory");
    };

    self.deleteUserDirectory = function(param) {
      userDirectoryService.deleteUserDirectory(param._id)
        .then(function(result) {
          self.getAllUserDirectory();
          console.log("success to delete user directory");
        })
        .catch(function(error) {
          console.error("error to delete user directory");
        });
    };

    self.sendBirthdayRemainder = function() {
      userDirectoryService.sendBirthdayRemainder()
        .then(function(result) {
          self.getAllUserDirectory();
          console.log("success to send birthday remainder");
        })
        .catch(function(error) {
          console.error("error to send birthday remainder");
        });
    };

    self.getAllUserDirectory();

  }])
  .factory('userDirectoryService', ['$http', '$q', function($http, $q) {
    return {

      addUserDirectory: function(param) {
        var url = "/userDirectory/api";
        return $http.post(url, param)
          .then(function(response) {
            console.log("get response from post %s: %j", url, param);
            console.log(response);
            if(response.data.code === 200) {
              return response.data.res;
            }
            else {
              var errorInfo = "status error when add user directory";
              console.error(errorInfo);
              return $q.reject(errorInfo);
            }
          })
          .catch(function(error) {
            var errorInfo = "http error when add user directory";
            console.error(errorInfo);
            return $q.reject(errorInfo);
          });
      },

      getAllUserDirectory: function() {
        var url = "/userDirectory/api";
        return $http.get(url)
          .then(function(response) {
            console.log("get response from get %s", url);
            console.log(response);
            if(response.data.code === 200) {
              var res = [];
              _.forEach(response.data.res, function(value) {
                var tmp = _.cloneDeep(value);
                tmp.birthday = new Date(tmp.birthday);
                res.push(tmp);
              });
              return res;
            }
            else {
              var errorInfo = "status error when get all user directory";
              console.error(errorInfo);
              return $q.reject(errorInfo);
            }
          })
          .catch(function(error) {
            var errorInfo = "http error when get all user directory";
            console.error(errorInfo);
            return $q.reject(errorInfo);
          });
      },

      editUserDirectory: function(param) {
        var url = "/userDirectory/api/id/" + param._id;
        return $http.put(url, param)
          .then(function(response) {
            console.log("get response from put %s: %j", url, param);
            console.log(response);
            if(response.data.code === 200) {
              return response.data.res;
            }
            else {
              var errorInfo = "status error when edit user directory";
              console.error(errorInfo);
              return $q.reject(errorInfo);
            }
          })
          .catch(function(error) {
            var errorInfo = "http error when edit user directory";
            console.error(errorInfo);
            return $q.reject(errorInfo);
          });
      },

      deleteUserDirectory: function(param) {
        var url = "/userDirectory/api/id/" + param;
        return $http.delete(url)
          .then(function(response) {
            console.log("get response from delete %s", url);
            console.log(response);
            if(response.data.code === 200) {
              return response.data.res;
            }
            else {
              var errorInfo = "status error when delete user directory";
              console.error(errorInfo);
              return $q.reject(errorInfo);
            }
          })
          .catch(function(error) {
            var errorInfo = "http error when delete user directory";
            console.error(errorInfo);
            return $q.reject(errorInfo);
          });
      },

      sendBirthdayRemainder: function() {
        var url = "/userDirectory/api/sendBirthdayRemainder";
        return $http.post(url)
          .then(function(response) {
            console.log("get response from post %s", url);
            console.log(response);
            if(response.data.code === 200) {
              return response.data.res;
            }
            else {
              var errorInfo = "status error when send birthday remainder";
              console.error(errorInfo);
              return $q.reject(errorInfo);
            }
          })
          .catch(function(error) {
            var errorInfo = "http error when send birthday remainder";
            console.error(errorInfo);
            return $q.reject(errorInfo);
          });
      }

    };
  }])
  .filter("basename", [function() {
    return function(input) {
      return input.split('/').pop();
    };
  }]);

