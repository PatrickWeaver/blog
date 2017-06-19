// server.js

// init project
var express = require("express");
var app = express();
var hbs = require("hbs");
var http = require('http');

var port = 8106;

var options = {
  host: "localhost",
  port: 8000,
  path: "/data.json"
};

var api_data = {};

http.get(options, function(res){
  res.on("data", function(data){
    api_data = JSON.parse(data);
  });
}).on("error", function(error){
  console.log("Error: " + error);
});


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// https://www.npmjs.com/package/hbs
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', function(req, res) {

    res.locals = {
        title: ": Home",
        list: ["1", "2", "3"],
        posts: api_data.posts
    }

    res.render("index");
});

if (process.env.ENV === "DEV"){
  console.log("ENV IS: " + process.env.ENV);
} else {
  console.log("ENV IS NOT DEV");
  if (process.env.PORT){
    console.log(process.env.PORT);
    //port = process.env.PORT;
  }
}

// listen for requests :)

/*
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port + " or " + port);
});

*/

app.listen(port);
console.log('Running on http://localhost:' + port);
