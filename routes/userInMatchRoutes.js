module.exports = (app) => {

    const userInMatchController = require('../controllers/userInMatchController');

    app.route('/matches/users/')
        .get(userInMatchController.listUserInMatch)
        .post(userInMatchController.createUserInMatch);
    app.route('/matches/users/range')
        .get(userInMatchController.listUserInMatchRange);

    app.route('/matches/user/pos')
        .put(userInMatchController.updateUserPos);

};