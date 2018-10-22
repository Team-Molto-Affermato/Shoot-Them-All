var mongoose        = require('mongoose');
var UserInMatch            = require('../models/userInMatch');

exports.listUserInMatch = (req, res) => {
    var query = UserInMatch.find({
        roomName : req.params.roomName
    });
    query.exec(function(err, users){
        if(err)
            res.send(err);
        else
            res.json(users);
    });
};
exports.addUser = (req,res) =>{
    var qu
}

exports.listUserInMatchRange = (req,res)=> {
    var lat =    Number(req.query.lat);
    var lon =    Number(req.query.lon);
    console.log(lat,lon);
    var query = UserInMatch
        .where({roomName: req.params.roomName})
        .where('location').within({ center: [lon,lat], radius: 1, unique: true, spherical: true });
    query.exec(function (err,users) {
        if(err) res.send(err)
        else  res.json(users)
    });
};



exports.readMatch = (req, res) => {

};
exports.userScore = (req,res) =>{
    var query = UserInMatch.find({
        name: req.params.username,
        roomName: req.params.roomName
    });
    console.log(req.params.username)
    console.log(req.params.roomName)

    query.exec(function(err, user){
        if(err)
            res.send(err);
        else
            res.json(user);
    });
}
exports.updateUserScore = (req, res) => {
    var query = {
        name: req.params.username,
        roomName: req.params.roomName
    };
    UserInMatch.findOneAndUpdate(query, { $inc: {score: req.body.score} }, {upsert:true}, function (err,user) {
        if (err) {
            return res.send(err)
        } else {
            res.json(user)
        }
    });
};

exports.updateUserPos = (req, res) => {
    var query = {
        name: req.params.username,
        roomName: req.params.roomName
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