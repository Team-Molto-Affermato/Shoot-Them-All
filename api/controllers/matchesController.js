var mongoose        = require('mongoose');
var Room            = require('../models/room');
var UserInMatch            = require('../models/userInMatch');

exports.listMatches = (req, res) => {
    var query = Room.find({});
    query.exec(function(err, matches){
        if(err)
            res.send(err);
        else
            res.json(matches);
    });
};
exports.listMatchesRange = (req,res)=> {
    var lat =    Number(req.query.lat);
    var lon =    Number(req.query.lon);
    var query = Room.where('location').within({ center: [lon,lat], radius: req.query.radius, unique: true, spherical: true });
    query.exec(function (err,rooms) {
        if(err) res.send(err)
        else  res.json(rooms)
    });
};

exports.matchState = (req,res) =>{
        var query = Room.findOne({
            roomName : req.params.roomName
        });
        query.exec(function(err, state){
            if(err)
                res.send(err);
            else
                res.json({
                    state: state.state
                });
        });
}

exports.setMatchState = (req, res) => {
    var query = {
        roomName: req.params.roomName
    };
    Room.findOneAndUpdate(query, { state: req.body.state }, {upsert:true}, function (err,user) {
        if (err) {
            return res.send(err)
        } else {
            res.json(req.body)
        }
    });
};

exports.addUserToMatch = (req,res)=>{
        console.log("Ciao");
        var query = {
            roomName: req.params.roomName
        };
        Room.findOneAndUpdate(query, { $push: {users: req.body.username} }, function (err,room) {
            if (err) {
                return res.send(err)
            } else {
                res.json(room)
            }
        });
}
exports.createMatch = (req, res) => {
    console.log(req.body)
    var newMatch = new Room(req.body);
    newMatch.save(function(err){
        if(err)
            res.send(err);
        else
            res.json(req.body);
    });
};

exports.readMatch = (req, res) => {

};

exports.updateMatch = (req, res) => {

};

exports.deleteMatch = (req, res) => {

};

