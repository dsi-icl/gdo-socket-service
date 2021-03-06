var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors());

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');

const path = require('path');
const mime = require('mime');

app.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname, '/about.html'));
});

app.get('/socket.io.js', function(req, res, next) {
	res.setHeader("Content-Type", mime.lookup('.js'));
	res.sendFile(path.join(__dirname, 'node_modules', 'socket.io-client', 'dist', 'socket.io.js') );
});


var socket = io.of('/sharedsocket');
socket.on('connection', function(client) {
    var clientIP = client.request.connection.remoteAddress;
    console.log('Client '+ clientIP +' connected...');

	client.on('messages', function(data) {
      client.emit('broad', data);
      client.broadcast.emit('broad',data);
  });
});


server.listen(process.env.PORT || 8080);
