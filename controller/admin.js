const Admin = require("../models/adminSchema");
const bcrypt = require("bcrypt");



const adminlog = (req, res) => {
    res.render('adminLogin', {
        title: "Admin Login"
    });
};

const adminlogin = async(req,res) => {
    try {
        const admin = await Admin.findOne({email: req.body.email})
        if(admin){
            console.log(admin);
            let data = await bcrypt.compare(req.body.password, admin.password)
            if(data) {
                res.redirect("/admin/adminHome")
            } else{
                res.redirect("/admin/adminlogin")
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const adminSign = (req, res) => {
    res.render('adminSignup', {
        title: 'Admin Signup'
    });
};

const adminSignup = async(req,res)=>{
    try{
     console.log(req.body);
     const admin = new Admin({
         name: req.body.name,
         mobile: req.body.mobile,
         email: req.body.email,
         password: req.body.password,
         confirmpassword: req.body.confirmpassword,
     });
     admin.save().then(result=>{
         console.log(result);
         res.redirect('/admin/adminlogin');
     });
    }
    catch(err){
      console.log(err);
     };
  };

const adminHome = (req, res) => {
    res.render('adminHome', {
        title: 'Admin Home'
    });
};





module.exports = {
    adminlog,
    adminSign,
    adminHome,
    adminSignup,
    adminlogin,
}