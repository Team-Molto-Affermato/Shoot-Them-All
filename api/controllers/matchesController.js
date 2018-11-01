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

function startTimer() {
    //Simulate stock data received by the server that needs
    //to be pushed to clients
    timerId = setInterval(() => {
        if (!sockets.size) {
            clearInterval(timerId);
            timerId = null;
            console.log(`Timer stopped`);
        }
        let value = ((Math.random() * 50) + 1).toFixed(2);
        //See comment above about using a "room" to emit to an entire
        //group of sockets if appropriate for your scenario
        //This example tracks each socket and emits to each one
        for (const s of sockets) {
            console.log(`Emitting value: ${value}`);
            s.emit('data', { data: value });
        }

    }, 2000);
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
            res.json(newMatch);
    });
};

exports.readMatch = (req, res) => {

};

exports.updateMatch = (req, res) => {

};

exports.deleteMatch = (req, res) => {

};

