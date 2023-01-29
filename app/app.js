const express = require("express");
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { secretKey } = require("./config.js");
const helmet = require("helmet");
const rateLimiterMiddleware = require("./middleware/rate_limiter-middleware.js");
const app = express();

require("./db/mongoose.js");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "cdn.jsdelivr.net"],
        styleSrc: [
          "'self'",
          "cdn.jsdelivr.net",
          "https://fonts.gstatic.com",
          "https://fonts.googleapis.com",
        ],
      },
    },
  })
);
app.use(
  session({
    secret: secretKey,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    resave: false,
  })
);
app.use(rateLimiterMiddleware);

app.set("view engine", "ejs");
app.use(ejsLayouts);
app.set("views", path.join(__dirname + "/../views"));
app.set("layout", "./layouts/main");
app.use(express.static(__dirname + "/../public"));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", require("./middleware/view_variables-middleware.js"));
app.use("/", require("./middleware/user_variables-middleware.js"));
app.use("/", require("./middleware/brand_variables-middleware.js"));

// Routes
app.use(require("./routes/web.js"));

module.exports = app;
