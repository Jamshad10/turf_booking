const express = require("express");
const router = express.Router();
const fs = require("fs");

const {
    userHome,
    turfSpots,
    userLogin,
    otpVerifyPage,
    getverify,
    paymentPage,
    postOtpVerify,
    postBooking,
    paymentVerifyPage,
    razorpayCreatOrderId,
    razorpayPaymentVerify,
    invoice,

} = require('../controller/user');

//user routing....
router.get("/", userHome);
router.get("/turfspots", turfSpots);
router.get("/userlogin", userLogin);
router.get("/verify",otpVerifyPage);
router.get("/payment/:id",paymentPage);
router.get("/paymentverify",paymentVerifyPage);
router.get("/invoice",invoice);
router.post("/verify",postOtpVerify);
router.post("/userlogin",getverify);
router.post("/payment", postBooking);
router.post("/create/orderId",razorpayCreatOrderId);
router.post("/api/payment/verify",razorpayPaymentVerify);


module.exports = router;