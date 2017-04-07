"use strict";


const express = require('express'),
      controller = require('./controller');


var router = express.Router();
module.exports = router;

router.post('/login', controller.login);
router.get('/logout', controller.logout);
router.post('/register', controller.createUser);
router.get('/profile', controller.getProfile);
router.post('/profile', controller.saveProfile);

router.use("/userDirectory", function(req, res, next) {
  if(!req.user) {
    return res.redirect('/view/login.html');
  }
  next();
});

router.post("/userDirectory", controller.createUserDirectory);
router.get("/userDirectory", controller.readAllUserDirectory);
router.get("/userDirectory/id/:id", controller.readUserDirectoryById);
router.put("/userDirectory/id/:id", controller.updateUserDirectory);
router.delete("/userDirectory/id/:id", controller.deleteUserDirectory);

router.post("/userDirectory/sendBirthdayRemainder", controller.sendBirthdayRemainder);

router.param("id", controller.userDirectoryByID);
