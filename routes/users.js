var express = require('express');
var router = express.Router();
// var bcrypt = require('bcryptjs');
var User = require('../db/index');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/signup',function(req,res,next){
  res.render('signup' , { title : 'signup' });
});
router.post('/register',function(req,res, next){
  var email = req.body.RegisterEmail;
  var password = req.body.RegisterPassword;
  console.log(email);
  console.log(password);
  // Validation
  req.checkBody('RegisterEmail', 'Email is required').notEmpty();
  req.checkBody('RegisterPassword', 'Password is required').notEmpty();

  var errors = req.validationErrors();
  if(errors)
  {
    res.send("Errors case");
    // res.render('register',{
    //   errors: errors
    // });
  }
  else{
      var newUser = {
        email: email,
        password: password
      };
      User.createUser(newUser,function (err, user) {
        if (err) throw err;
        console.log("user");
      });
      req.flash('success_msg', 'You are registered and can now login');
      res.redirect('/users/signup');
  }
});

router.post('/login',
  passport.authenticate('local',{successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
  function(req,res){
    res.redirect('/');
});

module.exports = router;
