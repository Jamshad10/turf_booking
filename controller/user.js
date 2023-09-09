require('dotenv').config();
const Turf = require("../models/turfSchema");
const otpSc = require("../models/otpSchema");
const nodemailer = require("nodemailer");
const Booking = require("../models/bookingSchema");
const Razorpay = require("razorpay");
const crypto = require("crypto");

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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
        const { digit1, digit2, digit3, digit4 } = req.body;
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
    const id = booking.id
    booking.save().then((users) => {
        res.render("paymentVerify", {
            users,
            id,
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

const razorpayCreatOrderId = (req, res) => {
    const options = {
        amount: req.body.amount * 100, // multiply by 100 to convert to paise
        currency: "INR",
        receipt: "order_rcp1"
    };
    instance.orders.create(options, function (err, order) {
        if (err) {
            res.status(500).send({ error: "Failed to create order" });
        } else {
            res.send({ orderId: order.id });
        }
    });
};



const razorpayPaymentVerify = async (req, res) => {
    const bookingId = req.body.bookingid;
    console.log(bookingId, "hy");
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.response;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

    try {
        // Update the booking record in the database with the Razorpay payment details
        const updatedBooking = await Booking.findOneAndUpdate(
            {
                orderId: razorpay_order_id,
                _id: bookingId
            },
            {
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
                status: 'Paid',
                correspondentId: bookingId // Update the correspondent ID in the record
            },
            { new: true }
        );
        console.log(updatedBooking);
        res.send({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Failed to update booking' });
    }
};

const invoice = async (req, res) => {
    try {
        const bookingId = req.query.id;
        const paymentId = req.query.paymentId;
        const orderId = req.query.orderId;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }
        res.render('invoice', {
            booking,
            paymentId,
            orderId,
            title: "Invoice"
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('error');
    }
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
    razorpayCreatOrderId,
    razorpayPaymentVerify,
    invoice,
}