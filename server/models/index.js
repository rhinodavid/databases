var db = require('../db');
var Sequelize = require('sequelize');

var User = require('../db').User;
var Message = require('../db').Message;

module.exports = {
  messages: {
    get: function (options, callback) {
      Message.sync()
        .then(function() {
          return Message.findAll({raw: true});
        })
        .then(function(messages) {
          console.log(messages);
          callback(null, {results: messages});
          return;
        })
        .catch(function(err) {
          callback(err, null);
        });
    }, // a function which produces all the messages
    post: function(message, callback) {
      module.exports.users.post(message.username, function(err, result) {
        // get the id so we can push it with the message
        if (err) {
          callback(err, null);
        } else {
          Message.sync()
            .then(function() {
              return Message.create({
                userId: result.id,
                text: message.text,
                roomname: message.roomname
              });
            })
            .then(function(result) {
              callback(null, result);
            })
            .catch(function(err) {
              callback(err, null);
            });
        }
      });

    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function(username, callback) {
      User.sync()
        .then(function() {
          // find out if user exists
          // query with name .. if exists pass on id, if not create user
          return User.findAll({where: {username: username}, raw: true});
        })
        .then(function(users) {
          console.log(users);
          if (users.length === 0) {
            return User.create({username: username});
          } else {
            console.log('user 0: ', users[0]);
            return users[0];
          }
        })
        .then(function(result) {
          callback(null, result);
        }).catch(function(err) {
          callback(err, null);
        });
    }
  },

  rooms: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }

};

