const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const {
    User
} = require('../storage/schema.js');

// Use the GoogleStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a token, tokenSecret, and Google profile), and
// invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: '373889620044-slgl11ptcn23jrhgltpm6u0dokps41pd.apps.googleusercontent.com',
    clientSecret: 'IWIhU7FrGsOzvm3y6rzb3EYZ',
    callbackURL: 'http://localhost:8080/auth/google/callback'
},
    function (accessToken, refreshToken, profile, done) {
        User.findOne({
            email: profile.emails[0].value
        }, function (err, user) {
            if (user == null) {
                console.log(profile);
                let newUser = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    thumbnail: profile._json.picture
                }).save();
                done(null, newUser);
            } else {
                console.log(user);
                done(null, user);
            }
        });
    }
));

// GET /auth/google
// Use passport.authenticate() as route middleware to authenticate the
// request.  The first step in Google authentication will involve
// redirecting the user to google.com.  After authorization, Google
// will redirect the user back to this application at /auth/google/callback
router.get('/google/login',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

// GET /auth/google/callback
// Use passport.authenticate() as route middleware to authenticate the
// request.  If authentication fails, the user will be redirected back to the
// login page.  Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/failure'
    }),
    function (req, res) {
        res.redirect('http://localhost:3000/');
    });

router.get('/success', (req, res) => {
    res.send("Logged in");
});

router.get('/failure', (req, res) => {
    res.send("Log in failed");
});

router.get('/google/login/verify', (req, res) => {
    if (req.user) {
        res.json({
            message: "User Authenticated",
            user: req.user
        })
    }
    else {
        res.status(401).json({
            message: "User Not Authenticated",
            user: null
        })
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:3000/');
});

module.exports = router;