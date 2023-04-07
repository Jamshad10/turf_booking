const Admin = require("../models/adminSchema");
const Turf = require("../models/turfSchema");
const bcrypt = require("bcrypt");
const fs = require("fs");



const adminlog = (req, res) => {
    res.render('adminLogin', {
        title: "Admin Login",
    });
};

const adminHome = (req, res) => {
    if (req.session.admin_id) {
        res.render('adminHome', {
            title: "Admin Home",
        })
    } else {
        res.redirect("/admin/adminlogin")
    }

}


const adminlogin = async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email })
        if (admin) {
            console.log(admin);
            let data = await bcrypt.compare(req.body.password, admin.password)
            console.log(data);
            if (data) {

                req.session.AdminLogged = true;
                req.session.admin_id = admin.id;

                res.redirect("/admin/adminhome")
            } else {
                res.redirect("/admin/adminlogin")
            }
        }
    } catch (error) {
        console.log(error);
    };
};



const adminSign = (req, res) => {
    res.render('adminSignup', {
        title: 'Admin Signup'
    });
};

const adminSignup = async (req, res) => {
    try {
        console.log(req.body);
        const admin = new Admin({
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword,
        });
        admin.save().then(result => {
            console.log(result);
            res.redirect('/admin/adminlogin');
        });
    }
    catch (err) {
        console.log(err);
    };
};

const addTurfPage = (req, res) => {
    res.render('add_turf', {
        title: 'Add item',
    });
};

const addTurf = (req, res) => {
    try {
        const turf = new Turf({
            name: req.body.name,
            location: req.body.location,
            size: req.body.size,
            price: req.body.price,
            image: req.file.filename,
        });
        turf.save().then(result => {
            console.log(result);
            res.redirect('/admin/adminhome');
        });
    }
    catch (err) {
        console.log(err);
    };
};

const adminItemsView = (req, res) => {
    Turf.find().exec().then(turf => {
        res.render('adminItems', {
            title: "Admin Items",
            turf: turf,
        });
    });
};

const editTurf = (req, res) => {
    let id = req.params.id;
    Turf.findById(id)
        .then((turf) => {
            res.render("editTurf", {
                title: "Edit Turf Details",
                turf,
            });

        });
};

const postEditTurf = async (req,res) => {
    let id = req.params.id;
    console.log(id);
    let new_image = "";

    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync("./public/images/uploads" + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    Turf.findByIdAndUpdate(id, {
        name: req.body.name,
        location: req.body.location,
        size: req.body.size,
        price: req.body.price,
        image: new_image
      }).then(result => {
        console.log(result);
        res.redirect("/admin/adminhome");
      }).catch(err => {
        console.log(err);
      });
};

const deleteTurf = (req,res) => {
    let id = req.params.id;
    Turf.findByIdAndRemove(id)
     .then((result) => {
        console.log(result);
        if (result && result.image != '') {
            try {
                fs.unlinkSync('./public/images/uploads' + result.image);
            } catch (err) {
                console.log(err);
            }
        }
        res.redirect('/admin/adminitems');
    })
    .catch((err) => {
        console.log(err);
    });
}

module.exports = {
    adminlog,
    adminSign,
    adminHome,
    adminSignup,
    adminlogin,
    addTurfPage,
    addTurf,
    adminItemsView,
    editTurf,
    postEditTurf,
    deleteTurf,
};