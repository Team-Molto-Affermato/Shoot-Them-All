var mongoose        = require('mongoose');
var Room            = require('../models/room');
var User            = require('../models/users');

var UserInMatch            = require('../models/userInMatch');
// const io = require('../../server').io;
var configuration = JSON.parse(require('fs').readFileSync('./configuration.json', 'utf8'));

var io = require('socket.io-emitter')({ host: configuration.address, port: 6379 });

exports.listMatches = (req, res) => {
    var query = Room.find({});
    query.exec(function(err, matches){
        if(err)
            res.send(err);
        else
            res.json(matches);
    });
};
function mapToPosition(item, index) {
    var position = item.location.coordinates
    return {
        username: item.name,
        position: {
            latitude:position[0],
            longitude:position[1]
        },
        team: item.team
    };
}
exports.deleteUserInMatch= (req,res)=>{
    var query1 = {
        roomName: req.params.roomName
    };
    Room.findOneAndUpdate(query1, { $pull: {users: req.params.username} },{new:true}, function (err,room) {
        if(err){
            return res.send(err);
        }else{
            // console.log(room.users);
            io.to(req.params.roomName).emit('users',{users:room.users});
        }
    });
    //Notificare
    var query = UserInMatch.deleteMany({
        roomName : req.params.roomName,
        name: req.params.username
    });
    query.exec({new:true},function (err,raw) {
        if(err)
            res.send(err)
        else{
            console.log(raw);
            var usersQuery = UserInMatch.find({
                roomName : req.params.roomName
                // location:{
                //     type: 'Point',
                //     coordinates:  { $ne: null }
                // }
            });
            usersQuery.exec(
                function (error,usersR) {
                    if(error){
                        res.send(error);

                    }else{
                        // console.log("Ciao");
                        // console.log(usersR);
                        var positions = [];
                        usersR.forEach(user =>{
                            if(user.location){
                                positions.push(mapToPosition(user));
                            }
                        });
                        // console.log(positions)
                        io.to(req.params.roomName).emit('users-pos',positions);
                        res.json(positions);
                    }
                }
            );
        }
    });
};
function startTimer(roomName) {
    //Simulate stock data received by the server that needs
    //to be pushed to clients
    setTimeout(() => {
        updateMatchState(roomName,"STARTED");
        io.to(roomName).emit('timeout',{message:"STARTED"});
    }, 60000);
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
function emitLeaderboard(){
    User
        .find()
        .sort({score: -1})
        .select({username:1,score:1,team:1})
        .exec(function(err, users){
            if(err){
            }
            else{
                io.emit('users-leaderboard',users);
            }
        });
}
function updateLeaderBoard(roomName) {
    var query = UserInMatch.find({
        roomName : roomName
    });
    query.exec(function(err, users){
        if(err){
        }else{
            users.forEach(user=>{
                var query = {
                    username: user.name
                };
                User.findOneAndUpdate(query, { $inc: {score: user.score} }, function (err,upUser) {
                });
            });
            emitLeaderboard();
        }
    });
}

function updateMatchState(roomName,state){
    var query = {
        roomName: roomName
    };
    Room.findOneAndUpdate(query, { state:state }, {upsert:true,new:true}, function (err,room) {
        if(err){

        }else{
            if(state==="ENDED"){
                console.log("Ciao Closed");
                getMatchesAndEmit();
                updateLeaderBoard(roomName);
            }else{
                getMatchesAndEmit();
                setTimeout(() => {
                    updateMatchState(roomName,"ENDED");
                    io.to(roomName).emit('timeout',{message:"ENDED"});
                }, room.duration*60000);
            }
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
            getMatchesAndEmit();
            res.json(req.body)
        }
    });
};

exports.addUserToMatch = (req,res)=>{

        var query = {
            roomName: req.params.roomName
        };
        Room.findOne(query,function (err,room) {
            if(err){
                return res.send(err);
            }else{
                if(room.users.includes(req.body.username)){
                    return res.status(401).send({error:"User already registred"});
                }
                if(room.state==='CLOSED'){
                    return res.status(406).send({error:"The match is closed"});
                }
                if(room.visibility==='Private'){
                    if(room.password!==req.body.password){
                        return res.status(401).send({error:"Wrong Match Password"});
                    }
                }
                if(room.users.length >= room.max_user){
                    return res.status(406).send({error:"The Room is full"});
                }
                var options = {new: true};
                Room.findOneAndUpdate(query, { $push: {users: req.body.username} },options, function (err,room) {
                    if (err) {
                        return res.send(err)
                    } else {
                        console.log(room.users);
                        io.to(req.params.roomName).emit('users',{users:room.users});
                        res.json(room)
                        var query1 = {
                            name: req.body.username,
                            roomName: req.params.roomName
                        };
                        UserInMatch.findOneAndUpdate(query1, { location: req.body.location ,score:req.body.score}, {upsert:true,new:true}, function (err,user) {
                            if (err) {

                            } else {
                            }
                        });
                    }
                });
            }
        });


}
function getMatchesAndEmit(){
    var query = Room.find({});
    query.exec(function(err, matches){
        if(err){
            // res.send(err);
        }
        else{
            io.emit('matches',{matches:matches});
        }
    });
}
exports.createMatch = (req, res) => {
    console.log(req.body);

    var b = req.body;

    const date = new Date();

    b.created_at = date;
    b.starting_time = new Date(date.getTime() + 60000);

    var newMatch = new Room(b);

    newMatch.save(function(err){
        if(err)
            res.status(400).send(err);
        else {
            getMatchesAndEmit();
            startTimer(req.body.roomName);
            res.json(newMatch);
        }

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
        else{
            getMatchesAndEmit();
            res.send(raw)
        }
    });
};

