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

var GetPlan = function (session,onFoundPlan) {
    
    
     // retrieve my model
      var MyPlan = mongoose.model('Plan');   
      // create a blog post
      //var plan = new MyPlan();
      console.log("finding plan");
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
  
  

io.sockets.on('connection', function (socket) {
  
  
  socket.on('GetPlan', function (message) {
    GetPlan(message.plan,function GetPlanAction(savedPlan) {  
        // push table to our plan
        socket.emit('GetPlanResponse', savedPlan);
    
        savedPlan.tableList.push(message.data);
        console.log("now as long as : "+ savedPlan.tableList.length);
        savedPlan.save();
    });
    console.log(message.data);
  });
  
  socket.on('DeletePlanData', function (message) {
    console.log("deltePlanData" + message);
    GetPlan(message.plan,function DeletePlanDataAction(savedPlan) {  
        console.log("deltePlanData" + savedPlan);
        // push table to our plan
        savedPlan.tableList = [];
        socket.broadcast.emit('GetPlanResponse', savedPlan);
        savedPlan.save();
    });
    console.log(message.data);
  });
  
  
  socket.on('PlaceGuestOnNewSeat', function (message) {
    socket.broadcast.emit('PlaceGuestOnNewSeatResponse', message.data);
    console.log(message.data);
  });
  socket.on('UndoPlaceGuestOnNewSeat', function (message) {
    socket.broadcast.emit('UndoPlaceGuestOnNewSeatResponse', message.data); 
    console.log(message.data);
  });
  socket.on('PlaceGuestOnSeat', function (message) {
    
    
    socket.broadcast.emit('PlaceGuestOnSeatResponse', message.data);
    
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
    console.log(message.data);
  });
  socket.on('UndoPlaceGuestOnSeat', function (message) {
    socket.broadcast.emit('UndoPlaceGuestOnSeatResponse', message.data); 
    console.log(message.data);
  });
  socket.on('SwapGuestWithGuest', function (message) {
    socket.broadcast.emit('SwapGuestWithGuestResponse', message.data); 
    console.log(message.data);
  });
  socket.on('UndoSwapGuestWithGuest', function (message) {
    socket.broadcast.emit('UndoSwapGuestWithGuestResponse', message.data); 
    console.log(message.data);
  });
  socket.on('AddSeatAtPosition', function (message) {
    socket.broadcast.emit('AddSeatAtPositionResponse', message.data); 
    console.log(message.data);
  });
  socket.on('UndoAddSeatAtPosition', function (message) {
    socket.broadcast.emit('UndoAddSeatAtPositionResponse', message.data); 
    console.log(message.data);
  });
  socket.on('AddTable', function (message) {
    socket.broadcast.emit('AddTableResponse', message.data); 
    GetPlan(message.plan,function AddTableAction(savedPlan) {  
        // push table to our plan
        savedPlan.tableList.push(message.data);
        console.log("now as long as : "+ savedPlan.tableList.length);
        savedPlan.save();
    });
  });
  socket.on('UndoAddTable', function (message) {
    socket.broadcast.emit('UndoAddTableResponse', message.data);
    GetPlan(message.plan,function RemoveTableAction(savedPlan) {  
        // push table to our plan
        console.log(message.data);
        savedPlan.tableList.remove(message.data);
        console.log("Down to : "+ savedPlan.tableList.length);
        savedPlan.save();
    });
    console.log(message.data);
  });
  socket.on('AddGuest', function (message) {
    socket.broadcast.emit('AddGuestResponse', message.data); 
    GetPlan(message.plan,function AddGuestAction(savedPlan) {  
        // push table to our plan
        savedPlan.guestList.push(message.data);
        console.log("now as long as : "+ savedPlan.guestList.length);
        savedPlan.save();
    });
  });
  socket.on('UndoAddGuest', function (message) {
    socket.broadcast.emit('UndoAddGuestResponse', message.data);
    GetPlan(message.plan,function RemoveTableAction(savedPlan) {  
        // push table to our plan
        console.log(message.data);
        savedPlan.guestList.remove(message.data);
        console.log("Down to : "+ savedPlan.guestList.length);
        savedPlan.save();
    });
    console.log(message.data);
  });
  socket.on('MoveTable', function (message) {
    socket.broadcast.emit('MoveTableResponse', message.data); 
    console.log(message.data);
  });
  socket.on('UndoMoveTable', function (message) {
    socket.broadcast.emit('UndoMoveTableResponse', message.data); 
    console.log(message.data);
  });
  
});