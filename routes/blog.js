const port = process.env.PORT;
const env = process.env.ENV;

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

var express = require("express");
var router = express.Router();

const api = require("../helpers/api");
const importPost = require("../helpers/importPost").importPost;

const formatPost = require("../helpers/formatPost").formatPost;
const paginate = require("../helpers/pagination").paginate;
const templateData = require("../helpers/templateData").populate;

const apiUrl = "" + apiOptions.host + ":" + apiOptions.port + "/" + apiOptions.version + apiOptions.path;
const clientUrl = "" + clientOptions.host + ":" + clientOptions.port + clientOptions.path;

// Get list of posts, paginated with ?page=2
router.get('/', function(req, res) {
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

  console.log(apiUrl);
  // ask the API for list of posts
  api.apiRequest({
      url: apiUrl + "/posts",
      query: query
  })
  //apiUrl + "/posts", query)
  .then(function(apiResponse) {
    apiResponse = JSON.parse(apiResponse);
    if (!apiResponse || !apiResponse.posts_list) {
      throw "No Response From API"
    }

    var posts = apiResponse.posts_list
    for (var p in posts) {
      posts[p] = formatPost(posts[p]);
    }

    // Figure out how many pages to display,
    // and which current page not to link to.
    var pagination = paginate(apiResponse.total_posts, apiResponse.page);

    var newTemplateData = {
        index: true,
        pagination: pagination,
        pageTitle: false,
        posts: posts
    }
    var thisTemplateData = Object.assign({}, templateData(req.user), newTemplateData);
    res.render("index", thisTemplateData);
  })
  .catch(function(err) {
    console.log("Catch: " + err);
    var error = "API Error";
    if (env === "DEV" || env === "GLITCH"){
      error = err;
    }
    var thisTemplateData = Object.assign({}, templateData(req.user), {error: error});
    res.render("error", thisTemplateData);
  });
});

var postRouter = require("./post");
router.use("/post", postRouter);


// New post form
router.get("/new/", function(req, res) {
  if (req.user && req.user.type === "admin"){
    var newTemplateData = {
      pageTitle: "New",
      clientUrl: clientUrl
    }
    var thisTemplateData = Object.assign({}, templateData(req.user), newTemplateData);
    res.render("new", thisTemplateData);
  } else {
    res.redirect("/login");
  }

});

// Frontend Api sends to post router:
router.post("/new/", function(req, res, next) {
  if (req.body && req.body.slug) {
    req.url = "/post/" + req.body.slug + "/";
    router.handle(req, res, next);
  } else {
    res.send({"Error": "No slug"});
  }
});


router.post("/import", function(req, res) {
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


module.exports = router
