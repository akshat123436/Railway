const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Station = new Schema({
  name: String,
  t11126: Number,
  t11125: Number,
  t19303: Number,
  t18234: Number,
  t12141: Number,
});

module.exports = mongoose.model("Station", Station);
