var express = require('express');
var router = express.Router();
const db = require("../db");
/* GET home page. */

router.get('/',ensureAuthenticated, function(req, res, next) {
  db.query("SELECT * FROM hotels WHERE id = $1",[1], (error,result) => {
    if (error) {
      return next (error);
    }
    //-------------------   To get Info stored inside session 
    // var username = req.session.passport.user;    getting userid stored inside session's passport's user object
    // console.log(username);
    // res.send(result.rows[0].status);
    res.render('index', { title: 'Book Hotel' ,firstplace:'Chandigarh', secondplace: 'Delhi' , Name: result.rows[0].name , Location: result.rows[0].locality, Price: result.rows[0].price });
    var mak = req.user;
    console.log(mak);
  });
});
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/register');
	}
}
router.post('/', function (req,res, next){
  var email = req.body.RegisterEmail;
  var password = req.body.RegisterPassword;
  // console.log(email);
  // console.log(password);
});

module.exports = router;