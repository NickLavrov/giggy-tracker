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

/*
 * @see http://apidocs.strongloop.com/loopback-datasource-juggler/#datasource-prototype-automigrate
 */
const server = require('../server/server.js');

// datasources names is provided by the gig.yaml
const datasources = [];
datasources.forEach(name => {
  const datasource = server.dataSources[name];
  if (datasource) {
    console.log(`Starting creating the database for datasource ${name}`);
    datasource.automigrate((error, result) => {
      if (error) {
        console.log('Error while creating the database ' + error);
        throw error;
      }
      console.log(`Done creating the database for datasource ${name}`);
      datasource.disconnect();
    });
  }
});
