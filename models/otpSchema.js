const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
   
    email: {
        type:String,
        required:true,
    },
    
});

const otpSc = mongoose.model("User",otpSchema);
module.exports = otpSc;