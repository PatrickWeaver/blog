// server.js
const env = process.env.ENV;
// init project
const express = require("express");
const app = express();
const hbs = require("hbs");
const http = require("http");
//const request = require("request");
const rp = require('request-promise');

const hexcolors = require("./helpers/hexcolors");
const dates = require("./helpers/dates");

const port = 8106;

const apiOptions = {
  host: process.env.API_URL,
  port: process.env.API_PORT,
  path: "/blog"
};

console.log("**");
console.log(process.env.API_URL);
console.log(process.env.API_PORT);
console.log("**");

if (process.env.ENV == "DEV"){
  console.log("ENV IS: " + process.env.ENV);
} else {
  console.log("ENV IS NOT DEV");
  if (process.env.PORT){
    console.log("env port: " + process.env.PORT);
    //port = process.env.PORT;
  }
}

const apiUrl = "http://" + apiOptions.host + ":" + apiOptions.port + apiOptions.path;

// I don't remember how clientAPI is supposed to be different changing to API_URL for now
const clientUrl = process.env.API_URL;
const apiClientUrl = "http://" + clientUrl + ":" + apiOptions.port + apiOptions.path;


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// https://www.npmjs.com/package/hbs
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
// Handlebars Partials:

if (env == "DEV"){
  app.get("*", function (req, res, next) {
    // Reload partials on root reload to upate.
    hbs.registerPartials(__dirname + '/views/partials');
    next();
  });
}

function apiRequest(res, subpath, query) {
  var options = {
    url: apiUrl + subpath,
    qs: query
  }




  /*
  request(
    options,
    function(error, response, body){
      var error = false;
      if(response.statusCode < 400){
        var apiResponse = JSON.parse(body);
        // 🚸 Should probably add something that indicates response type in API.
        if (apiResponse.posts_list.length > 1){
          sendIndexResponse(apiResponse);
        } else {
          // 🚸 Currently sending 1 post on idex page, change this to post page
          sendIndexResponse(apiResponse);
        }
      } else {
        error = true;
      }
      if (error){
        sendErrorResponse({"Error": response.statusCode + ": " + body})
      }
    }
  );
  */
  /*
  function sendErrorResponse(post_response) {
    res.send(post_response);
  }
  // 🚸 Separate out into Index and Post response?
  function sendIndexResponse(post_response) {
    var posts = post_response.posts_list
    for (var p in posts) {
      var post = posts[p];
      post.post_formatted_date = dates.formatDate(post.post_date);
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
        index: true,
        pagination: pagination,
        title: "",
        posts: posts,
        hrBorderColors: hexcolors.hrBorderColor()
    }
    res.render("index");


  }
  */
  res.send("apiRequest()");
}


app.get('/', function(req, res) {
  var query = {
    page: 1
  };
  if (req.query.page) {
    if (parseInt(req.query.page) > 0) {
  }
    query.page = req.query.page;
  }
  for (var i in query) {
    console.log(i + ": " + query[i]);
  }


  apiRequest(res, "/posts/", query);
});

app.get("/post/:number/", function(req, res) {
  var query = {};
  postNumber = req.params.number;

  // Use number to ask for a specific post from the full list
  apiRequest(res, "/post", query);

});


app.get("/new/", function(req, res) {

  res.locals = {
    title: "New",
    apiUrl: apiClientUrl
  }

  res.render("new");
})

// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port + " or " + port);
});
