require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const session = require("express-session");

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



//server conection....
app.listen(PORT, () => {
    console.log("Server Started");
})