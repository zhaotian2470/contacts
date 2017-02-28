"use strict";

angular.module('users', [])
  .controller('MainCtrl', ['usersService', '$window', '$location', function(usersService, $window, $location) {

    var self = this;

    self.errorPrompt = "";
    self.url = $location.search().defaultPage;
    if(!self.url) {
      self.url = "login.html";
    }

    self.loginInfo = {
      username: "",
      password: ""
    };

    self.registerInfo = {
      username: "",
      password: "",
      email: ""
    };

    self.profileInfo = {};

    self.login = function() {
      self.errorPrompt = "";
      usersService.login(self.loginInfo)
        .then(function(result) {
          $window.location.href="/userDirectory/view/index.html";
        })
        .catch(function(error) {
          self.errorPrompt = error;
        });      
    };

    self.gotoRegister = function() {
      self.errorPrompt = "";
      self.url = "register.html";
    };

    self.register = function() {
      self.errorPrompt = "";
      usersService.register(self.registerInfo)
        .then(function(result) {
          self.url = "login.html";
        })
        .catch(function(error) {
          self.errorPrompt = error;
        });
    };

    self.initProfile = function() {
      usersService.getProfile()
        .then(function(result) {
          self.profileInfo = result;
        })
        .catch(function(error) {
          self.errorPrompt = error;
        });
    };

    self.saveProfile = function() {
      self.errorPrompt = "";
      usersService.saveProfile(self.profileInfo)
        .then(function(result) {
          self.url = "login.html";
        })
        .catch(function(error) {
          self.errorPrompt = error;
        });
    };

    if(self.url === "profile.html") {
      self.initProfile();
    }

  }])
  .factory('usersService', ['$http', '$q', function($http, $q) {
    return {
      login: function(param) {
        var url = "/users/api/login";
        return $http.post(url, param)
          .then(function(response) {
            console.log("get response from post %s: %j", url, param);
            console.log(response);
            if(response.data.code === 200) {
              return response.data.res;
            }
            else {
              var errorInfo = "status error when login: " + response.data.code;
              console.error(errorInfo);
              return $q.reject(errorInfo);
            }
          })
          .catch(function(error) {
            var errorInfo = "http error when login: ";
            if(error.data && error.data.message) {
              errorInfo += error.data.message;
            }
            else {
              errorInfo += JSON.stringify(error);
            }
            console.error(errorInfo);
            return $q.reject(errorInfo);
          });
      },
      
      register: function(param) {
        var url = "/users/api/register";
        return $http.post(url, param)
          .then(function(response) {
            console.log("get response from post %s: %j", url, param);
            console.log(response);
            if(response.data.code === 200) {
              return response.data.res;
            }
            else {
              var errorInfo = "status error when register: " + response.data.code;
              console.error(errorInfo);
              return $q.reject(errorInfo);
            }
          })
          .catch(function(error) {
            var errorInfo = "http error when register: ";
            if(error.data && error.data.message) {
              errorInfo += error.data.message;
            }
            else {
              errorInfo += JSON.stringify(error);
            }
            console.error(errorInfo);
            return $q.reject(errorInfo);
          });
      },

      getProfile: function() {
        var url = "/users/api/profile";
        return $http.get(url)
          .then(function(response) {
            console.log("get response from get %s", url);
            console.log(response);
            if(response.data.code === 200) {
              return response.data.res;
            }
            else {
              var errorInfo = "status error when get profile: " + response.data.code;
              console.error(errorInfo);
              return $q.reject(errorInfo);
            }
          })
          .catch(function(error) {
            var errorInfo = "http error when get profile: ";
            if(error.data && error.data.message) {
              errorInfo += error.data.message;
            }
            else {
              errorInfo += JSON.stringify(error);
            }
            console.error(errorInfo);
            return $q.reject(errorInfo);
          });
      },

      saveProfile: function(param) {
        var url = "/users/api/profile";
        return $http.post(url, param)
          .then(function(response) {
            console.log("get response from post %s: %j", url, param);
            console.log(response);
            if(response.data.code === 200) {
              return response.data.res;
            }
            else {
              var errorInfo = "status error when save profile: " + response.data.code;
              console.error(errorInfo);
              return $q.reject(errorInfo);
            }
          })
          .catch(function(error) {
            var errorInfo = "http error when save profile: ";
            if(error.data && error.data.message) {
              errorInfo += error.data.message;
            }
            else {
              errorInfo += JSON.stringify(error);
            }
            console.error(errorInfo);
            return $q.reject(errorInfo);
          });
      }

    };
  }])
  .config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true);
  }]);
