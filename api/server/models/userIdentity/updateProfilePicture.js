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

module.exports = function(userIdentity) {
  userIdentity.observe('after save', (context, next) => {
    const userId = context.instance.userId;
    var profilePictureUrl = '';

    try {
      if (context.instance.provider === 'facebook') {
        profilePictureUrl = context.instance.profile.photos[0].value;
      } else if (context.instance.provider === 'google') {
        profilePictureUrl = context.instance.profile._json.picture;
      }
    } catch (error) {
      debug('error updating profile picture');
    }

    userIdentity.app.models.user.findById(userId, (err, user) => {
      if (err) return err;
      user.updateAttribute('profilePictureUrl', profilePictureUrl);
    });
    next();
  });
};
