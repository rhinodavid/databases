var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {}, // a function which handles a get request for all messages
    post: function (req, res) {} // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {
      // Get the username from the request body
      var username = req.body.username;
      // send the username to the model
      models.users.post(username, function(error, data) {
        if (error) {
          throw error; // FIXME
        } else {
          res.status(201).send({ id: data.id });
        }
      });
      //Expect the userId back 

      // send that to response

    }
  }
};

