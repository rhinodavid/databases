/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require('request'); // You might need to npm install the request module!
var expect = require('chai').expect;

describe('Persistent Node Chat Server', function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: '',
      database: 'chat'
    });
    dbConnection.connect();

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query('truncate ' + 'messages', done);
    // dbConnection.query('truncate ' + 'users', done);

  });

  afterEach(function() {
    dbConnection.end();
  });

  it('Should insert posted messages to the DB', function(done) {
    // Post the user to the chat server.
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/users',
      json: { username: 'Valjean' }
    }, function () {
      // Post a message to the node chat server:
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/messages',
        json: {
          username: 'Valjean',
          text: 'In mercy\'s name, three days is all I need.',
          roomname: 'Hello'
        }
      }, function () {
        // Now if we look in the database, we should find the
        // posted message there.

        // TODO: You might have to change this test to get all the data from
        // your message table, since this is schema-dependent.
        var queryString = 'SELECT * FROM messages';
        var queryArgs = [];

        dbConnection.query(queryString, queryArgs, function(err, results) {
          // Should have one result:
          expect(results.length).to.equal(1);

          // TODO: If you don't have a column named text, change this test.
          expect(results[0].text).to.equal('In mercy\'s name, three days is all I need.');

          done();
        });
      });
    });
  });

  it('Should output all messages from the DB', function(done) {
    // Let's insert a message into the db
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Valjean',
        text: 'All the Twix are gone!',
        roomname: 'main'
      }}, function() {
        // Now query the Node chat server and see if it returns
        // the message we just inserted:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messageLog = JSON.parse(body).results;
        expect(messageLog[0].text).to.equal('All the Twix are gone!');
        expect(messageLog[0].roomname).to.equal('main');
        done();
      });
    });
  });

  it('Should respond with an object with an error property on error', function(done) {
  // Send a message with no text
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Valjean',
        // text property is required but missing - should throw an error
        roomname: 'main'
      }}, function(error, response, body) {
      // json - sets body to JSON representation of value and adds Content-type: application/json header. 
      // Additionally, parses the response body as JSON.
      expect(body.error).to.exist;
      done();
    });
  }); 
});

