var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj =  {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
  if(req.isAuthenticated()){
      Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds")
        } else {
          if(foundCampground.author.id.equals(req.user._id)){ //strange equating an mongoose object to a string (needs that .equals method)
            next();
          } else {
            req.flash("error", "You do not have permission to do that.");
            res.redirect("back")
  }
}
});
  } else {
    res.redirect("back")
  }
};



middlewareObj.checkCommentOwnership = function(req,res,next){
  if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("/campgrounds")
        } else {
          if(foundComment.author.id.equals(req.user._id)){ //strange equating an mongoose object to a string (needs that .equals method)
            next();
          } else {
            req.flash("error", "Please log in.")
            res.redirect("back")
  }
}
});
  } else {
    res.redirect("back")
  }
};

middlewareObj.isLoggedIn = function(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
  req.flash("error", "Please log in.")
  res.redirect("/login")
}}



module.exports = middlewareObj
