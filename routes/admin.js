const blogName = process.env.BLOGNAME;

var express = require("express");
var router = express.Router();
var passport = require('passport');

const hexcolors = require("../helpers/hexcolors");
const templateData = require("../helpers/templateData").populate;

function getColors(td) {
  td.hrBorderColors = hexcolors.hrBorderColor();
  return td;
}

router.get('/', function(req, res) {
  if (req.user) {
    res.redirect(req.baseUrl + '/profile');
  } else {
    res.redirect(req.baseUrl + '/login');
  }
});

router.get('/login',
  function(req, res){
    if (!req.user){
      var thisTemplateData = Object.assign({}, templateData(req.user));
      res.render('login', thisTemplateData);
    } else {
      res.redirect(req.baseUrl + '/profile');
    }
  }
);

router.post('/login',
  passport.authenticate('local', { failureRedirect: 'login/invalid' }),
  function(req, res) {
    res.redirect(req.baseUrl + '/profile');
  }
);


router.get('/login/invalid', function(req, res){
  console.log("Invalid");
  res.send('<h1>Invalid Login</h1><a href="./">Login</a>');
});


router.get('/logout', function(req, res){
  req.logout();
  res.redirect(req.baseUrl + '/login');
});


router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn('login'),
  function(req, res){
    var thisTemplateData = Object.assign({}, templateData(req.user));
    res.render('profile', thisTemplateData);
  }
);


module.exports = router
