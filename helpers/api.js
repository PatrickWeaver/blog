const rp = require("request-promise");

function apiRequest({url, method = "GET", query = "", body = {}}) {
  var options = {
    url: url,
    method: method,
    qs: query
  }
  if ((method === "POST" || method === "PUT") && body != {}) {
    options.body = JSON.stringify(body);
  }
  return Promise.all([rp(options)]);
}

module.exports = {
  apiRequest: apiRequest
}
