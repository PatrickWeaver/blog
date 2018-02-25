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

    newTemplateData = {
        index: true,
        pagination: pagination,
        pageTitle: false,
        posts: posts
    }
    thisTemplateData = Object.assign({}, templateData(req.user), newTemplateData);
    res.render("index", thisTemplateData);
  })
  .catch(function(err) {
    res.send(String(err));
  });
});

// Get a single post with slug
router.get("/post/:slug/", function(req, res) {
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
    var post = data ? data[0] : false;

    if (post) {
      post = formatPost(post);
      newTemplateData = {
          pageTitle: post.title,
          post: post,
          hrBorderColors: hexcolors.hrBorderColor()
      }
      thisTemplateData = Object.assign({}, templateData, newTemplateData);
      res.render("post", thisTemplateData);
    } else {
      res.send("No post found.");
    }
  })
  .catch(function(err) {
    res.send(String(err));
  });
});

// New post form
router.get("/new/", function(req, res) {
  if (req.user && req.user.type === "admin"){
    newTemplateData = {
      pageTitle: "New",
      apiUrl: apiUrl,
      clientUrl: clientUrl,
      hrBorderColors: hexcolors.hrBorderColor()
    }
    thisTemplateData = Object.assign({}, templateData, newTemplateData);
    res.render("new", thisTemplateData);
  } else {
    res.redirect("/login");
  }

});

// Frontend Api:

router.post("/new/", function(req, res) {
  if (req.user && req.user.type === "admin") {
    requestBody = req.body;
    requestBody.api_key = req.user.apiKey;
    api.apiRequest({
      url: apiUrl + "/posts/new/",
      method: "POST",
      body: requestBody,
    })
    .then(function(apiResponse) {
      res.send(apiResponse);
    })
    .catch(function(err) {
      res.send("" + {"Error": err})
    });
  } else {
    res.status(403);
    res.send("Please login before posting");
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
