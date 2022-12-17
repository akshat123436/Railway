const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrainSchema = new Schema({
  number: String,
  source: String,
  destination: String,
  station: String,
  halt: Boolean,
  arrival: Number,
  departure: Number,
});

module.exports = mongoose.model("Train", TrainSchema);
