// server.js
var express = require('express');  
var app = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io=require('socket.io')(httpServer);

var port = 5005; 

app.use(express.static(__dirname));

app.get('/', function(req, res) {  
        res.sendFile(__dirname + '/index.html');
});

httpServer.listen(port);  
console.log('Server available at http://localhost:' + port);  
var led;
var ledState = false;

//Arduino board connection
var board = new five.Board();  
board.on("ready", function() {  
    console.log('Arduino connected');
    led = new five.Led(13);
});


//Socket connection handler
io.on('connection', function (socket){  
        console.log(socket.id);
        var sendSocketState = function(broadcast){
            var msg = (ledState) ? 'state:on' : 'state:off';
            socket.broadcast.emit(msg);
            socket.emit(msg);
        }

        socket.on('led:on', function (data){
           console.log('LED ON RECEIVED');
           led.on();
           ledState = true;
           sendSocketState(true);
        });

        socket.on('led:off', function (data){
            console.log('LED OFF RECEIVED');
            led.off();
            ledState = false;
            sendSocketState(true);
        });

        sendSocketState();

    });

console.log('Waiting for connection');