var mongoose        = require('mongoose');
var User            = require('../models/user');

exports.listUsers = (req, res) => {
    var query = User.find({});
    query.exec(function(err, users){
        if(err)
            res.send(err);

        // If no errors are found, it responds with a JSON of all users
        res.json(users);
    });
};

exports.createUser = (req, res) => {
        console.log(req)
        // Creates a new User based on the Mongoose schema and the post bo.dy
        var newuser = new User(req.body);

        // New User is saved in the db.
        newuser.save(function(err){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);
        });
};

exports.readUser = (req, res) => {

};

exports.updateUser = (req, res) => {

};

exports.deleteUser = (req, res) => {

};