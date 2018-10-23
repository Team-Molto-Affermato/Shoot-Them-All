module.exports = (app) => {

    const usersController = require('../controllers/userDataController');

    app.route('/userData')
        .post(usersController.checkUser);

};