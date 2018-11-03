var mongoose        = require('mongoose');
var Room            = require('../models/room');
var UserInMatch            = require('../models/userInMatch');
// const io = require('../../server').io;
var io = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });

exports.listMatches = (req, res) => {
    var query = Room.find({});
    query.exec(function(err, matches){
        if(err)
            res.send(err);
        else
            res.json(matches);
    });

};

function startTimer(roomName) {
    //Simulate stock data received by the server that needs
    //to be pushed to clients
    setTimeout(() => {
        updateMatchState(roomName,"STARTED");
        io.to(roomName).emit('timeout',{message:"The game is starting"});

    }, 10000);
}
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
                res.status(400).send(err);
            else
                res.json({
                    state: state.state
                });
        });
}
function updateMatchState(roomName,state){
    var query = {
        roomName: roomName
    };
    Room.findOneAndUpdate(query, { state:state }, {upsert:true,new:true}, function (err,room) {
        if(err){

        }else{
            setTimeout(() => {
                updateMatchState(roomName,"CLOSED");
                io.to(roomName).emit('timeout',{message:"End of the Match"});
            }, room.duration*60000);
        }
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
        var options = {new: true};
        Room.findOneAndUpdate(query, { $push: {users: req.body.username} },options, function (err,room) {
            if (err) {
                return res.send(err)
            } else {
                io.to(req.params.roomName).emit('users',{users:room.users});
                res.json(room)
            }
        });
}
exports.createMatch = (req, res) => {
    console.log(req.body)
    var newMatch = new Room(req.body);

    newMatch.save(function(err){
        if(err)
            res.status(400).send(err);
        else
            startTimer(req.body.roomName);
            res.json(newMatch);
    });
};

exports.readMatch = (req, res) => {
    var query = Room.findOne({
        roomName : req.params.matchId
    });
    query.exec(function(err, match){
        if(err)
            res.status(400).send(err);
        else
            res.send(match);
    });
};

exports.updateMatch = (req, res) => {

};

exports.deleteMatch = (req, res) => {
    var query = Room.deleteOne({
        roomName : req.params.matchId
    })
    query.exec(function (err,raw) {
        if(err)
            res.send(err)
        else
            res.send(raw)
    });
};

