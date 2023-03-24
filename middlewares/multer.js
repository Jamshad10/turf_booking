const multer = require("multer");
const fs = require("fs");
const path = require("path");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    }
});
var upload = multer({
    storage: storage, 
}).single("image");

module.exports = upload;