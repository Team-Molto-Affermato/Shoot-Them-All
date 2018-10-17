module.exports = (app) => {

    const matchesController = require('../controllers/matchesController');

    app.route('/matches')
        .get(matchesController.listMatches)
        .post(matchesController.createMatch);
    app.route('/matches/range')
        .get(matchesController.listMatchesRange);

    app.route('/matches/:matchId')
        .get(matchesController.createMatch)
        .put(matchesController.createMatch)
        .delete(matchesController.createMatch);

};