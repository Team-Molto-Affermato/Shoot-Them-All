module.exports = (app) => {

    const usersController = require('../controllers/usersController');

    app.route('/users')
        .get(usersController.listUsers)
        .post(usersController.createUser);

    app.route('/users/score')
        .get(usersController.leaderboard);
    app.route('/users/:userId')
        .get(usersController.readUser)
        .put(usersController.updateUser)
        .delete(usersController.deleteUser);
    app.route('/users/:userId/score')
        .get(usersController.userScore)
        .put(usersController.updateUserScore);

    app.route('/users/:userId/login')
        .post(usersController.checkUser);
};