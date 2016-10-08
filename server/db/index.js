var Sequelize = require('sequelize');

module.exports.db = db = new Sequelize('chat', 'root', '', {host: 'localhost', dialect: 'mysql'});

module.exports.User = db.define('User', {
  username: Sequelize.STRING
});

module.exports.Message = db.define('Message', {
  userId: Sequelize.INTEGER,
  text: Sequelize.STRING,
  roomname: Sequelize.STRING
});



if (!module.parent) {
  // set up database
  module.exports.User.sync({force: true})
    .then(function() {
      console.log('Set up User');
      return module.exports.Message.sync({force: true});
    })
    .then(function() {
      console.log('Set up Message');
      return;
    })
    .catch(function(err) {
      console.log('Error setting up tables');
      console.log(err);
      return;
    });
}