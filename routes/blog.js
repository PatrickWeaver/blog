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

const multer = require("multer");
const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({
	storage: memoryStorage,
	limits: {
		filesize: 20*1024*1024,
		files: 1
	}
}).single("file");

const uuidv1 = require('uuid/v1');
const streamifier = require('streamifier');

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

router.post("/file-upload", memoryUpload, function(req, res) {
  if (!req.file) {
    res.status(400);
    res.send({error: "No file was uploaded."});
    return;
  }

  var file = req.file;
  var fileUuid = uuidv1();

  console.log("typeof:")
  console.log(typeof file)

  var uploadData = {
    file: {
      value: file.buffer,
      options: {
        filename: fileUuid + "-" + file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        size: file.size
      }
    },
    filetype: "" + file.mimetype,
    uuid: fileUuid,
    filename: fileUuid + "-" + file.originalname
  }

  api.apiRequest({
      url: apiUrl + "/uploads/new/",
      method: "POST",
      formData: uploadData
  })
  .then(function(apiResponse) {
    apiResponse = JSON.parse(apiResponse);
    console.log(apiResponse);
    if (!apiResponse || !apiResponse[0].upload_url) {
      throw "No Response From API"
    }

    var upload_url = apiResponse[0].upload_url
    res.status(200);
    res.json({url: upload_url});
  })
  .catch(function(err) {
    console.log("Catch: " + err);
    var error = "API Error";
    if (env === "DEV" || env === "GLITCH"){
      error = err;
    }
    res.status(400);
    res.json({error: error});
  });
});


module.exports = router
