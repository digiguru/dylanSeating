/*jslint nomen: true, plusplus: true */
/*jshint strict:false */
/*global require, process, console, __dirname */
/**
 * @license DylanSeating v1
 *
 * (c) 2011-2012 by digiguru (Adam Hall)
 *
 * License: Creative Commons 3.0 (http://creativecommons.org/licenses/by-nc/3.0/)
 **/


const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const _ = require("underscore");
const sq = require("./seatQuerying.js");


var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var Guest = new Schema({
    id        : { type: Number, index: true },
    name      : String,
    x         : Number,
    y         : Number
}),
    Seat = new Schema({
        id        : { type: Number, index: true },
        seatNumber: Number,
        guest     : [Guest] //HACK - not correct - needs to be single, not array. Stupid MongoDB
    //  guest     : { type: Guest} 
    }),
    Table = new Schema({
        id        : Number,
        type      : String,
        x         : Number,
        y         : Number,
        seatCount : Number,
        seatList  : [Seat]
    }),
   
    Plan = new Schema({
        name      :  { type: Number, index: true },
        tableList : [Table],
        guestList : [Guest]
    });
    
//Guest.add();
//Seat.add();

//Seat.virtual('guest') 
//   .set(function(guest) { this._guests[0] = guest; }) 
//   .get(function() { return this._guests.first(); });

   //Virtual to get the array as a single object
   //http://stackoverflow.com/questions/7744271/how-do-you-define-a-nested-object-to-an-existing-schema-in-mongoose
//Table.add();
//Plan.add();

mongoose.connect(process.env.MONGOATLAS_CONNECTION, {                
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
});//'mongodb://localhost/digiguru_seating');


mongoose.model('Guest', Guest);
mongoose.model('Seat', Seat);
mongoose.model('Table', Table);
mongoose.model('Plan', Plan);


var port = process.env.PORT || 3000;




app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

/*
app.use(function (req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});
*/
app.use("/static", express.static(__dirname + '/static/'));

var ReplaceProperties = function (original, newProps) {
    console.log("ReplaceProperties");
    if (original && newProps) {
        var keys = Object.keys(newProps),
            len = keys.length,
            key,
            i;
        for (i = 0; i < len; ++i) {
            key = keys[i];
            original[key] = newProps[key];
        }
    }
    return original;
},
    GetTable = function (plan, id) {
        return sq.getTable(plan, id);
        // return _.find(plan.tableList, function(item) {
        //    return item.id == id;
        //});
        
    },
    GetGuest = function (plan, id) {
        return sq.getGuest(plan, id);
    },
    GetSeat = function (plan, id) {
        console.log(sq);
        return sq.getSeat(plan, id);
        
    },
    GetSeatByNumber = function (plan, seatNumber) {
        return sq.getSeatByNumber(plan, seatNumber);
        
        
    },
    AddPlanList = function (newPlan, onAddedPlanList) {
        console.log("AddPlanList");
        console.log(newPlan);
        //GetPlanList(function AddPlanToList() {


        AddPlan(newPlan, function (newPlan) {
            var savedPlanList = [newPlan];
            console.log(savedPlanList);
            onAddedPlanList(savedPlanList);
        });


        //});
    },
    AddPlan = function (newPlan, onAddedPlan) {
  
        console.log("AddPlan");
        var PlanSchema = mongoose.model('Plan'),
            myPlan = new PlanSchema();
        ReplaceProperties(myPlan,newPlan);
        myPlan.save();
        console.log("Saved");
        onAddedPlan(myPlan);

    },
    GetPlan = function (session,onFoundPlan) {
        // retrieve my model
        var MyPlan = mongoose.model('Plan');   
        // create a blog post
        //var plan = new MyPlan();
        console.log("finding plan");
        console.log(session);
        MyPlan.find(session,function FoundPlan(err,savedPlanList) {
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
    },
    GetPlanList = function(onFoundPlanList) {
        // retrieve my model
        var MyPlan = mongoose.model('Plan');   
        // create a blog post
        //var plan = new MyPlan();
        console.log("finding all plans");
        MyPlan.find({},function getPlanListFoundPlan(err,savedPlanList) {
            if (err) {
                console.log(err);
                onFoundPlanList(null);
            }else if (savedPlanList.length === 0) {
                console.log("List is empty.");
                AddPlanList({},function OnCompleteAddPlanList(newlyGeneratedList) {
                    console.log("OnCompleteAddPlanList");
                    console.log(newlyGeneratedList);
                    onFoundPlanList(newlyGeneratedList);
                });
            //onFoundPlanList(savedPlanList);
            } else {
                console.log("Found Plan");
                console.log(savedPlanList);
                onFoundPlanList(savedPlanList);
            }
        });
    },
    MakeMissingSeats = function(myTable, seatCount) {
        if(!myTable.seatList || myTable.seatList.length !== 0) {
            for (var i=0,l=seatCount;i<l;i++) {
                var SeatSchema = mongoose.model('Seat');
                var mySeat = new SeatSchema();
                myTable.seatList.push(ReplaceProperties(mySeat,{id:i,seatNumber:i}));
            }
        }
    };


io.on('connection', function SocketConnection(socket) {
    console.log("hello")
    socket.on('AddPlan', function AddPlanSocket(message) {
        AddPlan(message ? message.plan : null, function(savedPlan) {
          socket.emit('AddPlanResponse', savedPlan);
        });
        console.log(message);
      });
      socket.on('GetPlanList', function GetPlanListSocket (message) {
        GetPlanList(function GetPlanListAction(savedPlanList) {  
            // return all the plans in the system. If it's empty then create a new plan!
            socket.emit('GetPlanListResponse', savedPlanList);
        });
        console.log(message);
      });
      
      socket.on('GetPlan', function GetPlanSocket (message) {
        GetPlan(message.plan,function GetPlanAction(savedPlan) {  
            // return the plan as is
            socket.emit('GetPlanResponse', savedPlan);
        });
        console.log(message.data);
      });
      
      socket.on('DeletePlanData', function DeletePlanDataSocket(message) {
        console.log("DeletePlanData");
        GetPlan(message.plan,function DeletePlanDataAction(savedPlan) {  
            console.log("deltePlanData" + savedPlan);
            // push table to our plan
            savedPlan.tableList = [];
            socket.broadcast.emit('GetPlanResponse', savedPlan);
            savedPlan.save();
        });
        console.log(message.data);
      });
      
      socket.on('EditGuest', function EditGuestSocket(message,fn) {
        console.log("EditGuest");
        socket.broadcast.emit('EditGuestResponse', message.data);
        
        GetPlan(message.plan,function EditGuestSocketAction(savedPlan) {  
            var guest = GetGuest(savedPlan,message.data.guest);
            console.log("guest", guest);
            ReplaceProperties(guest, message.data.current);
            savedPlan.save();
        });
        
        
        console.log(message.data);
        
        fn();
        
        
      });
      socket.on('UndoEditGuest', function UndoEditGuestSocket(message) {
        console.log("UndoEditGuest");
        socket.broadcast.emit('UndoEditGuestResponse', message.data);
        GetPlan(message.plan,function EditGuestSocketAction(savedPlan) {  
            var guest = GetGuest(savedPlan,message.data.guest);
            console.log("guest", guest);
            ReplaceProperties(guest, message.data.previous);
            savedPlan.save();
        });
        console.log(message.data);
      });
      socket.on('PlaceGuestOnNewSeat', function PlaceGuestOnNewSeatSocket(message) {
        console.log("PlaceGuestOnNewSeat");
        socket.broadcast.emit('PlaceGuestOnNewSeatResponse', message.data);
        console.log(message.data);
      });
      socket.on('UndoPlaceGuestOnNewSeat', function UndoPlaceGuestOnNewSeatSocket(message) {
        console.log("UndoPlaceGuestOnNewSeat");
        socket.broadcast.emit('UndoPlaceGuestOnNewSeatResponse', message.data);
        console.log(message.data);
      });
      socket.on('PlaceGuestOnSeat', function PlaceGuestOnSeatSocket(message) {
        console.log("PlaceGuestOnSeat");
        socket.broadcast.emit('PlaceGuestOnSeatResponse', message.data);
        
        GetPlan(message.plan,function PlaceGuestOnSeatAction(savedPlan) {  
            var seat = GetSeat(savedPlan,message.data.seat);
            console.log("seat", seat);
            var guest = GetGuest(savedPlan,message.data.guest);
            console.log("guest", guest);
            var guestOriginalSeat = GetSeat(savedPlan,message.data.guestOriginalSeat);
            console.log("guestOriginalSeat", guestOriginalSeat);
            savedPlan.guestList.deleteOne(guest);
            if(guestOriginalSeat) {
              guestOriginalSeat.guest.deleteOne(guest);
            }
            if(seat) {
              //seat.guest = [];
              seat.guest = guest;
            }
            
            savedPlan.save();
        });
        
        console.log(message.data);
      });
      socket.on('UndoPlaceGuestOnSeat', function UndoPlaceGuestOnSeatSocket(message) {
        console.log("UndoPlaceGuestOnSeat");
        socket.broadcast.emit('UndoPlaceGuestOnSeatResponse', message.data);
        
        GetPlan(message.plan,function UndoPlaceGuestOnSeatAction(savedPlan) {  
            var seat = GetSeat(savedPlan,message.data.seat);
            var guest = GetGuest(savedPlan,message.data.guest);
            var guestOriginalSeat = GetSeat(savedPlan,message.data.guestOriginalSeat);
            if(seat) {
              seat.guest.deleteOne(guest);
            }
            if(guestOriginalSeat) {
              guestOriginalSeat.guest = guest;
            }
            savedPlan.save();
        });
      
        console.log(message.data);
      });
      socket.on('SwapGuestWithGuest', function SwapGuestWithGuestSocket(message) {
        socket.broadcast.emit('SwapGuestWithGuestResponse', message.data); 
      
        console.log(message.data);
      });
      socket.on('UndoSwapGuestWithGuest', function UndoSwapGuestWithGuestSocket(message) {
        socket.broadcast.emit('UndoSwapGuestWithGuestResponse', message.data); 
      
        console.log(message.data);
      });
      socket.on('AddSeatAtPosition', function AddSeatAtPositionSocket(message) {
        socket.broadcast.emit('AddSeatAtPositionResponse', message.data); 
      
      
        GetPlan(message.plan,function AddSeatAtPositionAction(savedPlan) {  
            var table = GetTable(savedPlan,message.data.table);
            //var seat = GetSeat(savedPlan,message.data.seatNumber);
            var SeatSchema = mongoose.model('Seat');
            
            var mySeat = new SeatSchema();
            mySeat.seatNumber = table.seatList.length;
            
            table.seatList.push(mySeat);
            table.seatCount = table.seatList.length;
            savedPlan.save();
        });
        console.log(message.data);
      });
      socket.on('UndoAddSeatAtPosition', function UndoAddSeatAtPositionSocket (message) {
        socket.broadcast.emit('UndoAddSeatAtPositionResponse', message.data);
        GetPlan(message.plan, function UndoAddSeatAtPositionAction(savedPlan) {  
          //var seat = GetSeatByNumber(savedPlan,message.data.seatNumber);
          var table = GetTable(savedPlan,message.data.table);
          //table.seatList.deleteOne(seat);
          console.log({seatNumber:message.data.seatNumber});
          console.log(table.seatList);
          table.seatList[message.data.seatNumber].deleteOne();
          for(var i=0, l=table.seatList.length; i<l; i++) {
             table.seatList[i].seatNumber = i;  
          }
          table.seatCount = table.seatList.length;
          console.log(table.seatList);
          
          savedPlan.save();
          console.log(message.data);
        });
      });
      socket.on('AddTable', function AddTableSocket(message) {
        socket.broadcast.emit('AddTableResponse', message.data); 
        GetPlan(message.plan,function AddTableAction(savedPlan) {  
            var TableSchema = mongoose.model('Table');   
          // create a new table
            var myTable = new TableSchema();
            myTable = ReplaceProperties(myTable,message.data);
            console.log("adding new table" + myTable);
            
            MakeMissingSeats(myTable, message.data.seatCount);
            
            savedPlan.tableList.push(myTable);
            savedPlan.save();
        });
        console.log(message.data);
      });
      socket.on('UndoAddTable', function UndoAddTableSocket(message) {
        socket.broadcast.emit('UndoAddTableResponse', message.data);
        GetPlan(message.plan,function RemoveTableAction(savedPlan) {  
            savedPlan.tableList.deleteOne(message.data);
            savedPlan.save();
        });
        console.log(message.data);
      });
      socket.on('AddGuest', function AddGuestSocket(message,fn) {
        socket.broadcast.emit('AddGuestResponse', message.data); 
        GetPlan(message.plan,function AddGuestAction(savedPlan) {  
            savedPlan.guestList.push(message.data);
            savedPlan.save();
        });
        fn();
      });
      socket.on('UndoAddGuest', function UndoAddGuestSocket(message) {
        socket.broadcast.emit('UndoAddGuestResponse', message.data);
        GetPlan(message.plan,function RemoveTableAction(savedPlan) {  
            savedPlan.guestList.deleteOne(message.data);
            savedPlan.save();
        });
        console.log(message.data);
      });
      
      socket.on('MoveTable', function MoveTableSocket(message) {
        socket.broadcast.emit('MoveTableResponse', message.data);
        GetPlan(message.plan,function MoveTableAction(savedPlan) {  
            var Table = GetTable(savedPlan, message.data.table);
            Table = ReplaceProperties(Table, message.data.current);
            savedPlan.save();
        });
        console.log(message.data);
      });
      socket.on('UndoMoveTable', function UndoMoveTableSocket(message) {
        socket.broadcast.emit('UndoMoveTableResponse', message.data); 
        GetPlan(message.plan,function UndoMoveTableAction(savedPlan) {  
            var Table = GetTable(savedPlan, message.data.table);
            Table = ReplaceProperties(Table, message.data.previous);
            savedPlan.save();
        });
        console.log(message.data);
      });
  
});

http.listen(port, function () {
    console.log("Listening on " + port);
});