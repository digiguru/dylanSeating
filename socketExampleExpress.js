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


const path = require('node:path');
const { createServer } = require('node:http');
const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const { SeatQuerying } = require('./seatQuerying.js');

const SOCKET_IO_PATH = '/api/socket-io/socket.io';
const app = express();
const server = createServer(app);
const io = new Server(server, {
    path: SOCKET_IO_PATH,
    transports: ['websocket'],
    serveClient: false
});
const sq = SeatQuerying();
const { Schema } = mongoose;
let databaseConnectionPromise;
let redisAdapterPromise;
const rootRouteLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: 'draft-7',
    legacyHeaders: false
});
    
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

mongoose.model('Guest', Guest);
mongoose.model('Seat', Seat);
mongoose.model('Table', Table);
mongoose.model('Plan', Plan);

app.get('/', rootRouteLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'socketExampleClient.html'));
});

/*
app.use(function (req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});
*/
app.use(express.static(path.join(__dirname, 'static')));

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
        return AddPlan(newPlan, function (savedPlan) {
            var savedPlanList = [savedPlan];
            console.log(savedPlanList);
            onAddedPlanList(savedPlanList);
        });
    },
    AddPlan = function (newPlan, onAddedPlan) {
  
        console.log("AddPlan");
        var PlanSchema = mongoose.model('Plan'),
            myPlan = new PlanSchema();
        ReplaceProperties(myPlan, newPlan || {});
        return myPlan.save()
            .then(function (savedPlan) {
                console.log("Saved");
                onAddedPlan(savedPlan);
                return savedPlan;
            })
            .catch(function (error) {
                console.error("Could not save plan", error);
                return null;
            });
    },
    GetPlan = function (session, onFoundPlan) {
        var MyPlan = mongoose.model('Plan');   
        console.log("finding plan");
        console.log(session);
        return MyPlan.find(session).exec()
            .then(function (savedPlanList) {
                if (savedPlanList.length === 0) {
                    console.log("OOps - no plan saved with these params");
                    return null;
                }
                if (savedPlanList.length !== 1) {
                    console.log("OOps - multiple plans - wait that can't happen!");
                    return null;
                }
                console.log("Found Plan");
                var savedPlan = savedPlanList[0];
                console.log(savedPlan);
                onFoundPlan(savedPlan);
                return savedPlan;
            })
            .catch(function (error) {
                console.error("Could not find plan", error);
                return null;
            });
    },
    GetPlanList = function (onFoundPlanList) {
        var MyPlan = mongoose.model('Plan');   
        console.log("finding all plans");
        return MyPlan.find({}).exec()
            .then(function (savedPlanList) {
                if (savedPlanList.length === 0) {
                    console.log("List is empty.");
                    return AddPlanList({}, onFoundPlanList);
                }
                console.log("Found Plan");
                console.log(savedPlanList);
                onFoundPlanList(savedPlanList);
                return savedPlanList;
            })
            .catch(function (error) {
                console.error("Could not find plans", error);
                onFoundPlanList(null);
                return null;
            });
    },
    MakeMissingSeats = function(myTable, seatCount) {
        if (!myTable.seatList) {
            myTable.seatList = [];
        }
        var firstMissingSeat = myTable.seatList ? myTable.seatList.length : 0;
        for (var i = firstMissingSeat; i < seatCount; i++) {
            var SeatSchema = mongoose.model('Seat');
            var mySeat = new SeatSchema();
            myTable.seatList.push(ReplaceProperties(mySeat, { id: i, seatNumber: i }));
        }
    };

async function connectDatabase() {
    var connectionString = process.env.MONGOATLAS_CONNECTION;

    if (!connectionString) {
        throw new Error('MONGOATLAS_CONNECTION must be set before connecting to MongoDB.');
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!databaseConnectionPromise) {
        databaseConnectionPromise = mongoose.connect(connectionString)
            .then(function () {
                return mongoose.connection;
            })
            .catch(function (error) {
                databaseConnectionPromise = null;
                throw error;
            });
    }

    return databaseConnectionPromise;
}

async function configureRedisAdapter() {
    var redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
        return;
    }

    if (!redisAdapterPromise) {
        redisAdapterPromise = (async function () {
            const { createAdapter } = require('@socket.io/redis-adapter');
            const { createClient } = require('redis');
            const publisher = createClient({ url: redisUrl });
            const subscriber = publisher.duplicate();

            publisher.on('error', function (error) {
                console.error('Redis publisher error', error);
            });
            subscriber.on('error', function (error) {
                console.error('Redis subscriber error', error);
            });

            await Promise.all([publisher.connect(), subscriber.connect()]);
            io.adapter(createAdapter(publisher, subscriber));
        }()).catch(function (error) {
            redisAdapterPromise = null;
            throw error;
        });
    }

    return redisAdapterPromise;
}

io.use(async function initializeRealtimeConnection(socket, next) {
    try {
        await Promise.all([connectDatabase(), configureRedisAdapter()]);
        next();
    } catch (error) {
        console.error('Unable to initialise realtime connection', error);
        next(new Error('Realtime service is unavailable.'));
    }
});

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

async function startServer() {
    var port = process.env.PORT || 3000;

    await connectDatabase();
    await new Promise(function (resolveServer, rejectServer) {
        server.once('error', rejectServer);
        server.listen(port, function () {
            server.off('error', rejectServer);
            console.log("Listening on " + port);
            resolveServer();
        });
    });

    return server;
}

if (require.main === module) {
    startServer().catch(function (error) {
        console.error('Unable to start DylanSeating', error);
        process.exitCode = 1;
    });
}

module.exports = { app, connectDatabase, io, server, SOCKET_IO_PATH, startServer };
