const express = require("express");
require("dotenv").config();

const taskRoute = require("./task.route");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/task", taskRoute);

app.head("/", (req, res) => {
  return res.status(200).json();
});

module.exports = app;
