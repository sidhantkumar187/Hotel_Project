var express = require('express');
var router = express.Router();
const db = require("../db");
/* GET home page. */

router.get('/', function(req, res, next) {
  db.query("SELECT * FROM hotels WHERE id = $1",[1], (error,result) => {
    if (error) {
      return next (error);
    }
    // res.send(result.rows[0].status);
    res.render('index', { title: 'Book Hotel' ,firstplace:'Chandigarh', secondplace: 'Delhi' , Name: result.rows[0].name , Location: result.rows[0].locality, Price: result.rows[0].price });
  });
});
router.post('/', function (req,res, next){
  var email = req.body.RegisterEmail;
  var password = req.body.RegisterPassword;
  console.log(email);
  console.log(password);
});

module.exports = router;
