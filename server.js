const express = require("express");
const bodyParser = require("body-parser");
var mongoose        = require('mongoose');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var cors = require('cors');

const app = express();
const port = 3000;

app.use(express.static("client/dist/client"));
mongoose.connect("mongodb://localhost/ShootThemAll");

require('./config/passport');



var routesApi = require('./routes/index');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(passport.initialize());


/* GET home page. */
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/src/index.html');
});
app.use('/', routesApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// [SH] Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
    }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// const usersRoutes = require('./routes/usersRoutes');
// const matchRoutes = require('./routes/matchesRoutes');
// const userDataRoutes = require('./routes/userDataRoutes');
//
// usersRoutes(app); //register the route
// matchRoutes(app);
// userDataRoutes(app);

// userInMatchRoutes(app);
app.listen(port);