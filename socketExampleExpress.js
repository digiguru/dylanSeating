var express = require('express'),
  app = express.createServer(express.logger())
  , io = require('socket.io').listen(app);

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/socketExampleClient.html');
});
app.get('/raphael.2.0.1.js', function (req, res) {
  res.sendfile(__dirname + '/raphael.2.0.1.js');
});
app.get('/dylanSeatingHitched.js', function (req, res) {
  res.sendfile(__dirname + '/dylanSeatingHitched.js');
});

io.sockets.on('connection', function (socket) {
  socket.on('PlaceGuestOnNewSeat', function (data) {
    socket.broadcast.emit('PlaceGuestOnNewSeatResponse', data); 
    console.log(data);
  });
  socket.on('UndoPlaceGuestOnNewSeat', function (data) {
    socket.broadcast.emit('UndoPlaceGuestOnNewSeatResponse', data); 
    console.log(data);
  });
  socket.on('PlaceGuestOnSeat', function (data) {
    socket.broadcast.emit('PlaceGuestOnSeatResponse', data); 
    console.log(data);
  });
  socket.on('UndoPlaceGuestOnSeat', function (data) {
    socket.broadcast.emit('UndoPlaceGuestOnSeatResponse', data); 
    console.log(data);
  });
  socket.on('SwapGuestWithGuest', function (data) {
    socket.broadcast.emit('SwapGuestWithGuestResponse', data); 
    console.log(data);
  });
  socket.on('UndoSwapGuestWithGuest', function (data) {
    socket.broadcast.emit('UndoSwapGuestWithGuestResponse', data); 
    console.log(data);
  });
  socket.on('AddSeatAtPosition', function (data) {
    socket.broadcast.emit('AddSeatAtPositionResponse', data); 
    console.log(data);
  });
  socket.on('UndoAddSeatAtPosition', function (data) {
    socket.broadcast.emit('UndoAddSeatAtPositionResponse', data); 
    console.log(data);
  });
  socket.on('AddTable', function (data) {
    socket.broadcast.emit('AddTableResponse', data); 
    console.log(data);
  });
  socket.on('UndoAddTable', function (data) {
    socket.broadcast.emit('UndoAddTableResponse', data); 
    console.log(data);
  });
  socket.on('AddGuest', function (data) {
    socket.broadcast.emit('AddGuestResponse', data); 
    console.log(data);
  });
  socket.on('UndoAddGuest', function (data) {
    socket.broadcast.emit('UndoAddGuestResponse', data); 
    console.log(data);
  });
  socket.on('MoveTable', function (data) {
    socket.broadcast.emit('MoveTableResponse', data); 
    console.log(data);
  });
  socket.on('UndoMoveTable', function (data) {
    socket.broadcast.emit('UndoMoveTableResponse', data); 
    console.log(data);
  });
  
  /*
  socket.on('AddRoundTable', function (data) {
    socket.broadcast.emit('AddRoundTableResponse', data); 
    console.log(data);
  });
  socket.on('AddDesk', function (data) {
    socket.broadcast.emit('AddDeskResponse', data); 
    console.log(data);
  });
  socket.on('AddGuest', function (data) {
    socket.broadcast.emit('AddGuestResponse', data); 
    console.log(data);
  });
  socket.on('PlaceGuestOnSeat', function (data) {
    socket.broadcast.emit('PlaceGuestOnSeatResponse', data); 
    console.log(data);
  });
  socket.on('SwapGuestWithSeat', function (data) {
    socket.broadcast.emit('SwapGuestWithSeatResponse', data);
    console.log(data);
  });
  socket.on('CreateSeatAndPlaceGuest', function (data) {
    socket.broadcast.emit('CreateSeatAndPlaceGuestResponse', data);
    console.log(data);
  });
  socket.on('AddSeatAtPosition', function (data) {
    socket.broadcast.emit('AddSeatAtPositionResponse', data);
    console.log(data);
  });
  socket.on('RemoveSeat', function (data) {
    socket.broadcast.emit('RemoveSeatResponse', data);
    console.log(data);
  });
  */
});