require('dotenv').config();
const Turf = require("../models/turfSchema");
const otpSc = require("../models/otpSchema");
const nodemailer = require("nodemailer");
const Booking = require("../models/bookingSchema");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'spotplayofficial@gmail.com',
        pass: 'gifpnelzsszxyshq'
    }
});


const userHome = (req, res) => {
    res.render('index', {
        title: 'Home Page'
    });
};

const turfSpots = (req, res) => {
    Turf.find().exec().then(turf => {
        res.render('turfSpots', {
            title: "Turf Spots",
            turf: turf,

        })
    })

};

const userLogin = (req, res) => {
    res.render("userLogin", {
        title: "User Login"
    });
};

const otpVerifyPage = (req, res) => {
    res.render("verifyOtp", {
        title: "Verify OTP"
    });
};

const getverify = async (req, res) => {
    try {
        const { email } = req.body;
        const val = Math.floor(1000 + Math.random() * 9000);
        await transporter.sendMail({
            to: email,
            from: "spotplayofficial@gmail.com",
            subject: 'OTP for login to Payment Page',
            html: `<h4> Your OTP is </h4>:<h2>${val}</h2>`
        });
        req.session.signup = { email, token: val }; // set the session object
        res.redirect('/verify');
    } catch (error) {
        console.log(error);
        res.status(401).send('Error');
    }
};

const postOtpVerify = async (req, res) => {
    try {
        const { email, token } = req.session.signup;
        const { digit1, digit2, digit3, digit4} = req.body;
        const enteredToken = digit1 + digit2 + digit3 + digit4;
        if (token == enteredToken) {
            const user = new otpSc({ email });
            console.log(user);
            await user.save().then((doc) => {
                req.session.logg = doc;
                res.redirect('/turfspots');
            })
        } else {
            res.redirect('/verify');
            console.log('invalid otp');
        }
    } catch (error) {
        console.log(error);
        res.redirect('/404error');
    }
};

const paymentPage = async (req, res) => {
    await Turf.findById(req.params.id).then(turf => {
        res.render("payment", {
            title: "Payment Page",
            turf: turf,
    })
    
    });

};

const postBooking = (req, res) => {
    const booking = new Booking({
      turf: req.body.turf,
      email: req.body.email,
      name: req.body.name,
      date: req.body.date,
      time: req.body.time,
      price: req.body.price,
    });
    booking.booked.push({
      date: req.body.date,
      time: req.body.time,
      turf: req.body.turf,
    });
    booking.save().then((users) => {
      res.render("paymentVerify", {
        users,
        title: "Payment Verify",
      });
    });
  };
  

const paymentVerifyPage = (req, res) => {
    Booking.find().then(users => {
        res.render("paymentVerify", {
            title: "Payment",
            users,
        })
    })
};


module.exports = {
    userHome,
    turfSpots,
    userLogin,
    otpVerifyPage,
    getverify,
    postOtpVerify,
    paymentPage,
    postBooking,
    paymentVerifyPage,
}