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

  var records = [
    {
      id: 1,
      username: "admin",
      password: process.env.ADMIN_PASSWORD,
      displayName: 'Admin',
      emails: [
        {
          value: process.env.ADMIN_EMAIL
        }
      ]
    }
  ];

  var findById = function(id, cb) {
    process.nextTick(function() {
      var idx = id - 1;
      if (records[idx]) {
        cb(null, records[idx]);
      } else {
        cb(new Error('User ' + id + ' does not exist'));
      }
    });
  }


  var findByUsername = function(username, password, cb) {
    console.log(username);
    process.nextTick(function() {
      var body = {
        username: username,
        password: password
      }
      var options = {
        url: apiOptions.host + ":" + apiOptions.port + "/people"
      }
      return rp(options)
      .then(function(data) {
        console.log("Returned User DataS");
        var user_data = JSON.parse(data)[0];
        console.log(user_data);
        var user = {
          id: 1,
          username: user_data.username,
          displayName: user_data.name,
          emails: [
            user_data.email
          ]
        }
        console.log("**")
        console.log(user);
        return cb(null, user);
      })
      .catch(function(err) {
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
