const express = require("express");
const router = express.Router();
const fs = require("fs");

const {
    userHome,

} = require('../controller/user');

//user routing....
router.get("/", userHome);


module.exports = router;