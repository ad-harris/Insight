const express = require("express");
const router = express.Router();
var Dashboard = require("../models/dashboard");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/dashboards/:id/comments/new", middleware.isLoggedIn, function(req,res){
  Dashboard.findById(req.params.id, function(err, dashboard){
    if(err){
      console.log("Error")
    } else {
      res.render("comments/new", {dashboard:dashboard})
    }
  })
});

router.post("/dashboards/:id/comments", middleware.isLoggedIn, function(req,res){
  Dashboard.findById(req.params.id, function(err, dashboard){
    if(err){
      req.flash("error", "Something went wrong.")
      console.log(err);
      res.redirect("/dashboards");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          //add username and ID to comment and save
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "New comment created.")
          res.redirect("/dashboards/" + campground._id);
        }
      })
    }
  })
});

router.get("/dashboards/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
  Comment.findById(req.params.comment_id, function(err,foundComment){
    if(err){
      res.redirect("back");
    } else {
      res.render("comments/edit", {comment:foundComment, dashboard_id:req.params.id});
    }
  });
});


router.put("/dashboards/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
    if(err){
      res.redirect("back");
    } else{
      res.redirect("/dashboards/"+req.params.id);
    }
});
});


router.delete("/dashboards/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
  } else {
    req.flash("success", "Comment deleted")
    res.redirect("/dashboards/"+req.params.id);
  }
});
});




module.exports = router
