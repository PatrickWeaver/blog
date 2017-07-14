// server.js

// init project
const express = require("express");
const app = express();
const hbs = require("hbs");
const http = require("http");
const request = require("request");
var marked = require("marked");
https://www.npmjs.com/package/marked
// 🚸 Look into marked options
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});
const hexcolors = require("./helpers/hexcolors");
const constants = require("./helpers/constants");
const monthNames = constants.monthNames;

const port = 8106;

const apiOptions = {
  host: process.env.API_URL,
  port: process.env.API_PORT,
  path: "/blog/posts/"
};

const apiUrl = "http://" + apiOptions.host + ":" + apiOptions.port + apiOptions.path;

const clientUrl = process.env.CLIENT_API;
const apiClientUrl = "http://" + clientUrl + ":" + apiOptions.port + apiOptions.path;


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// https://www.npmjs.com/package/hbs
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
// Handlebars Partials:
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', function(req, res) {
  var apiData = {
    page: 1
  }
  if (req.query.page){
    if (parseInt(req.query.page) > 0) {
  }
    apiData.page = req.query.page;
  }

  var api_posts = {};
  var hrBorderColors = hexcolors.hrBorderColor();

  request(
    {
      url: apiUrl,
      qs: apiData
    },
    function(error, response, body){
      if(response.statusCode < 400){
        sendResponse(JSON.parse(body));
      } else {
        sendResponse({"Error": response.statusCode + ": " + body})
      }
    }
  );

  function sendResponse(post_response) {
    var posts = post_response.posts_list
    for (post in posts) {
      var rawDate = new Date(posts[post].post_date);
      var formattedDate = "";
      formattedDate += monthNames[rawDate.getMonth()] + " " + rawDate.getDate() + ", " + rawDate.getFullYear();
      posts[post].post_formatted_date = formattedDate;
      posts[post].post_body_marked = marked(posts[post].post_body);
    }
    var pages = Math.ceil(parseInt(post_response.total_posts) / 5)
    var pagination = {};
    for (var i = 1; i <= pages; i++) {
      pagination[i] = {
        pageNumber: i
      }
      if (i === parseInt(post_response.page)){
        pagination[i]["isCurrentPage"] = true;
      } else {
        pagination[i]["isCurrentPage"] = false;
      }
    }
    res.locals = {
        pagination: pagination,
        title: "",
        posts: posts,
        hrBorderColors: hrBorderColors
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
