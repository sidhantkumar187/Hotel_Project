var express = require('express');
var router = express.Router();
var User = require('../db/index');
// Rendering Hotel Main Page
router.get('/page/:hotelId',ensureAuthenticated, function(req,res) {         // Read the routing parameters from MDN Mozilla again 
    // console.log(req.params.hotelId);                // bcoz every get request is going inside this method i.e for all ( localhost:3000/hotels/link )
    User.getHotelInfo(req.params.hotelId, function (err,hoteljson){
        if (err) throw err;
        var link = { linker: "/hotels/confirmbook/"+hoteljson.id}
        console.log(link);
        // console.log("Through hotel.js"+hoteljson.name);
        // console.log("In the Hotelsjs "+hoteljson.description[0]);
        res.render('hotelpage', {hotel: hoteljson, linktobook: link});
    });
});
router.get('/hotel/search' , function (req,res){
    res.render('hotelsearch');
});
router.post('/search', function(req,res){           // gettting parameters from Homepage search bar 
    var location = req.body.slocation;
    var checkin = req.body.scheckin;
    var checkout = req.body.scheckout;
    var individuals = req.body.individuals;
    // console.log("-------------------------------"+checkin+"----------------------------------------------------------- inside search handler");
    res.redirect('../');
});
// router.get('/confirmbook/1',ensureAuthenticated, function(req,res){
//     res.render("hotelsearch");
// });
router.post('/confirmbook/:hotelId',ensureAuthenticated, function(req,res){           // gettting parameters from Homepage search bar 
    var checkin = req.body.checkin;
    var checkout = req.body.checkout;
    var individuals = req.body.individuals;
    var reserve = {
        indate : checkin,
        outdate : checkout,
        userid : req.session.passport.user,
        hotelid :req.params.hotelId,
    };
    
    console.log(reserve);
    User.checkavailability(reserve,function (err,bookstat) {
        if (err) throw err;
        console.log("Printed by hotel.js file --------SEE Bottom");
        console.log(bookstat);
        
        if (bookstat)
        {
            User.bookroom(reserve,function(err,bookstat) {
                if (err) {
                    res.send("Something Went wrong");
                    throw err
                }
                else
                    res.render("confirmbook");
                if (bookstat != null)
                    res.render("confirmbook");
            });
        }
        else {
            res.send("OOPS this room is already Booked");
        }
    });
    //  res.redirect('/');
});
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/register');
	}
}
module.exports = router;