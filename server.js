var http = require('http');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8888);

app.use(express.static(__dirname + '/client'));

// app.get('/', function (req, res) {
//   res.sendfile(__dirname + '/index.html');
// });

var deadline = 1401595200000;

//psuedo-database
var sockets = {};
var bids = {
  Spain: {
    team: 'Spain',
    currentBid: 550,
    player: 'Hamish'
  },
  Brazil: {
    team: 'Brazil',
    currentBid: 1500,
    player: 'Man'
  },
  Germany: {
    team: 'Germany',
    currentBid: 500,
    player: 'Man'
  },
  Argentina: {
    team: 'Argentina',
    currentBid: 600,
    player: 'Ronald'
  },
  Portugal: {
    team: 'Portugal',
    currentBid: 150,
    player: 'Hamish'
  },
  England: {
    team: 'England',
    currentBid: 150,
    player: 'Ronald'
  },
  France: {
    team: 'France',
    currentBid: 200,
    player: 'Hamish'
  },
  Belgium: {
    team: 'Belgium',
    currentBid: 200,
    player: 'Hamish'
  },
  Netherlands: {
    team: 'Netherlands',
    currentBid: 100,
    player: 'Hamish'
  },
  Italy: {
    team: 'Italy',
    currentBid: 150,
    player: 'Man'
  },
  Uruguay: {
    team: 'Uruguay',
    currentBid: 150,
    player: 'Ronald'
  }
};
var players = {};

io.on('connection', function (socket) {

  var broadcastBids = function(){
    io.emit('serverLoadBids', {bids: bids});
  };

  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('userLoadBids', function(){
    console.log('userLoadBids');
    socket.emit('serverLoadBids', {bids: bids});
  });

  socket.on('userLogin', function(data){
    sockets[socket.id] = data.name;
    console.log(sockets);
    socket.emit('serverLoadBids', {bids: bids});
  });

  socket.on('userStandardBid', function(data){
    console.log('userStandardBid');
    console.log(data);
    var player = sockets[socket.id];
    console.log(sockets);
    var team = data.team;
    if(bids[team].currentBid < 1000){
      var raise = 50;
    }else{
      var raise = 100;
    }

    bids[team].currentBid += raise;
    bids[team].player = player;
    broadcastBids();
  });

  socket.on('userBigBid', function(data){
    console.log('userBigBid');
    // console.log(data);
    var player = sockets[socket.id];
    var team = data.team;

    bids[team].currentBid = data.toAmount;
    bids[team].player = player;
    broadcastBids();
  });


});

io.on('disconnect', function(socket){
  console.log('disconnect');
  delete sockets[socket.id];
});
