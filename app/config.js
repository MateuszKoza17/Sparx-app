const path = require("path");
require("dotenv").config({ path: __dirname + "/../.env" });

module.exports = {
  port: process.env.PORT || 3000,
  database: process.env.DATABASE || "mongodb://127.0.0.1:27017/Sparx",
  secretKey: process.env.SESSION_SECRET,
};
