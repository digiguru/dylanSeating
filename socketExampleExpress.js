var express = require('express'),
    app = express.createServer(express.logger()),
    io = require('socket.io').listen(app);


var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var Plan = new Schema(),
    Table = new Schema(),
    Seat = new Schema(),
    Guest = new Schema();
    
Guest.add({
  id        : { type: Number, index: true },
  name      : String,
  x         : Number,
  y         : Number
});
Seat.add({
  id        : { type: Number, index: true },
  seatNumber: Number,
  guest     : [Guest]
});
Table.add({
  id        : Number,
  type      : String,
  x         : Number,
  y         : Number,
  seatCount : Number,
  seatList  : [Seat]
});
Plan.add({
  name      :  { type: Number, index: true },
  tableList : [Table],
  guestList : [Guest]
});

mongoose.connect('mongodb://localhost/digiguru_seating');

mongoose.model('Guest', Guest);
mongoose.model('Seat', Seat);
mongoose.model('Table', Table);
mongoose.model('Plan', Plan);


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
  
  
  var GetPlan = function (session,onFoundPlan) {
    
    
     // retrieve my model
      var MyPlan = mongoose.model('Plan');   
      // create a blog post
      //var plan = new MyPlan();
      console.log(session);
      MyPlan.find(session,function(err,savedPlanList) {
        if (err) {
          console.log(err);
        }else if (savedPlanList.length === 0) {
          console.log("OOps - no plan saved with these params");
        }else if (savedPlanList.length !== 1) {
          console.log("OOps - multiple plans - wait that can't happen!");
        } else {
          console.log("Found Plan");
          var savedPlan = savedPlanList[0];
          console.log(savedPlan);
          onFoundPlan(savedPlan);
        }
      });
    
    
  };
  
  socket.on('PlaceGuestOnNewSeat', function (data) {
    socket.broadcast.emit('PlaceGuestOnNewSeatResponse', data);
    planCollection.insertAll(data);
    console.log(data);
  });
  socket.on('UndoPlaceGuestOnNewSeat', function (data) {
    socket.broadcast.emit('UndoPlaceGuestOnNewSeatResponse', data); 
    //planCollection.insertAll(data);
    console.log(data);
  });
  socket.on('PlaceGuestOnSeat', function (data) {
    socket.broadcast.emit('PlaceGuestOnSeatResponse', data);
    
    /*
    // retrieve my model
    var Plan = mongoose.model('Plan');

    // create a blog post
    var plan = new Plan();

    // create a comment
    plan.comments.push({ title: 'My comment' });

    plan.save(function (err) {
      if (!err) console.log('Success!');
    });
    */
    console.log(data);
  });
  socket.on('UndoPlaceGuestOnSeat', function (data) {
    socket.broadcast.emit('UndoPlaceGuestOnSeatResponse', data); 
    planCollection.insertAll(data);
    console.log(data);
  });
  socket.on('SwapGuestWithGuest', function (data) {
    socket.broadcast.emit('SwapGuestWithGuestResponse', data); 
    planCollection.insertAll(data);
    console.log(data);
  });
  socket.on('UndoSwapGuestWithGuest', function (data) {
    socket.broadcast.emit('UndoSwapGuestWithGuestResponse', data); 
    planCollection.insertAll(data);
    console.log(data);
  });
  socket.on('AddSeatAtPosition', function (data) {
    socket.broadcast.emit('AddSeatAtPositionResponse', data); 
    planCollection.insertAll(data);
    console.log(data);
  });
  socket.on('UndoAddSeatAtPosition', function (data) {
    socket.broadcast.emit('UndoAddSeatAtPositionResponse', data); 
    planCollection.insertAll(data);
    console.log(data);
  });
  socket.on('AddTable', function (message) {
    socket.broadcast.emit('AddTableResponse', message.data); 
    /*
     // retrieve my model
    var MyPlan = mongoose.model('Plan');   
    // create a blog post
    //var plan = new MyPlan();
    console.log(message.plan);
    MyPlan.find(message.plan,function(err,savedPlanList) {
      if (err) {
        console.log(err);
      }else if (savedPlanList.length === 0) {
        console.log("OOps - no plan saved with these params");
      }else if (savedPlanList.length !== 1) {
        console.log("OOps - multiple plans - wait that can't happen!");
      } else {
        console.log("Found Plan");
        var savedPlan = savedPlanList[0];
        console.log(savedPlan);
        // create a comment
        savedPlan.tableList.push(message.data);
        savedPlan.save(function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log('Success adding table');
          }  
        });
      }
    });*/
    GetPlan(message.plan,function AddTableAction(savedPlan) {
        // create a comment
        savedPlan.tableList.push(message.data);
        console.log("now as long as : "+ savedPlan.tableList.length);
        savedPlan.save(function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log('Success adding table');
          }  
        });
    });
  });
  socket.on('UndoAddTable', function (data) {
    socket.broadcast.emit('UndoAddTableResponse', data); 
    planCollection.insertAll(data);
    console.log(data);
  });
  socket.on('AddGuest', function (data) {
    socket.broadcast.emit('AddGuestResponse', data); 
    planCollection.insertAll(data);
    console.log(data);
  });
  socket.on('UndoAddGuest', function (data) {
    socket.broadcast.emit('UndoAddGuestResponse', data); 
    planCollection.insertAll(data);
    console.log(data);
  });
  socket.on('MoveTable', function (data) {
    socket.broadcast.emit('MoveTableResponse', data); 
    planCollection.insertAll(data);
    console.log(data);
  });
  socket.on('UndoMoveTable', function (data) {
    socket.broadcast.emit('UndoMoveTableResponse', data); 
    planCollection.insertAll(data);
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