'use strict';
var path = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function (app) {

    var facebookConfig = app.getValue('env').FACEBOOK;

    var facebookCredentials = {
        clientID: facebookConfig.clientID,
        clientSecret: facebookConfig.clientSecret,
        callbackURL: facebookConfig.callbackURL
    };

    var verifyCallback = function (accessToken, refreshToken, profile, done) {

        UserModel.findOne({ 'facebook.id': profile.id }, function (err, user) {

            if (err) return done(err);

            if (user) {
                done(null, user);
            } else {
                UserModel.create({
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName,
                    email: profile.emails[0].value,
                    facebook: {
                        id: profile.id
                    }
                }).then(function (user) {
                    done(null, user);
                }, function (err) {
                    console.error('Error creating user from Facebook authentication', err);
                    done(err);
                });
            }

        });

    };

    passport.use(new FacebookStrategy(facebookCredentials, verifyCallback));

    app.get('/auth/facebook', passport.authenticate('facebook', {scope : 'email'}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function (req, res) {

            /*req.logIn(req.user, function (err) {
                
                if (err) return next(err);
                
                res.redirect('/');
            });*/

            res.redirect('/');
        });

};