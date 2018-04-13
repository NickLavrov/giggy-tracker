/**
 * Copyright © 2018 Gigster, Inc. All Rights Reserved.
 *
 * This software and/or related documentation, is protected by copyright and
 * other intellectual property laws, and Gigster and/or its licensors, as
 * applicable, own all right, title and interest in and to its content, and all
 * derivatives, translations, adaptations and combinations of the foregoing. You
 * are not permitted to copy, distribute, transmit, store, display, perform,
 * reproduce, publish, license, create derivative works from, transfer, sell, or
 * make any other use of this software and/or related documentation unless you
 * have entered into a written agreement with Gigster regarding such usage. You
 * agree that all such usage of the software and/or related documentation shall
 * be subject to the terms and conditions of such written agreement, including
 * all applicable license restrictions.
 */

'use strict';

const debug = require('debug')('gdt:loopback:authentication');

module.exports = function(app) {
  var cookieParser = require('cookie-parser');
  var session = require('express-session');

  debug('Enabling Web interface');

  /*
  * body-parser is a piece of express middleware that
  *   reads a form's input and stores it as a javascript
  *   object accessible through `req.body`
  *
  */
  var bodyParser = require('body-parser');

  // Setup the view engine (jade)
  var path = require('path');
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // to support JSON-encoded bodies
  app.middleware('parse', bodyParser.json());
  // to support URL-encoded bodies
  app.middleware('parse', bodyParser.urlencoded({
    extended: true,
  }));

  const cookieSecret = process.env.COOKIE_SECRET ||
      '246bace2-38cb-4138-85d9-0ae8160b07c8';
  app.middleware('session:before', cookieParser(cookieSecret));

  const sessionSecret = process.env.SESSION_SECRET || 'kitty';
  app.middleware('session', session({
    secret: sessionSecret,
    saveUninitialized: true,
    resave: true,
  }));

  var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

  app.get('/', function(req, res, next) {
    res.render('pages/index', {user:
      req.user,
      url: req.url,
    });
  });

  app.get('/auth/account', ensureLoggedIn('/login'), function(req, res, next) {
    res.render('pages/loginProfiles', {
      user: req.user,
      url: req.url,
    });
  });

  app.get('/local', function(req, res, next) {
    res.render('pages/local', {
      user: req.user,
      url: req.url,
    });
  });

  app.get('/ldap', function(req, res, next) {
    res.render('pages/ldap', {
      user: req.user,
      url: req.url,
    });
  });

  app.get('/signup', function(req, res, next) {
    res.render('pages/signup', {
      user: req.user,
      url: req.url,
    });
  });

  app.post('/signup', function(req, res, next) {
    var User = app.models.user;

    var newUser = {};
    newUser.email = req.body.email.toLowerCase();
    newUser.username = req.body.username.trim();
    newUser.password = req.body.password;
    newUser.emailVerified = (!(app.get('emailVerificationRequired')));

    User.create(newUser, function(err, user) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      } else {
        // Passport exposes a login() function on req (also aliased as logIn())
        // that can be used to establish a login session. This function is
        // primarily used when users sign up, during which req.login() can
        // be invoked to log in the newly registered user.
        req.login(user, function(err) {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          return res.redirect('/auth/account');
        });
      }
    });
  });

  app.get('/login', function(req, res, next) {
    res.render('pages/login', {
      user: req.user,
      url: req.url,
    });
  });

  app.get('/auth/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
  });
};
