const express = require("express");
const fs = require('fs');

// var configuration = JSON.parse(require('fs').readFileSync('./configuration.json', 'utf8'));
const ip = require("ip");
const address = ip.address("Wi-Fi");

fs.writeFileSync('./configuration.json', "{\"address\": \"" + address + "\"}");
console.log(address)

const bodyParser = require("body-parser");
var mongoose        = require('mongoose');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var cors = require('cors');

const app = express();
var options = {
    key: fs.readFileSync('privateKey.key'),
    cert: fs.readFileSync('certificate.crt')
};
const server = require('https').createServer(options,app);
io = require('socket.io')(server);

var redis = require('socket.io-redis');
//
io.adapter(redis({ host: address, port: 6379 }));

const port = 3000;
let timerId = null,
    sockets = new Set();
io.on('connection', socket => {
    socket.on('room',function (room) {
        for(oldRoom in socket.rooms){
            if(socket.id !== oldRoom){
                console.log("Leave old Room ",oldRoom);
                socket.leave(oldRoom);
            }
        }
        console.log(`Socket ${socket.id} added to room ${room.room}`);
        socket.join(room.room);
        // io.sockets.in(room).emit('users',{username:room.user});
    });

    socket.on('leave',function (room) {
        socket.leave(room);
    })
    // sockets.add(socket);
    console.log(`Socket ${socket.id} added`);
    //
    // if (!timerId) {
    //     startTimer();
    // }

    socket.on('clientdata', data => {
        console.log(data);
    });
    socket.on('message',data => {
        console.log(data.message);
    })

    socket.on('disconnect', () => {
        console.log(`Deleting socket: ${socket.id}`);
        sockets.delete(socket);
        console.log(`Remaining sockets: ${sockets.size}`);
    });

});

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
// var ws = require('./ws');
// app.use(express.static("client/dist"));
app.use(express.static(path.join(__dirname, 'client/dist/client')));

mongoose.connect("mongodb://mistabuga:dcn400@ds255970.mlab.com:55970/shoot-them-all",{useNewUrlParser: true});

require('./api/config/passport');



var routesApi = require('./api/routes/index');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(passport.initialize());


/* GET home page. */
app.use('/home', express.static(path.join(__dirname, 'client/dist/client')));
app.use('/registration', express.static(path.join(__dirname, 'client/dist/client')));
app.use('/login', express.static(path.join(__dirname, 'client/dist/client')));
app.use('/matchConfiguration', express.static(path.join(__dirname, 'client/dist/client')));
app.use('/matchInfo', express.static(path.join(__dirname, 'client/dist/client')));
app.use('/match', express.static(path.join(__dirname, 'client/dist/client')));

app.use('/api', routesApi);
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
//
// io.on('connection', function(socket){
//     console.log('a user connected');
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// [SH] Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
    }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// const usersRoutes = require('./routes/usersRoutes');
// const matchRoutes = require('./routes/matchesRoutes');
// const userDataRoutes = require('./routes/userDataRoutes');
//
// const usersRoutes = require('./routes/usersRoutes');

// usersRoutes(app); //register the route
// matchRoutes(app);
// userDataRoutes(app);

// userInMatchRoutes(app);
server.listen(port);