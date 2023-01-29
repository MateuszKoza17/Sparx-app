const mongoose = require("mongoose");
const { database } = require("../config.js");

mongoose.connect(database);
