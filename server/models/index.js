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
      // atempt to insert to DB
      var queryString = 'insert into users (name) values ("?")';
      var queryArgs = [username];

      db.query(queryString, queryArgs, function(err, results) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, results);
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

