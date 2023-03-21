const express = require("express");
const router = express.Router();
const fs = require("fs");

const {
    adminlog,
    adminSign,
    adminHome,
    adminSignup,
    adminlogin,

} = require("../controller/admin")


//routing....
router.get("/adminlogin", adminlog);
router.get("/adminsignup", adminSign);
router.get("/adminhome", adminHome);
router.post("/adminsignup", adminSignup);
router.post("/adminlogin", adminlogin);



module.exports = router;