var db = require('../db');

module.exports = {
  messages: {
    get: function (options, callback) {
      var queryString = 'select users.name as username, messages.* from messages inner join users on messages.user_id = users.id';
      db.query(queryString, function(err, results) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, results);
        }
      });
    

    }, // a function which produces all the messages
    post: function(message, callback) {
      // need user_id from username
      module.exports.users.post(message.username, function(err, results) {

        if (err) {
          callback(err, null);
        } else {
          var userId = results.insertId;
          var queryString = 'insert into messages (user_id, roomname, text) values (?, ?, ?)';
          var queryArgs = [userId, message.roomname, message.text];

          db.query(queryString, queryArgs, function(err, results) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, results);
            }
          });          
        }
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function(username, callback) {
      // atempt to insert to DB
      var queryString = 'insert into users (name) values (?) on \
        duplicate key update id = last_insert_id(id), name=?';

      var queryArgs = [username, username];

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

