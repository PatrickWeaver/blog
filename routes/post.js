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

const formatPost = require("../helpers/formatPost").formatPost;
const templateData = require("../helpers/templateData").populate;

const apiUrl = "" + apiOptions.host + ":" + apiOptions.port + "/" + apiOptions.version + apiOptions.path;
const clientUrl = "" + clientOptions.host + ":" + clientOptions.port + clientOptions.path;


// Placeholder for unused route redirect to all posts route in blog router
router.get("/", function(req, res) {
  res.redirect("/");
});

var slug = "";
router.all("/:slug", function(req, res, next) {
  slug = req.params.slug;
  var method = req.method;
  if (method != "GET") {
    // Reject requests to create, update or delete unless admin:
    if (!req.user || req.user.type != "admin"){
      res.status(403);
      res.json({error: "Please login before posting"});
      return;
    }
  }
  next();
});

// Get a single post with slug
router.get("/:slug", function(req, res) {
  sendTemplateWithPostData(req, res, "post");
});

// Edit Post:
router.get("/:slug/edit/", function(req, res, next) {
  if (!req.user || req.user.type != "admin"){
    res.redirect("/login/");
  } else {
    sendTemplateWithPostData(req, res, "edit-post");
  }
});

function sendTemplateWithPostData(req, res, template){
  api.apiRequest({
    url: apiUrl + "/post/" + slug + "/",
    method: "GET"
  })
  .then(function(apiResponse) {
    console.log(apiResponse);
    var post = getPost(apiResponse);
    var thisTemplateData = Object.assign({}, templateData(req.user), getPostTemplate(post));
    res.render(template, thisTemplateData);
  })
  .catch(function(err) {
    invalidPost(req, res, err);
  });
}

// Create a new post:
router.post("/:slug/", function(req, res, next) {
  sendChangeToAPI(req, res, "POST");
});

// Edit a post:
router.post("/:slug/edit/", function(req, res, next) {
  sendChangeToAPI(req, res, "PUT");
});
// Delete a post:
router.get("/:slug/delete/", function(req, res) {
  sendChangeToAPI(req, res, "DELETE");
});

function sendChangeToAPI(req, res, method) {
  var requestBody = Object.assign({}, req.body, {api_key: req.user.apiKey});
  api.apiRequest({
    url: apiUrl + "/post/" + req.params.slug + "/",
    method: method,
    body: requestBody
  })
  .then(function(apiResponse) {
    res.send(JSON.parse(apiResponse));
  })
  .catch(function(err) {
    res.send("" + {"Error": err})
  });
}

function getPostTemplate(post) {
  return {
      pageTitle: post.title,
      post: post
  }
}

function getPost(apiResponse) {
  // This will be unnecessary once the API is returning a post based on a slug query.
  var data = JSON.parse(apiResponse);
  var post = data ? formatPost(data) : false;
  return post;
}

function invalidPost(req, res, error) {
  //console.log(error);
  error = env === "DEV" || env === "GLITCH" ? error : "Invalid Post";
  var thisTemplateData = Object.assign({}, templateData(req.user), {error: error});
  res.render("error", thisTemplateData)
}

module.exports = router
