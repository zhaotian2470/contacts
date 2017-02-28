"use strict";

angular.module('users', [])
  .controller('MainCtrl', ['usersService', '$window', function(usersService, $window) {

    var self = this;

    self.url = "login.html";
    self.errorPrompt = "";

    self.loginInfo = {
      username: "",
      password: ""
    };

    self.registerInfo = {
      username: "",
      password: "",
      email: ""
    };

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
      self.url = "register.html";
    };

    self.register = function() {
      usersService.register(self.registerInfo)
        .then(function(result) {
          self.url = "login.html";
          console.log("success to register");
        })
        .catch(function(error) {
          console.error("error to register");
        });
    };

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
              var errorInfo = "status error when register";
              console.error(errorInfo);
              return $q.reject(errorInfo);
            }
          })
          .catch(function(error) {
            var errorInfo = "http error when register";
            console.error(errorInfo);
            return $q.reject(errorInfo);
          });
      }

    };
  }]);
