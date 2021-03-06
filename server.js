// server.js
const env = process.env.ENV;
const blogName = process.env.BLOGNAME;
// init project
const express = require("express");
var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: process.env.AUTH_SECRET, resave: false, saveUninitialized: false }));



var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

const hbs = require("hbs");

const auth = require("./helpers/auth")();
const port = process.env.PORT;

if (env == "DEV" || env == "GLITCH"){
  console.log("ENV IS: " + env);
} else {
  console.log("ENV IS NOT DEV");
  if (port){
    console.log("env port: " + port);
  }
}


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// https://www.npmjs.com/package/hbs
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
// Handlebars Partials:
hbs.registerPartials(__dirname + '/views/partials');

if (env == "DEV" || env == "GLITCH"){
  app.get("*", function (req, res, next) {
    // Reload partials on root reload to upate.
    hbs.registerPartials(__dirname + '/views/partials');
    next();
  });
}

// Admin
var adminRouter = require("./routes/admin");
app.use("/admin", adminRouter);
app.get("/login", function(req, res, next) {
  req.url = "/admin/login/";
  app.handle(req, res, next);
});
app.get("/logout", function(req, res, next) {
  req.url = "/admin/logout/";
  app.handle(req, res, next);
});

// Blog
var blogRouter = require("./routes/blog");
app.use("/", blogRouter);

// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
