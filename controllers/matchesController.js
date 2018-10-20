var mongoose        = require('mongoose');
var Room            = require('../models/room');
var UserInMatch            = require('../models/userInMatch');

exports.listMatches = (req, res) => {
    var query = Room.find({});
    query.exec(function(err, matches){
        if(err)
            res.send(err);

        // If no errors are found, it responds with a JSON of all users
        res.json(matches);
    });
};
exports.listMatchesRange = (req,res)=> {
    var query = Room.where('location').within({ center: req.query.location, radius: 10, unique: true, spherical: true });
    query.exec(function (err,rooms) {
        if(err) res.send(err)
        else  res.json(rooms)
    });
};

exports.createMatch = (req, res) => {
    var newMatch = new Room(req.body);

    newMatch.save(function(err){
        if(err)
            res.send(err);
        else
        // If no errors are found, it responds with a JSON of the new user
        res.json(req.body);
    });
};

exports.readMatch = (req, res) => {

};

exports.updateMatch = (req, res) => {

};

exports.deleteMatch = (req, res) => {

};

