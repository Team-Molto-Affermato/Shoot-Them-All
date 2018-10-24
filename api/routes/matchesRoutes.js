module.exports = (app) => {
    var jwt = require('express-jwt');

    var auth = jwt({
        secret: 'MY_SECRET',
        userProperty: 'payload'
    });

    const matchesController = require('../controllers/matchesController');
    const userInMatchController = require('../controllers/userInMatchController');

    app.route('/matches')
        .get(matchesController.listMatches)
        .post(matchesController.createMatch);

    app.route('/matches/:roomName/users/')
        .get(userInMatchController.listUserInMatch)
        .post(matchesController.addUserToMatch);
    app.route('/matches/:roomName/state')
        .get(matchesController.matchState)
        .put(matchesController.setMatchState);
    app.route('/matches/:roomName/:username/score')
        .get(userInMatchController.userScore)
        .post(userInMatchController.updateUserScore);

    app.route('/matches/:roomName/users/range')
        .get(userInMatchController.listUserInMatchRange);

    app.route('/matches/:roomName/:username/pos')
        .put(userInMatchController.updateUserPos);

    app.route('/matches/range')
        .get(matchesController.listMatchesRange);

    app.route('/matches/:matchId')
        .get(matchesController.createMatch)
        .put(matchesController.createMatch)
        .delete(matchesController.createMatch);

};