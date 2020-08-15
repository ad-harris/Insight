const mongoose = require('mongoose'); //for connecting to MongoDB
const passportLocalMongoose = require("passport-local-mongoose")

//define user model and export


const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
