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

// Libraries
const supertest = require('supertest');
const server = require('../../../server/server');

/**
 * This is testing the explorer redirect.
 */
describe('GET /explorer', () => {

  // --------------------------------------------------
  // Initialize
  // --------------------------------------------------
  set('app', () => server);

  // --------------------------------------------------
  // Request
  // --------------------------------------------------
  set('url', () => '/explorer');
  action('request', () => supertest(app).get(url));

  beforeEach(async () => {
    response = await request();
  });

  it('should return a 301 (redirect)', () => {
    expect(response.status).toEqual(301);
  });
});

/**
 * This is testing the explorer presence.
 */
describe('GET /explorer/', () => {
  
    // --------------------------------------------------
    // Initialize
    // --------------------------------------------------
    set('app', () => server);
  
    // --------------------------------------------------
    // Request
    // --------------------------------------------------
    set('url', () => '/explorer/');
    action('request', () => supertest(app).get(url));
  
    beforeEach(async () => {
      response = await request();
    });
  
    it('should return a 200', () => {
      expect(response.status).toEqual(200);
    });
  });
