const express = require("express");
const router = express.Router();
var Dashboard = require("../models/dashboard");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/", function(req, res){
  res.render("Landing")
});

router.get("/home",middleware.isLoggedIn, function(req, res){
  console.log(req.user);
//finds and returns all dashboards from DB
Dashboard.find({}, function(err, alldashboards){
    if(err){
      console.log(err);
    } else{
      res.render("dashboards/index", {dashboards :alldashboards, currentUser: req.user});
    }
  });
});

router.get("/dashboards/new", middleware.isLoggedIn, function(req, res){
  res.render("dashboards/new")
});


router.post("/home", middleware.isLoggedIn, function(req, res){
  var DashboardName = req.body.DashboardName;
  var Hashtag1 = req.body.Hashtag1;
  var Location1 = req.body.Location1;
  var Hashtag2 = req.body.Hashtag2;
  var Location2 = req.body.Location2;
  var Hashtag3 = req.body.Hashtag3;
  var Location3 = req.body.Location3;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newDashboard = {DashboardName: DashboardName, Hashtag1: Hashtag1, Location1: Location1, Hashtag2: Hashtag2, Location2: Location2, Hashtag3: Hashtag3, Location3: Location3, author: author};
  Dashboard.create(newDashboard, function(err, newlyCreated){
    if(err){
      console.log(err)
    } else {
    res.redirect("/dashboard");
    }
  });
});


router.get('/dashboards/:id', function(req,res){
  Dashboard.findById(req.params.id).populate("comments").exec(function(err, foundDashboard){
  if(err){
    console.log(err);
  } else
   res.render("dashboards/show", {dashboard: foundDashboard});
 })
});


router.get("/dashboards/:id/edit", middleware.checkDashboardOwnership, function(req,res){
      Dashboard.findById(req.params.id, function(err, foundDashboard){
            res.render("dashboards/edit", {dashboard: foundDashboard});
});
});

router.put("/dashboards/:id",  middleware.checkDashboardOwnership,function(req,res){
  Dashboard.findByIdAndUpdate(req.params.id, req.body.dashboard, function(err,updatedDashboard){
    if(err){
      console.log(err);
      res.redirect("/home");
    } else {
      res.redirect("/dashboards/" + req.params.id);
    }
  })
});

router.delete("/dashboards/:id", middleware.checkDashboardOwnership, function(req,res){
  Dashboard.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/home");
  } else {
    res.redirect("/home");
  }
});
});

module.exports = router;
