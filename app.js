const express = require("express");
const mongoose = require("mongoose");
const time = require("node-get-time");
const Train = require("./models/trains");
const Station = require("./models/station");
const app = express();
const path = require("path");
// const { findOneAndUpdate } = require("./models/trains");

app.set("view engine", "ejs");
app.use("/styles", express.static(__dirname + "/styles"));
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/railway");
}
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("connection open");
});
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/admin", async (req, res) => {
  const stations = await Station.find({});
  res.render("admin", { stations });
});
app.get("/admin/:nam/:trainum", async (req, res) => {
  const work = req.query.q;
  const now = time.now();
  var hour = "";
  var minute = "";
  for (let i = 0; i < now.length; i++) {
    if (now[i] === ":") {
      for (let j = i + 1; j < now.length; j++) {
        if (now[j] === ":") break;
        minute += now[j];
      }
      break;
    } else {
      hour += now[i];
    }
  }

  hour = parseInt(hour);
  minute = parseInt(minute);
  const actualTime = hour * 60 + minute;
  console.log(actualTime);
  if (work == "arrived") {
    const pp = await Train.find({ number: req.params.trainum });
    console.log(req.params.trainum);
    const obj = await Train.updateOne(
      { number: req.params.trainum },
      { $set: { arrival: actualTime, station: req.params.nam, halt: true } }
    );
    console.log(obj);
  } else if (work == "departed") {
    // console.log(req.params.trainum);
    const obj = await Train.updateOne(
      { number: req.params.trainum },
      { $set: { departure: actualTime, station: req.params.nam, halt: false } }
    );
    console.log(obj);
  }
  res.redirect("/");
});
app.get("/admin/:nam", async (req, res) => {
  const tem = await Station.find({ name: req.params.nam });
  const temp = tem[0];
  //   console.log(temp);
  const tt = [];
  if (temp.t11126 >= 0) {
    tt.push("t11126");
  }
  if (temp.t11125 >= 0) {
    tt.push("t11125");
  }
  if (temp.t19303 >= 0) {
    tt.push("t19303");
  }
  if (temp.t18234 >= 0) {
    tt.push("t18234");
  }
  if (temp.t12141 >= 0) {
    tt.push("t12141");
  }
  console.log(tt);
  res.render("trains", { tt: tt, name: temp.name });
});
app.get("/user", async (req, res) => {
  const stations = await Station.find({});
  res.render("user", { stations });
});
app.get("/user/:nam", async (req, res) => {
  const tem = await Station.find({ name: req.params.nam });
  const temp = tem[0];
  //   console.log(temp);
  const tt = [];
  if (temp.t11126 >= 0) {
    tt.push("t11126");
  }
  if (temp.t11125 >= 0) {
    tt.push("t11125");
  }
  if (temp.t19303 >= 0) {
    tt.push("t19303");
  }
  if (temp.t18234 >= 0) {
    tt.push("t18234");
  }
  if (temp.t12141 >= 0) {
    tt.push("t12141");
  }
  console.log(tt);
  res.render("list", { tt: tt, name: temp.name });
});
app.get("/user/:nam/:trainum", async (req, res) => {
  const trainData = await Train.findOne({ number: req.params.trainum });
  const StationData = await Station.findOne({ name: trainData.station });
  const number = trainData.number;
  //   const number = req.params.trainum;
  const expected = StationData[number];
  const real = trainData.arrival;
  var delay;
  if (expected < real) {
    const hour = (real - expected) / 60;
    const minute = (real - expected) % 60;
    delay =
      "The train is running late by " +
      hour +
      " hours and " +
      minute +
      " minutes";
  } else {
    delay = "The train is on time";
  }
  const arrivalTime =
    Math.floor(trainData.arrival / 60) + " : " + (trainData.arrival % 60);
  res.render("show", { trainData, StationData, delay, arrivalTime });
});
app.get("/make", async (req, res) => {
  const newstation = new Train({
    number: "t11125",
    source: "Ratlam",
    destination: "Gwalior",
    station: "Ratlam",
    halt: true,
    arrival: 1035,
  });
  await newstation.save();
  res.send(newstation);
});
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
