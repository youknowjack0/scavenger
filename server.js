var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var scavenger = require('./server/scavenger.js').createServer(io);

server.listen(80);

