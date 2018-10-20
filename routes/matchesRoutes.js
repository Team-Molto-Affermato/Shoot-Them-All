module.exports = (app) => {

    const matchesController = require('../controllers/matchesController');
    const userInMatchController = require('../controllers/userInMatchController');

    app.route('/matches')
        .get(matchesController.listMatches)
        .post(matchesController.createMatch);

    app.route('/matches/users/')
        .get(userInMatchController.listUserInMatch)
        .post(userInMatchController.updateUserPos);

    app.route('/matches/users/range')
        .get(userInMatchController.listUserInMatchRange);

    app.route('/matches/user/pos')
        .put(userInMatchController.updateUserPos);
    app.route('/matches/range')
        .get(matchesController.listMatchesRange);

    app.route('/matches/:matchId')
        .get(matchesController.createMatch)
        .put(matchesController.createMatch)
        .delete(matchesController.createMatch);

};