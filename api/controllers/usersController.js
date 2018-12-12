var mongoose        = require('mongoose');
var User            = require('../models/users');

exports.listUsers = (req, res) => {
    var query = User.find({});
    query.exec(function(err, users){
        if(err)
            res.send(err);
        console.log(users)
        // If no errors are found, it responds with a JSON of all users
        res.json(users);
    });
};

exports.createUser = (req, res) => {
        // Creates a new User based on the Mongoose schema and the post bo.dy
        var newuser = new User(req.body);

        // New User is saved in the db.
        newuser.save(function(err){
            if(err){
                res.send(err);
            }else{
                // If no errors are found, it responds with a JSON of the new user
                res.json(req.body);
            }
        });
};

exports.readUser = (req, res) => {
    var query = User.findOne({
        username: req.params.userId
    });
    query.exec(function(err, user){
        if(err){
            res.send(err);
        }else{
            if(user){
                res.json({
                    name: user.name,
                    surname: user.surname,
                    username: user.username,
                    email: user.email,
                    score: user.score
                });
            }else{
                res.json("error");
            }
        }
    });
};

exports.checkUser = (req,res) => {
    var query = User.countDocuments({
        username: req.params.userId,
        password: req.body.password
    })
    query.exec(function (err,count) {
        if(err){
            res.send(err);
        }
        else {
            console.log(count);
            res.json({
                logged: count==1?true:false
            });
        }
    });
}
exports.updateUser = (req, res) => {
    var query = {
        username: req.params.userId,
    };
    User.findOneAndUpdate(query, {name:req.body.name,surname: req.body.surname,email: req.body.email}, function (err,user) {
        if (err) {
            return res.send(err)
        } else {
            res.json({
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
                score: user.score
            });
        }
    });
};

exports.userScore = (req,res) =>{
    var query = User.find({
        username: req.params.userId
    });

    query.exec(function(err, user){
        if(err)
            res.send(err);
        else{
            res.json({
                score: user[0].score
            });
        }

    });
}
exports.updateUserScore = (req, res) => {
    var query = {
        username: req.params.userId,
    };
    User.findOneAndUpdate(query, { $inc: {score: req.body.score} }, function (err,user) {
        if (err) {
            return res.send(err)
        } else {
            emitLeaderboard();
            res.json(user)
        }
    });
};
exports.leaderboard = (req, res) => {
    User
        .find()
        .sort({score: -1})
        .select({username:1,score:1})
        .exec(function(err, users){
            if(err)
                res.send(err);
            else{
                res.json(users);
            }
        });
}

function emitLeaderboard(){
    User
        .find()
        .sort({score: -1})
        .select({username:1,score:1})
        .exec(function(err, users){
            if(err){
            }
            else{
                io.emit('users-leaderboard',users);
            }
        });
}
exports.deleteUser = (req, res) => {
    var query = User.deleteOne({
        username: req.params.userId
    })
    query.exec(function (err,raw) {
       if(err)
           res.send(err)
        else
            res.send(raw)
    });
};