



const userHome = (req,res) => {
    res.render('index',{
        title: 'Home Page'
    });
};


module.exports = {
    userHome,
}