const express = require("express");
const bodyParser = require("body-parser");
var mongoose        = require('mongoose');
//var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("client/dist/client"));
mongoose.connect("mongodb://localhost/ShootThemAll");

require('./api/config/passport');

app.use(passport.initialize());
app.use('/api', routesApi);

/* GET home page. */
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/src/index.html');
});

const usersRoutes = require('./routes/usersRoutes');
const matchRoutes = require('./routes/matchesRoutes');
const userDataRoutes = require('./routes/userDataRoutes');

usersRoutes(app); //register the route
matchRoutes(app);
userDataRoutes(app);

// userInMatchRoutes(app);
app.listen(port);