"use strict";


const express = require('express'),
      controller = require('./controller');


var router = express.Router();
module.exports = router;

router.post("/", controller.createUserDirectory);
router.get("/", controller.readAllUserDirectory);
router.get("/id/:id", controller.readUserDirectoryById);
router.put("/id/:id", controller.updateUserDirectory);
router.delete("/id/:id", controller.deleteUserDirectory);

router.post("/sendBirthdayRemainder", controller.sendBirthdayRemainder);

router.param("id", controller.userDirectoryByID);
