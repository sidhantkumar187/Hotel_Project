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
router.get('/register', function(req,res,next){
  res.render('register', { title :'register'});
});
router.post('/register',function(req,res, next){
  var email = req.body.RegisterEmail;
  var password = req.body.RegisterPassword;
  var username = req.body.username;
  console.log(email);
  console.log(password);
  // Validation
  req.checkBody('RegisterEmail', 'Email is required').notEmpty();
  req.checkBody('RegisterPassword', 'Password is required').notEmpty();
  req.checkBody('username','Username is Required').notEmpty();

  var errors = req.validationErrors();
  if(errors)
  {
    // res.send("Errors case");
    res.render('register',{
      errors: errors
    });
  }
  else{
      var newUser = {
        email: email,
        password: password,
        username: username
      };
      User.createUser(newUser,function (err, user) {
        if (err) throw err;
        console.log(user);
      });
      req.flash('success_msg', 'You are registered and can now login');
      res.redirect('/users/login');
  }
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    // Here the username and password refers to the name of input in the loginform inside hbs and is similarly written as name attribute in input field
    User.getUserByUsername(username, function (err,user) {
      if(err) throw err;
      if(!user) {
        return done(null, false , {message: 'Unknown User'});
      }
      User.comparePassword(password,user.password, function (err, isMatch) {
        if(err) throw err;
        if (isMatch) {
          return done (null,user);
        } else {
          return done(null, false , { message: 'Invalid Password'});
        }
      });
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
  console.log("serialize called");
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.get('/login', function(req,res,next){
  res.render('login', {title : 'Login'});
});
router.post('/login',
  passport.authenticate('local',{successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
  function(req,res){
  console.log("login post request called");
    // if this function gets called then Authentication was successfull
    res.redirect('/');
});

router.get('/logout', function(req,res){
  console.log("logout inside");
  req.logout();
  req.flash('success_msg', 'You are Logged Out Now');
  res.redirect('/users/login');
});

module.exports = router;
