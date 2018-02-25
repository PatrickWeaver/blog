const rp = require("request-promise");

function apiRequest(url, query) {
  var options = {
    url: url,
    qs: query
  }
  console.log(options.url);
  return rp(options)
  .then(function (apiResponse) {
    return JSON.parse(apiResponse);
  })
  .catch(function (err) {
    //console.log(err);
    return err;
  });
}

module.exports = {
  apiRequest: apiRequest
}
