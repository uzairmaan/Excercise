const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: ["true", "Please Enter a Name"],
  },
  email: {
    type: String,
    unique: ["true", "Please Enter unique email"],
    required: ["true", "Please Enter a email"],
  },
  password: {
    type: String,
    required: ["true", "Please enter a valid password"],
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
