const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("../middlewares/multer");
const {
    ifAdmin,
} = require("../middlewares/sessions")

const {
    adminlog,
    adminSign,
    adminHome,
    adminSignup,
    adminlogin,
    addTurfPage,
    addTurf,
    adminItemsView,
    editTurf,
    postEditTurf,

} = require("../controller/admin")


//routing....
router.get("/adminlogin",adminlog);
router.get("/adminsignup", adminSign);
router.get("/adminhome",ifAdmin,adminHome);
router.get("/addturf", addTurfPage);
router.get("/adminitems", adminItemsView);
router.get("/editturf/:id",editTurf);
router.post("/adminsignup", adminSignup);
router.post("/adminlogin", adminlogin);
router.post("/addturf",multer,addTurf);
router.post("/editturf/:id",multer,postEditTurf);



module.exports = router;