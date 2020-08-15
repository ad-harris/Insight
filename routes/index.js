const express = require("express");
const router = express.Router();
var Dashboard = require("../models/dashboard");
var Comment = require("../models/comment");
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");


router.get("/register", function(req,res){
  res.render("register");
});

//signup logic
router.post("/register", function(req,res){
  var  newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err,user){
    if(err){
      req.flash("error", err.message);
      return res.redirect("/register");
    } else {
      passport.authenticate("local")(req,res, function() {
        res.redirect("/home")
      });
    }
  });
});

//route for Login
router.get("/login", function(req,res){
  res.render("login");
});

//login logic
router.post("/login", passport.authenticate("local",
{
  successRedirect:"/home",
  failureRedirect: "/login",
}), function(req,res){
});

//logout ROUTES
router.get("/logout", function(req,res){
  req.logout();
  req.flash("success", "You have logged out");
  res.redirect("/")
})

router.get("/select",middleware.isLoggedIn, function(req,res){
  res.render("selector");
});

router.get("/report", function(req,res){
  res.render("index1");
});

router.get("/show/COVID", middleware.isLoggedIn, function(req,res){
  res.render("showCOVID");
});


router.get("/dashboard", middleware.isLoggedIn, function(req, res){
  console.log(req.user);
//finds and returns all dashboards from DB
Dashboard.find({}, function(err, alldashboards){
    if(err){
      console.log(err);
    } else{
      res.render("dashboard", {dashboards :alldashboards, currentUser: req.user});
    }
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
  res.redirect("/login")
}}


module.exports = router;
