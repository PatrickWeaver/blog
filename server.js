// server.js

// init project
var express = require("express");
var app = express();
var hbs = require("hbs");
var http = require('http');

var port = 8106;

var options = {
  host: process.env.API_URL,
  port: process.env.API_PORT,
  path: "/blog/posts/"
};

var clientUrl = process.env.CLIENT_API;

var apiUrl = "http://" + clientUrl + ":" + options.port + options.path;

var monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// https://www.npmjs.com/package/hbs
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', function(req, res) {

  var api_posts = {};

  http.get(options, function(apiResponse){
    apiResponse.on("data", function(data){
      api_posts = JSON.parse(data);
      sendResponse(api_posts);
    });
  }).on("error", function(error){
    console.log("Error: " + error);
  });

  function sendResponse(posts) {
    for (post in posts) {
      var rawDate = new Date(posts[post].post_date);
      var formattedDate = "";
      formattedDate += monthNames[rawDate.getMonth()] + " " + rawDate.getDate() + ", " + rawDate.getFullYear();
      posts[post].post_formatted_date = formattedDate;
    }
    res.locals = {
        title: "",
        posts: posts
    }
    res.render("index");
  }
});


app.get("/new/", function(req, res) {

  res.locals = {
    apiUrl: apiUrl
  }

  res.render("new");
})

if (process.env.ENV == "DEV"){
  console.log("ENV IS: " + process.env.ENV);
} else {
  console.log("ENV IS NOT DEV");
  if (process.env.PORT){
    console.log("env port: " + process.env.PORT);
    //port = process.env.PORT;
  }
}

// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port + " or " + port);
});
