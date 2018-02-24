const express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const rp = require("request-promise");

const apiOptions = {
  host: process.env.API_URL,
  port: process.env.API_PORT,
  path: "/blog"
};


module.exports = function() {

  var findByUsername = function(username, password, cb) {
    process.nextTick(function() {
      var body = {
        username: username,
        password: password
      }
      var options = {
        url: apiOptions.host + ":" + apiOptions.port + "/people/authenticate/",
        method: "POST",
        json: true,
        body: body
      }
      console.log(options.url);
      return rp(options)
      .then(function(data) {
        console.log(data);
        var user = {
          id: data.id,
          username: data.username,
          displayName: data.name,
          emails: [
            data.email
          ]
        }
        return cb(null, user);
      })
      .catch(function(err) {
        console.log(err);
        return cb(null, null);
      });
    });
  }


  passport.use(new Strategy(
    function(username, password, cb) {
      findByUsername(username, password, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        //if (user.password != password) { return cb(null, false); }
        return cb(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(user, cb) {
    cb(null, user);
  });

}
