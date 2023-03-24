const Turf = require("../models/turfSchema");


const userHome = (req,res) => {
    res.render('index',{
        title: 'Home Page'
    });
};

const turfSpots = (req,res) => {
    Turf.find().exec().then(turf => {
        res.render('turfSpots', {
            title: "Turf Spots",
            turf: turf,
        })
    })
    
}

module.exports = {
    userHome,
    turfSpots,
}