/**
 * Created by pedro on 02/04/15.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport')
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    done (null, null);
    /*
    User.findById(id, function(err, user) {
        done(err, user);
    });
    */
});

passport.use(new GoogleStrategy({
        clientID: '417715196602-43jmuqo7n8uhefe6a084ijl3jgn1s0vh.apps.googleusercontent.com',
        clientSecret: 'qYV7the8x_hYuARV2XY_wjak',
        callbackURL: 'http://www.remax-vivant.com:3000/auth/google/return'
    },
    function(accessToken, refreshToken, profile, done) {
        console.log (accessToken);
        console.log (refreshToken);
        console.log (profile);
        done (null, profile);
/*
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
        */

    }
));

router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));

router.get('/google/return',
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/auth/logged');
    });

router.get('/logged', function (req, res, next) {
    res.send ('hoorray you\'re Logged');
});
router.get('/login', function (req, res, next) {
    res.send ('<a href="/auth/google">Sign In with Google</a>');
});
module.exports = router;