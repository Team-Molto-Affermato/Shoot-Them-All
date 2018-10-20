var mongoose        = require('mongoose');
var UserInMatch            = require('../models/userInMatch');

exports.listUserInMatch = (req, res) => {
    var query = UserInMatch.find({
        roomName : req.query.roomName
    });
    // console.log(req.roomName)
    query.exec(function(err, users){
        if(err)
            res.send(err);

        // If no errors are found, it responds with a JSON of all users
        res.json(users);
    });
};
exports.listUserInMatchRange = (req,res)=> {
    var query = UserInMatch.
        where('location').within({ center: req.query.location, radius: 10, unique: true, spherical: true });
    query.exec(function (err,users) {
        if(err) res.send(err)
        else  res.json(users)
    });
};



exports.readMatch = (req, res) => {

};

exports.updateUserPos = (req, res) => {
    var query = {
        name: req.body.name,
        roomName: req.body.roomName
    };
    UserInMatch.findOneAndUpdate(query, { location: req.body.location }, {upsert:true}, function (err,user) {
        if (err) {
            return res.send(err)
        } else {
            res.json(req.body)
        }
    });
};

exports.deleteMatch = (req, res) => {

};