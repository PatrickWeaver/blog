const rp = require("request-promise");

// Conversion Tools:
const mediumToMarkdown = require("medium-to-markdown");
var TurndownService = require('turndown');
var turndownService = new TurndownService();

function importPost(source, url) {
  if (source === "medium") {
    return mediumToMarkdown.convertFromUrl(url)
    .then(function(markdown) {
      var title = markdown.slice(0, markdown.indexOf("\n"));
      var body = markdown.slice(markdown.indexOf("\n") + 1, markdown.length);
      post = {
        title: title,
        body: body
      }
      return post;
    })
    .catch(function(err) {
      console.log(err);
      // This should return the err but the server isn't set up to figure that out.
      return false;
    });
  } else if (source === "html") {
    var options = {
      url: url
    }
    return rp(options)
    .then(function (data) {
      var body = turndownService.turndown(data)
      post = {
        title: "",
        body: body
      }
      return post;
    })
    .catch(function (err) {
      console.log(err);
      // This should return the err but the server isn't set up to figure that out.
      return false;
    });
  } else {
    return (false);
  }
}

module.exports = {
  importPost: importPost
}
