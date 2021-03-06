var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(null, function(err, results) {
        if (err) {
          res.status(400).send({error: err});
        } else {
          res.status(200).send({results: results});
        }

      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {

      var message = {
        username: req.body.username,
        text: req.body.text,
        roomname: req.body.roomname
      };

      models.messages.post(message, function(err, results) {
        if (err) {
          res.status(400).send({error: err});
        } else {
          res.status(201).send({results: { id: results.insertId, createdAt: results.createdAt }});
        }
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {
      // Get the username from the request body
      var username = req.body.username;
      // send the username to the model
      models.users.post(username, function(err, results) {        
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).end({error: err}.message = 'User already exists.');
            return;
          }
          res.status(400).end({error: err});
        } else {
          res.status(201).send({results: { id: results.insertId }});
        }
      });
    }
  }
};

