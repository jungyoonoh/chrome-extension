var express  = require('express');
var router   = express.Router();
var passport = require('../config/passport.js');

const authSuccess = (req,res) => {
    res.redirect('/');
  }

router.get('/login', (req,res) => {
  res.render('auth/login');
});

router.get('/logout', (req,res) =>  {
  req.logout();
  res.redirect('/');
});

router.get('/google',
  passport.authenticate('google', { scope: ['profile'] })
);

router.get('/google/callback',
  passport.authenticate('google'), authSuccess
);

module.exports = router;