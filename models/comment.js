var mongoose = require("mongoose");

//define comment model and export - NOT IN USE in MVP V1

var commentSchema = new mongoose.Schema({
    text: String,
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String,
    }
});

module.exports = mongoose.model("Comment", commentSchema);
