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
  var loopback = require('loopback');

  // Passport configurators..
  var loopbackPassport = require('loopback-component-passport');
  var PassportConfigurator = loopbackPassport.PassportConfigurator;
  var passportConfigurator = new PassportConfigurator(app);

  // The access token is only available after boot
  app.middleware('auth', loopback.token({
    model: app.models.accessToken,
  }));

  /**
   * Flash messages for passport
   *
   * Setting the failureFlash option to true instructs Passport to flash an
   * error message using the message given by the strategy's verify callback,
   * if any. This is often the best approach, because the verify callback
   * can make the most accurate determination of why authentication failed.
   */
  var flash = require('express-flash');
  app.use(flash());

  passportConfigurator.init();
  passportConfigurator.setupModels({
    userModel: app.models.user,
    userIdentityModel: app.models.userIdentity,
    userCredentialModel: app.models.userCredential,
  });

  // attempt to build the providers/passport config
  const providers = require('./providers.json');
  const providersConfig = app.get('providers');

  // we have some providers configured
  if (providersConfig) {
    Object.keys(providersConfig).forEach((key) => {
      debug(`Configuring authentication provider ${key}`);

      debug(`Validating configuration for provider ${key}`);
      let isValidConfiguration = true;

      Object.keys(providersConfig[key]).forEach((configKey) => {
        if (!providersConfig[key][configKey]) {
          debug(`The configuration ${key}.${configKey} is not set`);
          isValidConfiguration = false;
        }
      });

      if (isValidConfiguration) {
        debug(`Adding authentication provider ${key}`);
        const mergedProvider = Object.assign(
          providers[key],
          providersConfig[key]);
        mergedProvider.session = providers[key].session !== false;
        passportConfigurator.configureProvider(key, mergedProvider);
      } else {
        debug(`Ignoring authentication provider ${key}`);
      }
    });
  }
};
