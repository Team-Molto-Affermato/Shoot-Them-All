var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/registration', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

const matchRoutes = require('./matchesRoutes');

matchRoutes(router);
const usersRoutes = require('./usersRoutes');

usersRoutes(router); //register the route
module.exports = router;