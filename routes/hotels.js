var express = require('express');
var router = express.Router();
var User = require('../db/index');
// Rendering Hotel Main Page
router.get('/page/:hotelId', function(req,res) {         // Read the routing parameters from MDN Mozilla again 
    console.log(req.params.hotelId);                // bcoz every get request is going inside this method i.e for all ( localhost:3000/hotels/link )
    User.getHotelInfo(req.params.hotelId, function (err,hoteljson){
        if (err) throw err;
        console.log("Through hotel.js"+hoteljson.name);
        console.log("In the Hotelsjs "+hoteljson.description[0]);
        res.render('hotelpage', {hotel: hoteljson} );
    });
});
router.get('/hotel/search' , function (req,res){
    res.render('hotelsearch');
});
router.post('/search', function(req,res){
    var location = req.body.slocation;
    var checkin = req.body.scheckin;
    var checkout = req.body.scheckout;
    var individuals = req.body.individuals;
    console.log("-------------------------------"+checkin+"----------------------------------------------------------- inside search handler");
    res.redirect('../');
});
module.exports = router;