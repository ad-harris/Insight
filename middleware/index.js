var Dashboard = require("../models/dashboard");
var Comment = require("../models/comment");
var middlewareObj =  {};

//Define auth middleware for pages as  well as Dashboard and Comment Ownership

middlewareObj.checkDashboardOwnership = function(req,res,next){
  if(req.isAuthenticated()){
      Dashboard.findById(req.params.id, function(err, foundDashboard){
        if(err){
            req.flash("error", "Dashboard not found");
            res.redirect("/home")
        } else {
          if(foundDashboard.author.id.equals(req.user._id)){ //strange equating an mongoose object to a string (needs that .equals method)
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
            res.redirect("/home")
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
