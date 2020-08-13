const express = require("express");
const router = express.Router();
var Dashboard = require("../models/dashboard");
var Comment = require("../models/comment");
var middleware = require("../middleware");


////////////////////////////////////////////////////////////
//landing page route
router.get("/", function(req, res){
  res.render("Landing")
});


//campgrounds page route
router.get("/home",middleware.isLoggedIn, function(req, res){
  console.log(req.user);
//finds and returns all campgrounds from DB
Dashboard.find({}, function(err, alldashboards){
    if(err){
      console.log(err);
    } else{
//renders campgrounds page and passes allcampgrounds to campgrounds.ejs as campgrounds
      res.render("campgrounds/index", {dashboards :alldashboards, currentUser: req.user});
    }
  });
});

//create new campgrounds page route
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new")
});


//create new campgrounds post request
router.post("/home", middleware.isLoggedIn, function(req, res){
//gets data from new campgrounds form and stores  in  variables. Then gathers in newCampGround variable
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
//creates new Campground by adding newCampGround variable to CampgroundDB
  Dashboard.create(newDashboard, function(err, newlyCreated){
    if(err){
      console.log(err)
    } else {
    //redirects to campgrounds page
    res.redirect("/dashboard");
    }
  });
});



//show page route
router.get('/campgrounds/:id', function(req,res){
//find campground with required ID
  Dashboard.findById(req.params.id).populate("comments").exec(function(err, foundDashboard){
  if(err){
    console.log(err);
  } else
//renders show template with foundCampground data from DB
   res.render("campgrounds/show", {dashboard: foundDashboard});
 })
});


//edti campground routes
router.get("/campgrounds/:id/edit", middleware.checkDashboardOwnership, function(req,res){
      Dashboard.findById(req.params.id, function(err, foundDashboard){
            res.render("campgrounds/edit", {dashboard: foundDashboard});
});
});

//update campground route
router.put("/campgrounds/:id",  middleware.checkDashboardOwnership,function(req,res){

  Dashboard.findByIdAndUpdate(req.params.id, req.body.dashboardground, function(err,updatedDashboard){
    if(err){
      console.log(err);
      res.redirect("/home");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

//destroy routes
router.delete("/campgrounds/:id", middleware.checkDashboardOwnership, function(req,res){
  Dashboard.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/home");
  } else {
    res.redirect("/home");
  }
});
});

module.exports = router;
