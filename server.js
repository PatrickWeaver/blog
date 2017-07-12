// server.js

// init project
var express = require("express");
var app = express();
var hbs = require("hbs");
var http = require("http");
var request = require("request");
// 🚸 Maybe don't need this, if so remove from package.json
//var bodyParser = require('body-parser')

var port = 8106;

var apiOptions = {
  host: process.env.API_URL,
  port: process.env.API_PORT,
  path: "/blog/posts/"
};

var apiUrl = "http://" + apiOptions.host + ":" + apiOptions.port + apiOptions.path;

var clientUrl = process.env.CLIENT_API;
var apiClientUrl = "http://" + clientUrl + ":" + apiOptions.port + apiOptions.path;

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

// https://www.npmjs.com/package/body-parser
//app.use(bodyParser.urlencoded({ extended: false }))

// https://www.npmjs.com/package/hbs
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', function(req, res) {
  var apiData = {
    page: 1
  }
  if (req.query.page){
    console.log("PAGE: " + req.query.page)
    if (parseInt(req.query.page) < 999999 && parseInt(req.query.page) > 0) {
  }
    apiData.page = req.query.page;
  }

  var api_posts = {};

  request(
    {
      url: apiUrl,
      qs: apiData
    },
    function(error, response, body){
      if(response.statusCode < 400){
        api_posts = JSON.parse(body);
        sendResponse(api_posts);
      } else {
        sendResponse({"Error": response.statusCode + ": " + body})
      }
    }
  );

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
    apiUrl: apiClientUrl
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
