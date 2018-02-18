// server.js
const env = process.env.ENV;
const blogName = process.env.BLOGNAME;
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

if (process.env.ENV == "DEV"){
  console.log("ENV IS: " + process.env.ENV);
} else {
  console.log("ENV IS NOT DEV");
  if (process.env.PORT){
    console.log("env port: " + process.env.PORT);
  }
}

const apiUrl = "" + apiOptions.host + ":" + apiOptions.port + apiOptions.path;


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// https://www.npmjs.com/package/hbs
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
// Handlebars Partials:
hbs.registerPartials(__dirname + '/views/partials');

if (env == "DEV"){
  app.get("*", function (req, res, next) {
    // Reload partials on root reload to upate.
    hbs.registerPartials(__dirname + '/views/partials');
    next();
  });
}

function apiRequest(path, query) {
  var options = {
    url: apiUrl + path,
    qs: query
  }
  return rp(options)
  .then(function (apiResponse) {
    return JSON.parse(apiResponse);
  })
  .catch(function (err) {
    console.log(err);
    return err;
  });
}

function formatPost(post) {
  post.formatted_date = dates.formatDate(post.post_date);
  post.show_read_more = true;
  if (post.full_post_in_preview && post.summary === "") {
    post.show_read_more = false;
  }
  return post;
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
  apiRequest("/posts", query)
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
  apiRequest("/post", query)
  .then(function(apiResponse) {
    // This will be unnecessary once the API is returning a post based on a slug query.
    var data = apiResponse.posts_list
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
    hrBorderColors: hexcolors.hrBorderColor()
  }

  res.render("new");
})

// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port + " or " + port);
});
