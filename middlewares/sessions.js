const Admin = require("../models/adminSchema");


const ifAdmin= (req,res,next)=>{
    if(req.session.admin_id){
    next();
}
else{
    res.redirect("/admin/adminlogin")
}
}

// const ifUser = (req,res,next)=>{
//     if(req.session.user_id){
//     next();
// }
// else{
//     res.redirect("/login")
// }
// }
// const ifUserLogout = async (req,res,next)=>{
//     if(req.session.user_id){
//        res.redirect('/')
//     }
//     next()
//    }


// const ifAdminLogout = async (req,res,next)=>{
//  if(req.session.admin_id){
//     res.redirect('/admin')
//  }
//  next()
// }


module.exports={ ifAdmin}

