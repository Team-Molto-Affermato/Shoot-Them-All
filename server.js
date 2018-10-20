const express = require("express");
const bodyParser = require("body-parser");
var mongoose        = require('mongoose');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("client/dist/client"));
mongoose.connect("mongodb://localhost/ShootThemAll");

/* GET home page. */
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/src/index.html');
});

const usersRoutes = require('./routes/usersRoutes'); //importing route
const matchRoutes = require('./routes/matchesRoutes'); //importing route
const userInMatchRoutes = require('./routes/userInMatchRoutes');
usersRoutes(app); //register the route
matchRoutes(app);
// userInMatchRoutes(app);
app.listen(port);