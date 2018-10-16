module.exports = (app) => {

    const usersController = require('../controllers/usersController');

    app.route('/users')
        .get(usersController.listUsers)
        .post(usersController.createUser);


    app.route('/users/:userId')
        .get(usersController.readUser)
        .put(usersController.updateUser)
        .delete(usersController.deleteUser);

};