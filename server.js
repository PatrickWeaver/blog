// server.js

// init project
var express = require("express");
var app = express();
var hbs = require("hbs");

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// https://www.npmjs.com/package/hbs
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.get('/', function(req, res) {

    res.locals = {
        title: ": Home",
        list: ["1", "2", "3"]
    }

    res.render("index");
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
