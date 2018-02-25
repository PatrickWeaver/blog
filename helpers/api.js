const rp = require("request-promise");

function apiRequest({url, method = "GET", query = "", body = {}}) {
  var options = {
    url: url,
    method: method,
    qs: query
  }
  if (method === "POST" && body != {}) {
    options.body = JSON.stringify(body);
  }
  return rp(options)
  .then(function (apiResponse) {
    return JSON.parse(apiResponse);
  })
  .catch(function (err) {
    return err;
  });
}

module.exports = {
  apiRequest: apiRequest
}
