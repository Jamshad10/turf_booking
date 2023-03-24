const mongoose = require("mongoose");

const turfSchema = new mongoose.Schema ({
    name: {
        type: String,
        required:true,
    },
    location: {
        type: String,
        required:true,
    },
    size: {
        type:String,
        required:true,
    },
    price: {
        type:String,
        required:true,
    },
    image: {
        type:String,
        required:true,
    },
});

const Turf = mongoose.model("Turf",turfSchema);
module.exports = Turf;