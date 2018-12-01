var mongoose        = require('mongoose');
var UserInMatch            = require('../models/userInMatch');
var User = require('../models/users');
var configuration = JSON.parse(require('fs').readFileSync('./configuration.json', 'utf8'));
console.log(configuration.address);
var io = require('socket.io-emitter')({ host: configuration.address, port: 6379 });

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
async function emitLeaderboard(roomName){
    // var find = UserInMatch
    //     .find({
    //         roomName : roomName
    //     })
    //     .sort({score: -1})
    //     .select({name:1,score:1,team:1})
    //     .exec(function(err, users){
    //         if(err){
    //         }
    //         else{
    //             var usersScore = [];
    //             users.forEach(user =>{
    //                     usersScore.push(mapToScore(user));
    //             });
    //             io.to(roomName).emit('users-score',usersScore);
    //         }
    //     });
    const leaderboard = await UserInMatch
        .find({
            roomName : roomName
        },{new:true})
        .sort({score: -1})
        .select({name:1,score:1,team:1})
        .exec();
    // console.log(leaderboard);
    var usersScore = [];
    for(i = 0;i< leaderboard.length;i++){
        const temp = await mapUser(leaderboard[i]);
        usersScore.push(temp);
    }
    console.log("emit",usersScore);
    io.to(roomName).emit('users-score',usersScore);
}
exports.leaderboard = async (req, res) => {
    // const leaderboard = await UserInMatch.find({}).exec();
    const leaderboard = await UserInMatch
        .find({
            roomName : req.params.roomName
        })
        .sort({score: -1})
        .select({name:1,score:1,team:1})
        .exec();
    // console.log(leaderboard);
    var usersScore = [];
    for(i = 0;i< leaderboard.length;i++){
        const temp = await mapUser(leaderboard[i]);
        usersScore.push(temp);
    }
    res.json(usersScore);
};
async function mapUser(user){
    const scoreG = await User.findOne({username: user.name}).select({score:1}).exec();
    var temp = mapToScore(user);
    temp.scoreG = scoreG.score;
    return temp;
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
    UserInMatch.findOneAndUpdate(query, { $inc: {score: req.body.score} }, {upsert:true,new:true}, function (err,users) {
        if (err) {
            return res.send(err)
        } else {
            emitLeaderboard(req.params.roomName);
            res.json(mapToScore(users));
            // const usersScore = users.map(mapToScore);
            // io.to(req.params.roomName).emit('users-score',usersScore);
        }
    });
};
function mapToScore(item, index) {
    var score = item.score
    return {
        username: item.name,
        score: score,
        team: item.team
    };
}

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

exports.updateUserPos = (req, res) => {

    var query = {
        name: req.params.username,
        roomName: req.params.roomName
    };
    // console.log(req.body.location);
    UserInMatch.findOneAndUpdate(query, { location: req.body.location }, {upsert:true,new:true}, function (err,userPos) {
        if (err) {
            return res.send(err)
        } else {

            UserInMatch
                .find({
                    roomName : req.params.roomName,
                    location: { $ne: null }
                })
                .where()
                .exec(function(error, users){
                    if(error)
                        res.send(error);
                    else{
                        var positions = [];
                        users.forEach(user =>{
                            positions.push(mapToPosition(user));
                        });
                        io.to(req.params.roomName).emit('users-pos',positions);
                        res.json(positions);
                    }
                });
        }
    });


};

exports.deleteMatch = (req, res) => {

};