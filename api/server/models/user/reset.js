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
const config = require('../../../server/config.json');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

module.exports = function(User) {
    // send password reset link when requested
  User.on('resetPasswordRequest', function(info) {
    const templateFilePath = path.join(__dirname, '../../../template/reset.ejs');

    const templateString = fs.readFileSync(templateFilePath, 'utf8');
    const html = ejs.render(templateString, {
      host: config.host,
      port: config.port,
      accessToken: process.env.AUTH_RESET_REDIRECT_ID || info.accessToken.id,
    });

    User.app.models.Email.send({
      to: info.email,
      from: config.emailSender,
      subject: config.resetEmailSubject,
      html,
    }, function(err) {
      if (err) return debug('> error sending password reset email');
      debug('> sending password reset email to:', info.email);
    });
  });
};
