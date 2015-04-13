/**
 * Created by pedro on 02/04/15.
 */
var express = require('express');
var router = express.Router();
var models = require('../models');
var flash = require('connect-flash');
var passport = require('passport')
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

/*
passport configuration
 */
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    var ServerUser = models('ServerUser').model;
    ServerUser.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
        clientID: '417715196602-43jmuqo7n8uhefe6a084ijl3jgn1s0vh.apps.googleusercontent.com',
        clientSecret: 'qYV7the8x_hYuARV2XY_wjak',
        callbackURL: 'http://www.remax-vivant.com:3000/auth/google/return'
    },
    function(accessToken, refreshToken, profile, done) {
        var ServerUser = models('ServerUser').model;
        ServerUser.findOne({email:profile.emails[0].value, active:true}, function (err, user) {
            var errMessage = { message: '' };
            if (user === null) {
                errMessage = { message: 'Unauthorized User' };
            }
            done (err, user, errMessage);
        });
    }
));
/*
end passport configuration
 */
router.use (flash());
router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));

router.get('/google/return',
    passport.authenticate('google', { failureRedirect: '/auth/login', failureFlash: true }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/auth/logged');
    });

router.get('/logged', function (req, res, next) {
    if (!req.user) {
        res.redirect('/auth/login');
    }
    if (req.session.urlAfterLogin) {
        res.redirect (req.session.urlAfterLogin);
    }
    //res.send ('hoorray you\'re Logged');
});
router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/auth/login');
});
router.get('/login', function (req, res, next) {
    res.render ('auth/login', {loggedout:true});
    /*
    var errMessage = "";
    if (req.session.flash && req.session.flash.error[0]) {
        errMessage = req.session.flash.error[0] + "<br/>";
        req.session.flash.error.splice (0, 1);
    }
    res.send (errMessage + '<a href="/auth/google">Sign In with Google</a>');
    */
});
module.exports = router;