var express = require("express");
var twitterAnalysisInstance = require("./twitterAnalysis.js");
const bodyParser = require("body-parser");
const request = require("request"); //for APIs
const mongoose = require('mongoose'); //for connecting to MongoDB
const Comment = require("./models/comment");
const Campground = require("./models/campground");
//const seedDB = require("./seeds");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose =require("passport-local-mongoose");
const User = require("./models/user");
const methodOverride = require("method-override");
const flash = require("connect-flash");
var app = express();
var twitter = new twitterAnalysisInstance();
var score;
//allows app to assume all  files are .ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(express.static('public'));




var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")


app.get('/results/:query', function (req, res) {
    twitter.getTwitterHashTagData(req.params.query, function (error, dataScores, twitterData) {
        if (error) console.log(error);

        res.write(JSON.stringify(twitterData));
        res.end(JSON.stringify(dataScores).toString());
    });
});




//define db url
var url = "mongodb://localhost:27017/SocialInsight";

//connect to DB
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  })
  .then(() =>  console.log("Social Insight Database is connected"))
  .catch(error => console.log(error.message));

//seedDB()

//Passport Configuration
app.use(require("express-session")({
  secret: "Listen",
  resave: false,
  saveUnitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));


//passes user and flash message info to all
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
})

app.use(commentRoutes);
app.use(indexRoutes);
app.use(campgroundRoutes);



var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log("Listening to the app on port " + port);
});
