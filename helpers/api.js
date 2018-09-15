const rp = require("request-promise");

function apiRequest({url, method = "GET", query = "", body = false, formData = false}) {
  console.log("Url: " + url);
  console.log("Method: " + method);

  var options = {
    url: url,
    method: method,
    qs: query
  }
  if (method === "GET") {
    return Promise.all([rp(options)]);
  } else if (method === "POST") {
    // New Post:
    if (body) {
      console.log(body);
      console.log(typeof body);
      for (var i in body) {
        console.log(i + ": " + body[i])
      }
      options.body = JSON.stringify(body);
      return Promise.all([rp(options)]);
    // Image Upload:
    } else if (formData) {
      console.log("FORM!!");
      for (var i in formData) {
        console.log(i);
        console.log(formData[i]);
        console.log("--");
      }
      options.formData = formData;
      return Promise.all([rp(options)]);
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
