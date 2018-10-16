const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const usersRoutes = require('./routes/usersRoutes'); //importing route
usersRoutes(app); //register the route


app.listen(port);