var db = require('../db');

module.exports = {
  messages: {
    get: function () {}, // a function which produces all the messages
    post: function () {} // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function (username, callback) {
      db.connect();

      // atempt to insert to DB
      var queryString = 'insert into users (name) values ("?")';
      var queryArgs = [username];

      dbConnection.query(queryString, queryArgs, function(err, results) {
        db.end();
        if (err) {
          callback(err);
        } else {
          callback(results.id);
        }
      });

    }
  },

  rooms: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }

};

