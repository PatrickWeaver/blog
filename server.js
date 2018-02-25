// server.js
const env = process.env.ENV;
const blogName = process.env.BLOGNAME;
// init project
const express = require("express");

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: process.env.AUTH_SECRET, resave: false, saveUninitialized: false }));

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

const hbs = require("hbs");
const http = require("http");

const hexcolors = require("./helpers/hexcolors");


const auth = require("./helpers/auth")();
const api = require("./helpers/api");
const importPost = require("./helpers/importPost").importPost;
const formatPost = require("./helpers/formatPost").formatPost;

//const port = 8106;
const port = process.env.PORT;

const apiOptions = {
  host: process.env.API_URL,
  port: process.env.API_PORT,
  version: "v" + process.env.API_VERSION,
  path: "/blog"
};

const clientOptions = {
  host: process.env.CLIENT_URL,
  port: process.env.CLIENT_PORT,
  path: ""
}

if (process.env.ENV == "DEV" || process.env.ENV == "GLITCH"){
  console.log("ENV IS: " + process.env.ENV);
} else {
  console.log("ENV IS NOT DEV");
  if (process.env.PORT){
    console.log("env port: " + process.env.PORT);
  }
}

const apiUrl = "" + apiOptions.host + ":" + apiOptions.port + "/" + apiOptions.version + apiOptions.path;
const clientUrl = "" + clientOptions.host + ":" + clientOptions.port + clientOptions.path;


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

function paginate(totalPosts, currentPage) {
  var pages = Math.ceil(parseInt(totalPosts) / 5);

  // 🚸 Should change this to use map
  var pagination = {};
  for (var i = 1; i <= pages; i++) {
    pagination[i] = {
      pageNumber: i
    }
    if (i === parseInt(currentPage)){
      pagination[i]["isCurrentPage"] = true;
    } else {
      pagination[i]["isCurrentPage"] = false;
    }
  }
  return pagination;
}

// Get list of posts, paginated with ?page=2
app.get('/', function(req, res) {
  // By default ask for the first page of results
  var query = {
    page: 1
  };
  // Check for a specified page in the query string
  if (req.query.page) {
    if (parseInt(req.query.page) > 0) {
      // If there is a queried page, replace default page 1
      query.page = req.query.page;
    }
  }

  // ask the API for list of posts
  api.apiRequest({
      url: apiUrl + "/posts",
      query: query
  })
  //apiUrl + "/posts", query)
  .then(function(apiResponse) {
    if (!apiResponse.response && !apiResponse.posts_list) {
      throw "No Response From API"
    }

    var posts = apiResponse.posts_list
    for (var p in posts) {
      posts[p] = formatPost(posts[p]);
    }

    // Figure out how many pages to display,
    // and which current page not to link to.
    var pagination = paginate(apiResponse.total_posts, apiResponse.page);

    res.locals = {
        index: true,
        pagination: pagination,
        mainTitle: blogName,
        pageTitle: false,
        posts: posts,
        hrBorderColors: hexcolors.hrBorderColor()
    }
    res.render("index");
  })
  .catch(function(err) {
    res.send(String(err));
  });
});

// Get a single post with slug
app.get("/post/:slug/", function(req, res) {
  var query = {
    slug: req.params.slug
  }
  api.apiRequest({
    url: apiUrl + "/post",
    query: query
  })
  .then(function(apiResponse) {
    // This will be unnecessary once the API is returning a post based on a slug query.
    var data = apiResponse.posts_list
    var post;
    if (data) {
      post = data[0];
    } else {
      post = false;
    }
    if (post) {
      post = formatPost(post);
      res.locals = {
          mainTitle: blogName,
          pageTitle: post.title,
          post: post,
          hrBorderColors: hexcolors.hrBorderColor()
      }

      res.render("post");
    } else {
      res.send("No post found.");
    }
  })
  .catch(function(err) {
    res.send(String(err));
  });
});

// New post form
app.get("/new/", function(req, res) {

  res.locals = {
    mainTitle: blogName,
    pageTitle: "New",
    apiUrl: apiUrl,
    clientUrl: clientUrl,
    hrBorderColors: hexcolors.hrBorderColor()
  }

  res.render("new");
});

app.post("/new/", function(req, res) {
  api.apiRequest({
    url: apiUrl + "/posts/new/",
    method: "POST",
    body: req.body,
  })
  .then(function(apiResponse) {
    res.send(apiResponse);
  })
  .catch(function(err) {
    res.send("" + {"Error": err})
  });

});


app.post("/import", function(req, res) {
  console.log("Starting import");
  var e = false;
  if (req.body) {
    if (req.body.url) {
      importPost(req.body.source, req.body.url)
      .then(function(importedPost) {
          console.log("Title");
          console.log(importedPost.title);
          console.log("Body");
          console.log(importedPost.body);
          res.send({
            title: importedPost.title,
            body: importedPost.body
          });
        }
      )
      .catch(function(err) {
          console.log("No return from import function");
          e = true;
        }
      )

    } else {
      console.log("No URL");
      e = true;
    }
  } else {
    console.log("No Body");
    e = true;
  }

  if (e) {
    res.send({title: "Error: " + e});
  }
});

// Admin
var adminRouter = require("./routes/admin")
app.use("/admin", adminRouter);
app.get("/login", function(req, res) {
  res.redirect("/admin/login");
});
app.get("/logout", function(req, res) {
  res.redirect("/admin/logout");
});

// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
