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

const formatPost = require("../helpers/formatPost").formatPost;
const templateData = require("../helpers/templateData").populate;

const apiUrl = "" + apiOptions.host + ":" + apiOptions.port + "/" + apiOptions.version + apiOptions.path;
const clientUrl = "" + clientOptions.host + ":" + clientOptions.port + clientOptions.path;

function getPostTemplate(post) {
  return {
      pageTitle: post.title,
      post: post
  }
}

function postAPIOptions(slug) {
  return {
    url: apiUrl + "/post",
    query: {
      slug: slug
    }
  }
}

function getPost(apiResponse) {
  // This will be unnecessary once the API is returning a post based on a slug query.
  var data = apiResponse.posts_list
  var post = data ? formatPost(data[0]) : false;
  return post;
}

function invalidPost(req, res, error) {
  var thisTemplateData = Object.assign({}, templateData(req.user), {error: error});
  res.render("error", thisTemplateData)
}

// Placeholder for unused route
router.get("/", function(req, res) {
  res.redirect("/");
});

// Get a single post with slug
router.get("/:slug/", function(req, res) {
  var slug = req.params.slug;
  api.apiRequest(postAPIOptions(slug))
  .then(function(apiResponse) {
    var post = getPost(apiResponse);
    if (post) {
      var thisTemplateData = Object.assign({}, templateData(req.user), getPostTemplate(post));
      res.render("post", thisTemplateData);
    } else {
      throw "No post at /post/" + slug;
    }
  })
  .catch(function(err) {
    invalidPost(req, res, err);
  });
});

// Edit Post:
router.get("/:slug/edit/", function(req, res) {
  if (!req.user || req.user.type != "admin"){
    res.redirect("/login/");
  } else {
    var slug = req.params.slug;
    api.apiRequest(postAPIOptions(slug))
    .then(function(apiResponse) {
      var post = getPost(apiResponse);
      if (post) {
        var thisTemplateData = Object.assign({}, templateData(req.user), getPostTemplate(post));
        res.render("edit-post", thisTemplateData);
      } else {
        throw "No post at /post/" + slug;
      }
    })
    .catch(function(err) {
      invalidPost(req, res, err);
    });
  }
});

router.post("/:slug/edit/", function(req, res) {
  if (req.user && req.user.type === "admin") {
    requestBody = req.body;
    requestBody.api_key = req.user.apiKey;
    api.apiRequest({
      url: apiUrl + "/post/" + req.params.slug + "/edit/",
      method: "POST",
      body: requestBody,
    })
    .then(function(apiResponse) {
      res.send(apiResponse);
    })
    .catch(function(err) {
      console.log(err);
      res.status(403);
      res.send({"Error": ""});
    });
  } else {
    res.status(403);
    invalidPost(req, res, "Please log in before editing.");
  }
});

router.get("/:slug/delete/", function(req, res) {
  if (req.user && req.user.type === "admin") {
    requestBody = req.body;
    requestBody.api_key = req.user.apiKey;
    api.apiRequest({
      url: apiUrl + "/post/" + req.params.slug + "/delete/",
      method: "POST",
      body: requestBody,
    })
    .then(function(apiResponse) {
      res.send(apiResponse);
    })
    .catch(function(err) {
      console.log(err);
      res.status(403);
      res.send({"Error": ""});
    });
  } else {
    res.status(403);
    invalidPost(req, res, "Please log in before deleting.")
  }
});

module.exports = router
