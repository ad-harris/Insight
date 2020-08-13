var mongoose = require("mongoose");

var dashboardSchema = new mongoose.Schema({
   DashboardName: String,
   Location1: String,
   Hashtag1: String,
   Location2: String,
   Hashtag2: String,
   Location3: String,
   Hashtag3: String,
   author: {
     id: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User"
     },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

// Compile and export Campground DB model from Schema (Campground  is now name of DB for reference on ATOM. Campgrounds is name of DB on MongoDB as auto-pluralised)
module.exports = mongoose.model("Dashboard", dashboardSchema);
