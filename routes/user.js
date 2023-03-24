const express = require("express");
const router = express.Router();
const fs = require("fs");

const {
    userHome,
    turfSpots,

} = require('../controller/user');

//user routing....
router.get("/", userHome);
router.get("/turfspots", turfSpots);


module.exports = router;