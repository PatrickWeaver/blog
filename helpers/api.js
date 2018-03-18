const rp = require("request-promise");

function apiRequest({url, method = "GET", query = "", body = {}, formData = {}}) {
  var options = {
    url: url,
    method: method,
    qs: query
  }
  if (method === "GET" || method === "DELETE"){
    return Promise.all([rp(options)]);
  } else if (method === "POST" || method === "PUT") {
    if (body != {}) {
      options.body = JSON.stringify(body);
      return Promise.all([rp(options)]);
    } else if (formData != {}) {
      return Promise.all([rp(options, formData)]);
    } else {
      console.log("ELSEING!")
      return Promise.reject("Not new post, edit post, delete post or file upload");
    }
  } else {
    return Promise.reject("Not GET, POST, PUT or DELETE");
  }

}

module.exports = {
  apiRequest: apiRequest
}
