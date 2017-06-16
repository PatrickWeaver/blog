// server.js

// init project
var express = require("express");
var app = express();
var hbs = require("hbs");

var port = 8106;

var posts = [];

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
        posts: posts
    }

    res.render("index");
});

if (process.env.PORT){
  port = process.env.PORT;
}

// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
