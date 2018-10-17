const express = require("express");
const bodyParser = require("body-parser");
var mongoose        = require('mongoose');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("client/dist/client"));
mongoose.connect("mongodb://192.168.1.15/ShootThemAll");

/* GET home page. */
app.get('*', function(req, res) {
    res.sendFile(__dirname + '/client/src/index.html');
});

const usersRoutes = require('./routes/usersRoutes'); //importing route
const matchRoutes = require('./routes/matchesRoutes'); //importing route

usersRoutes(app); //register the route
matchRoutes(app);

app.listen(port);