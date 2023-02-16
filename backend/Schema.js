const mongoose = require("mongoose");
const { Schema } = mongoose;
const ActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: ["true", "Please Enter a Name"],
  },
  description: {
    type: String,
    required: ["true", "Please Enter a Description"],
  },
  duration: {
    type: Number,
    min: [1, "Please Enter a Number Greater Than 0"],
    required: ["true", "Please Enter Duration"],
  },
  date: {
    type: Date,
    required: ["true", "Please Enter a valid Date"],
  },
  activityType: {
    type: String,
    required: ["true", "Please Select your Activity"],
  },
  user: [{ type: Schema.Types.ObjectId, ref: "User" }],
});
const Activity = mongoose.model("Activity", ActivitySchema);
module.exports = Activity;
