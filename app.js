require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const session = require("express-session");
const Razorpay = require("razorpay");
const crypto = require("crypto");

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID ,
    key_secret: process.env.RAZORPAY_KEY_SECRET ,
  });

const app = express();
const PORT = process.env.PORT;

//session section....
app.use(session({
    secret:"thisismysecretkey",
    saveUninitialized:true,
    cookie: { maxAge: 600000000},
    resave: false
}));

//database connection....
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
db.on('error',(error)=>{
    console.log(error);
});
db.once('open',()=>{
    console.log("Connected to database");
})

//set ejs engine....
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));




//set files static
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public/images/uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/admin', express.static(__dirname + '/public/images/uploads'));
app.use('/admin/editturf', express.static(__dirname + '/public/images/uploads'));


//route prefix....
app.use("/admin",require("./routes/admin"));
app.use("/",require("./routes/user"));


//payment section....
app.post("/create/orderId", (req, res) => {
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
  });
  
  app.post("/api/payment/verify", (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.response;
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
  
    if (expectedSignature === razorpay_signature) {
      // Payment successful, update order status in database, etc.
      res.send({ success: true });
    } else {
      // Payment failed, handle error
      res.send({ success: false });
    }
  });


//server conection....
app.listen(PORT, () => {
    console.log("Server Started");
})