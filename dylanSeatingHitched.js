//window.addEvent('domready', function() {
    
var paper = Raphael("board", 900, 900),
    animationTime = 300,
    colGuest = "yellow",
    colGuestStroke = "black",
    colGuestMoveStroke = "blue",
    colGuestSwapStroke = "purple",
    colTable = "purple",
    colTableStroke = "black",
    colTableSelectedStroke = "yellow",
    colToolbarBack = "cyan",
    colSeatSelectedStroke = "blue",
    shapes = {guest:  "M -10 -10 L 10 -10 L 0 10 z",
              desk:   "m-60,0l0,60l120,0l0,-60c-45,20 -75,20 -120,0z",
              seat:   "M -20 -10 L 20 -10 L 0 10 z"
              //seat:   "M -20 -50 L 20 -50 L 0 -20 z"
              };
    inrange = false,
    seatList = [],
    draggableGuests = [],
    AllEvents = [],
    AllEventsAuditBox = paper.text(200, 20, "loaded"),
    myTables = [],
    myGuests = [
                {name: "adam hall"},
                {name: "simon dawson"},
                {name: "aimee read"}
                ];
     /*scene = {seatList: [],draggableGuests: [],AllEvents: [],AllEventsAuditBox: paper.text(200, 20, "loaded"),myTables: [],myGuests: [
                {name: "adam hall"},
                {name: "simon dawson"},
                {name: "aimee read"}
                ]
    };*/

paper.customAttributes = {
  
  model: function(model) {
    this.myModel = model;
    return this.myModel;
  },
  ox: function(ox) {
    this.myOx = ox;
    return this.myOx;
  },
  oy: function(oy) {
    this.myOy = oy;
    return this.myOy;
  },
  fromTableX: function(fromTableX) {
    this.myfromTableX = fromTableX;
    return this.myfromTableX;
  },
  fromTableY: function(fromTableY) {
    this.myfromTableY = fromTableY;
    return this.myfromTableY;
  }
};


function logEvent(eventText) {
    AllEvents.push(eventText);
    AllEventsAuditBox.remove();
    AllEventsAuditBox = paper.text(
    400, 200, AllEvents.slice(-20).join("\n"));
}
var dragThreshold =  15,
    scene = {
  SeatConflictCheck: function(thisSeat) {
    logEvent("scene.SeatConflictCheck");
    for (var i = 0; i < seatList.length; i++) {
        var seatCheck = seatList[i];
        if (seatCheck.guest === thisSeat.guest && seatCheck !== thisSeat) {
            logEvent("Seat conflict");
            seatCheck.guest = null;
            seatCheck.isoccupied = false;
        }
    }
  },
  GetCachedListOfSeatAreas: function() {
    possibleSeats = [];
    for (var i = 0; i < seatList.length; i++) {
        possibleSeats[i] = {
            t: seatList[i].GetY() - dragThreshold,
            r: seatList[i].GetX() + dragThreshold,
            b: seatList[i].GetY() + dragThreshold,
            l: seatList[i].GetX() - dragThreshold
        };
    }
    return possibleSeats;
  }
  
            
}
var
ToolBar = function() {
  this.background = paper.rect(600,20,200,600, 5);
  this.background.attr({
    fill: colToolbarBack,
    stroke: colTableStroke,
    model: this
  });
  this.toolBox = [];
  this.generateGuestSelect = function() {
    var guestSelect = paper.path(shapes.guest);
    guestSelect.attr({
        fill: colGuest,
        stroke: colGuestStroke,
        model: this,
        ox: 0,
        oy: 0
    });
    return guestSelect;
  };
  this.generateTableSelect = function() {
    var tableSelect = paper.circle(0, 0, 20);
    tableSelect.attr({
        fill: colTable,
        stroke: colTableStroke,
        model: this,
        ox: 0,
        oy: 0
    });
    return tableSelect;
  };
  this.generateDeskSelect = function() {
    var tableSelect = paper.path(shapes.desk);
    tableSelect.attr({
        fill: colTable,
        stroke: colTableStroke,
        model: this,
        ox: 0,
        oy: 0
    });
    return tableSelect;
  }

  this.AddToolBoxItem = function(item, helperText) {
    this.toolBox.push(item);
    var offsetY = (this.toolBox.length * 50);
    item.translate(650, offsetY);
    item.attr({ox:650, oy:offsetY});
    item.mouseover(function(event) {
        logEvent("Over ToolboxItem");
        this.animate({
                "stroke-width": 2,
                stroke: colTableSelectedStroke
        }, animationTime);
        this.attr("model").text = paper.text(this.attr("ox") + 75, this.attr("oy"), helperText);
        this.attr("model").text.show();
    });
    item.mouseout(function(event) {
        logEvent("Out ToolboxItem");
        this.animate({
               "stroke-width": 1,
               stroke: colTableStroke
        }, animationTime);
        if (this.attr("model").text) {
            this.attr("model").text.hide();
        }
    });
   
   
  }
  this.AddToolBoxItem(this.generateGuestSelect(), "Add new person");
  this.AddToolBoxItem(this.generateTableSelect(), "Add new table");
  this.AddToolBoxItem(this.generateDeskSelect(), "Add new desk");
  
}
Guest = function(name, x, y) {
    logEvent("Create Guest");
    this.name = name;
    this.text = false;
    this.graphic = paper.path(shapes.guest);//deskShape);//
    this.graphic.attr({
        ox: 0,
        oy: 0
    });
    this.graphic.attr({
        fill: colGuest,
        stroke: colGuestStroke,
        model: this
    });
    this.graphic.mouseover(function(event) {
      this.animate({
          "stroke-width": 2
      }, animationTime);
    });
    this.graphic.mouseout(function(event) {
        this.animate({
            "stroke-width": 1
        }, animationTime);
    });
    this.startDrag = function() {
        this.hideName();
        this.ghost = this.graphic.clone();
        this.ghost.attr("opacity", 0.3);
    };
    this.overEmptySeat = function(x, y, seat) {
        this.showHelpText("Move " + this.name + " to this seat", x, y);
        this.graphic.attr("rotation", seat.GetRotation());
    };
    this.overOccupiedSeat = function(x, y, seat) {
        this.showHelpText("Swap " + this.name + " with " + seat.guest.name, x, y);
        seat.guest.hideName();
    
    };
    this.moveGhostToNewLocation = function() {
        if (this.ghost) {
            this.ghost.model = this;
            this.ghost.animate({
                path: this.graphic.attr("path")
            }, animationTime, "<", function() {
                this.model.showHelpText(this.model.name);
                this.model.graphic.animate({
                    opacity: 1
                }, animationTime);
                this.remove();
            });
        }
    };
    this.removeFromSeat = function() {
        logEvent("remove from seat " + this.name);
        var seatCX = 0,
            seatCY = 0;
        this.seat = false;
        this.animateToSpot(seatCX, seatCY, 0);
    };
    this.animateToSpot = function(x, y, rotation) {
        this.graphic.model = this;
        var myX = this.GetX(),
            myY = this.GetY(),
            translateX = x - myX,
            translateY = y - myY;
        this.graphic.animate({
            translation: translateX + " " + translateY,
            rotation: rotation
        }, animationTime, ">", function() {
            this.attr({
                ox: x,
                oy: y
            });
            this.model.showHelpText(this.model.name);
        });
    };
    this.swapWithGuestAt = function(seat) {
        var meGuest = this;
        var meSeat = this.seat;
        var themGuest = seat.guest;
        var themSeat = seat;
        logEvent("Swap " + meGuest.name + " from seat occupied by " + themGuest.name + ".");
        if (meSeat) {
            themGuest.moveToSeat(meSeat);
        } else {
            themGuest.removeFromSeat();
        }
        meGuest.moveToSeat(themSeat);
        //Consider for swapping 
        //object making them go 
        //in a curved line 
        //rather than straight.
    };
    this.makeSureMainGraphicIsInRightPlace = function(seat) {
        var myCX = this.GetX(),
            myCY = this.GetY(),
            seatCX = seat.GetX(),
            seatCY = seat.GetY(),
            seatRotation = seat.GetRotation();
        if (myCX != seatCX || myCY != seatCY) {
            logEvent("Seat not in right place for " + this.name);
            this.animateToSpot(seatCX, seatCY, seatRotation);
        } else {
            this.graphic.attr("rotation", seatRotation);
        }
    };
    this.moveToSeat = function(seat) {
    
    
        logEvent("seat move for " + this.name);
        this.makeSureMainGraphicIsInRightPlace(seat);
        this.seat = seat;
        this.seat.isoccupied = true;
        this.seat.guest = this;
        this.moveGhostToNewLocation();
        scene.SeatConflictCheck(this.seat);
        
    };
    
    this.GetX = function() {
        return this.graphic.attr("ox");
    };
    this.GetY = function() {
        return this.graphic.attr("oy");
    };
    this.setGraphicPosition = function(x, y) {
    
        var currentX = this.GetX(),
            currentY = this.GetY();
        this.graphic.attr({
            ox: x,
            oy: y
        });
        this.graphic.translate(x - currentX, y - currentY);
        if (this.text) {
            this.text.attr({
                x: x,
                y: y - 20
            });
        }
    };
    this.showHelpText = function(text, x, y) {
        if (!x) {
            x = this.graphic.attr("ox");
        }
        if (!y) {
            y = this.graphic.attr("oy");
        }
        if (text) {
            this.hideName();
            this.text = paper.text(x, y - 20, text);
            this.text.show();
        }
    };
    this.hideName = function() {
        if (this.text) {
            this.text.hide();
        }
    };
        
    
    
    
    this.setGraphicPosition(x, y);
    this.showHelpText(this.name);
    var //possibleSeats = [],
        start = function(event) {
            var model = this.attr("model");
            model.startDrag();
            this.ox = this.attr("ox");
            this.oy = this.attr("oy");
            possibleSeats = scene.GetCachedListOfSeatAreas();
            this.animate({
                "stroke-width": 3,
                opacity: 0.7
            }, animationTime);
        },
        move = function(mx, my) {
            var model = this.attr("model");
            inrange = false;

            var mouseCX = this.ox + mx,
                mouseCY = this.oy + my,
                lockX = 0,
                lockY = 0;

            var myStroke = colGuestStroke;
            for (var i = 0; i < seatList.length; i++) {
                var seatCheck = possibleSeats[i];

                if ((seatCheck.t < mouseCY && seatCheck.b > mouseCY) && (seatCheck.r > mouseCX && seatCheck.l < mouseCX)) {
                    var mySeat = seatList[i];
                    inrange = true;

                    lockX = mySeat.GetX();
                    lockY = mySeat.GetY();
                    if (mySeat.isoccupied) {
                        myStroke = colGuestSwapStroke;
                        model.overOccupiedSeat(lockX, lockY, mySeat);
                    } else {
                        myStroke = colGuestMoveStroke;
                        model.overEmptySeat(lockX, lockY, mySeat);

                    }

                }
            }
            if (inrange) {
                model.setGraphicPosition(lockX, lockY);
                this.attr({
                    stroke: myStroke
                });
            } else {
                model.hideName();
                model.setGraphicPosition(mouseCX, mouseCY);
            }

        },
        up = function() {
            var model = this.attr("model");
            if (inrange) {
                for (var i = 0; i < seatList.length; i++) {
                    var s = seatList[i];
                    if (s.GetX() == model.GetX() && s.GetY() == model.GetY()) {
                        if (s.isoccupied) {
                            model.swapWithGuestAt(s);
                        } else {

                            model.moveToSeat(s);
                        }
                    }
                }
            } else {
                model.ghost.remove();
                model.removeFromSeat();
            }
              this.animate({
            "stroke-width": 2
            }, animationTime);
        };
    this.graphic.drag(move, start, up);
    this.ToJson = function() {
      return {
        name:this.name,
        x:this.GetX(),
        y:this.GetY()
      };
    }
},
Seat = function(x, y, rotation) {
    logEvent("Create Seat");
    this.rotation = rotation;
    this.graphic = paper.path(shapes.seat);
    this.graphic.attr({
        ox: x,
        oy: y,
        rotation: rotation
    });
    this.graphic.translate(x, y);
    
    this.GetX = function() {
        return this.graphic.attr("ox");
    };
    this.GetY = function() {
        return this.graphic.attr("oy");
    };
    this.GetRotation = function() {
        return this.graphic.attr("rotation");
    };
    this.setGraphicPosition = function(x, y) {
        var currentX = this.GetX(),
            currentY = this.GetY();
        this.graphic.attr({
            ox: x,
            oy: y
        });
        this.graphic.translate(x - currentX, y - currentY);
        if (this.guest) {
            this.guest.setGraphicPosition(x, y);
        }
    };
    this.RemoveGuest = function() {
        if (this.guest) {
            logEvent("Remove seat for " + this.guest.name);
        }
        this.guest = false;
        this.isoccupied = false;
    };
    this.RemoveGuest();
    seatList.push(this);
    
    this.ToJson = function() {
    var myGuest;
    if(this.guest) {
      myGuest = this.guest.ToJson()
    }
      return {
        type:"seat",
        rotation:this.rotation,
        x:this.GetX(),
        y:this.GetY(),
        guest: myGuest
      };
    };
    
},
    
    
RoundTable = function(x, y, seatCount) {
    this.GetX = function() {
        return this.graphic.attr("cx");
    };
    this.GetY = function() {
        return this.graphic.attr("cy");
    };
    this.setGraphicPosition = function(x, y) {
        this.graphic.attr({
            cx: x,
            cy: y
        });
    };
    logEvent("Create Table");
    this.width = seatCount * 10;
    this.widthWithChairs = this.width + 20;
    this.graphic = paper.circle(x, y, this.width);
    this.seatSet = paper.set();
    this.seatSet.push(this.graphic);
    this.graphic.attr({
        fill: colTable,
        stroke: colTableStroke,
        model: this
    });
    this.tableSeatList = [];
    this.addSeat = function() {
        var alpha = 360 / seatCount * this.tableSeatList.length,
            a = (90 - alpha) * Math.PI / 180,
            x = this.GetX() + this.widthWithChairs * Math.cos(a),
            y = this.GetY() - this.widthWithChairs * Math.sin(a),
            mySeat = new Seat(x, y, alpha);
        this.tableSeatList.push(mySeat);
        this.seatSet.push(mySeat.graphic);
    };

    for (var t = 0; t < seatCount; t++) {
        this.addSeat();
    }

    var
    start = function(event) {
        var model = this.attr("model");
        this.ox = model.GetX();
        this.oy = model.GetY();
        for (var i = 0; i < model.tableSeatList.length; i++) {
            var s = model.tableSeatList[i];
            s.graphic.attr({
                fromTableX: s.GetX(),
                fromTableY: s.GetY()
            });
        }
        model.seatSet.attr({
            stroke: colSeatSelectedStroke  
        });
        this.attr("stroke", colTableSelectedStroke);
    },
    move = function(mx, my) {
        var model = this.attr("model"),
            mouseCX = this.ox + mx,
            mouseCY = this.oy + my;

        for (var i = 0; i < model.tableSeatList.length; i++) {
            var s = model.tableSeatList[i];
            s.setGraphicPosition(
            s.graphic.attr("fromTableX") + mx, s.graphic.attr("fromTableY") + my);
        }
        model.setGraphicPosition(mouseCX, mouseCY);
        
    },
    up = function() {
        var model = this.attr("model");
        model.seatSet.attr({
            stroke: colTableStroke 
        });
        
    };
    this.graphic.drag(move, start, up);
    this.graphic.mouseover(function(event) {
        this.animate({
            "stroke-width": 2,
            stroke: colTableSelectedStroke
        }, animationTime);
    });
    this.graphic.mouseout(function(event) {
        this.animate({
            "stroke-width": 1,
            stroke: colTableStroke
        }, animationTime);
    });
    this.ToJson = function() {
      var seatObject = [];
      for(var i=0,l=this.tableSeatList.length;i<l;i++) {
        seatObject.push(this.tableSeatList[i].ToJson());
      };
      return {
        type:"round",
        seatCount:this.tableSeatList.length,
        x:this.GetX(),
        y:this.GetY(),
        seatList: seatObject
      };
    };
};
Desk = function(x, y, rotation) {
    this.GetX = function() {
        return this.graphic.attr("ox");
    };
    this.GetY = function() {
        return this.graphic.attr("oy");
    };
    this.setGraphicPosition = function(x, y) {
        var currentX = this.GetX(),
            currentY = this.GetY();
        this.graphic.attr({
            ox: x,
            oy: y
        });
        this.graphic.translate(x - currentX, y - currentY);
        this.rotationHandle.attr({cx:x + 50, cy:y + 50});
    };
    
    
    this.rotation = rotation;
    logEvent("Create Desk");
    this.graphic = paper.path(shapes.desk);//
    this.graphic.attr({
        ox: 0,
        oy: 30,
       rotation: rotation,
       fill: colTable,
        stroke: colTableStroke,
        model: this
    });
    this.rotationHandle = paper.circle(0 + 60, 0 + 60, 10);
    this.rotationHandle.attr({
       /* ox: 0,
        oy: 0,*/
        rotation: rotation,
        fill: colTable,
        stroke: colTableStroke,
        model: this
    });
    var
    rotationstart = function(event) {
        logEvent("StartRotation Desk");
        var model = this.attr("model");
        /*
         this.ox = model.GetX();
        this.oy = model.GetY();
        for (var i = 0; i < model.tableSeatList.length; i++) {
            var s = model.tableSeatList[i];
            s.graphic.attr({
                  fromTableX: s.GetX(),
                  fromTableY: s.GetY()
            });
        }
        model.seatSet.attr({
            stroke: colSeatSelectedStroke  
        });
        this.attr("stroke", colTableSelectedStroke);
        */
    },
    rotationmove = function(mx, my) {
        var model = this.attr("model"),
            mouseCX = this.attr("cx") + mx,
            mouseCY = this.attr("cy") + my,
            offset = 135,
            rounding = 22.5,
            calculateAngle = function(center,point) {
              var twelveOClock = {
                x:center.x,
                y:center.y 
                  - Math.sqrt(
                        Math.abs(point.x - center.x) * Math.abs(point.x - center.x)
                        + Math.abs(point.y - center.y) * Math.abs(point.y - center.y)
                      )
              };
              return (2 * Math.atan2(point.y - twelveOClock.y, point.x - twelveOClock.x)) * 180 / Math.PI;
            },
            roundValue = function(val, rounding) {
              return Math.round(val/rounding) * rounding;
            };j
        var newANGLE = calculateAngle({x:model.GetX(), y:model.GetY()}, {x:mouseCX, y:mouseCY}) - offset;
        newANGLE = roundValue(newANGLE,rounding);
        
        logEvent("rotate Desk" + model.GetX() + "," + model.GetY() + ", " + newANGLE);
        
        model.rotation = newANGLE;
        model.graphic.attr({rotation:model.rotation});
        //soh cah toa
        /*var 
        var alpha = 360 / seatCount * this.tableSeatList.length,
            a = (90 - alpha) * Math.PI / 180,
            x = this.GetX() + this.widthWithChairs * Math.cos(a),
            y = this.GetY() - this.widthWithChairs * Math.sin(a),
            mySeat = new Seat(x, y, alpha);*/
        
        
        
/*
        for (var i = 0; i < model.tableSeatList.length; i++) {
            var s = model.tableSeatList[i];
            s.setGraphicPosition(
            s.graphic.attr("fromTableX") + mx, s.graphic.attr("fromTableY") + my);
        }
        
        model.setGraphicPosition(mouseCX, mouseCY);
*/
    },
    rotationup = function() {
        logEvent("EndRotation Desk");
/*
         var model = this.attr("model");
        model.seatSet.attr({
            stroke: colTableStroke 
        });
*/
    };
    this.rotationHandle.drag(rotationmove, rotationstart, rotationup);
    this.rotationHandle.mouseover(function(event) {
        logEvent("Over Desk Rotation");
        this.animate({
            "stroke-width": 2,
            stroke: colTableSelectedStroke
        }, animationTime);
    });
    this.rotationHandle.mouseout(function(event) {
       logEvent("Out Desk Rotation");
       this.animate({
            "stroke-width": 1,
            stroke: colTableStroke
        }, animationTime);
    });
    
    this.setGraphicPosition(x, y);
    
    //this.width = 1 * 10;
    //this.widthWithChairs = this.width + 20;
    //this.graphic = paper.circle(x, y, this.width);
    this.seatSet = paper.set();
    this.seatSet.push(this.graphic);
    this.seatSet.push(this.rotationHandle);
    this.tableSeatList = [];
    this.addSeat = function() {
        /*var alpha = 360 / seatCount * this.tableSeatList.length,
            a = (90 - alpha) * Math.PI / 180,
            x = this.GetX() + this.widthWithChairs * Math.cos(a),
            y = this.GetY() - this.widthWithChairs * Math.sin(a),*/
        var mySeat = new Seat(x, y, rotation);
        this.tableSeatList.push(mySeat);
        this.seatSet.push(mySeat.graphic);
    };

    this.addSeat();
    
    var
    start = function(event) {
        logEvent("StartDrag Desk");
        var model = this.attr("model");
        this.ox = model.GetX();
        this.oy = model.GetY();
        for (var i = 0; i < model.tableSeatList.length; i++) {
            var s = model.tableSeatList[i];
            s.graphic.attr({
                  fromTableX: s.GetX(),
                  fromTableY: s.GetY()
            });

            
            
        }
        model.seatSet.attr({
            stroke: colSeatSelectedStroke  
        });
        this.attr("stroke", colTableSelectedStroke);
    },
    move = function(mx, my) {
        var model = this.attr("model"),
            mouseCX = this.ox + mx,
            mouseCY = this.oy + my;

        for (var i = 0; i < model.tableSeatList.length; i++) {
            var s = model.tableSeatList[i];
            s.setGraphicPosition(
            s.graphic.attr("fromTableX") + mx, s.graphic.attr("fromTableY") + my);
        }
        
        model.setGraphicPosition(mouseCX, mouseCY);
    },
    up = function() {
        logEvent("EndDrag Desk");
        var model = this.attr("model");
        model.seatSet.attr({
            stroke: colTableStroke 
        });
        
    };
    this.graphic.drag(move, start, up);
    this.graphic.mouseover(function(event) {
        logEvent("Over Desk");
    this.animate({
            "stroke-width": 2,
            stroke: colTableSelectedStroke
        }, animationTime);
    });
    this.graphic.mouseout(function(event) {
       logEvent("Out Desk");
     this.animate({
            "stroke-width": 1,
            stroke: colTableStroke
        }, animationTime);
    });
    this.ToJson = function() {
      var seatObject = [];
      for(var i=0,l=this.tableSeatList.length;i<l;i++) {
        seatObject.push(this.tableSeatList[i].ToJson());
      };
      return {
        type:"desk",
        rotation:this.rotation,
        x:this.GetX(),
        y:this.GetY(),
        seatList: seatObject
      };
    };
};

var SaveAll = function() {
  var SaveObject = {
    tables:[],
    guests:[]
  }
  for(var i=0,l=myTables.length;i<l;i++) {
    SaveObject.tables.push(myTables[i].ToJson());
  }
  for(var i=0,l=draggableGuests.length;i<l;i++) {
    if(!draggableGuests[i].seat) {
      SaveObject.guests.push(draggableGuests[i].ToJson());
    }
  }
  return SaveObject;
}
var Init = function() {
    var toolbar = new ToolBar();
    //Create Tables & Seats
    myTables.push(new Desk(100, 100, 0));
    myTables.push(new Desk(200, 260, 180));
    myTables.push(new Desk(200, 260, 0));
    myTables.push(new Desk(200, 450, 0));
    
     for (var i = 20; i < 400; i = i + Math.floor(Math.random() * 30) + 200) {
        for (var j = 20; j < 400; j = j + Math.floor(Math.random() * 30) + 200) {
            myTables.push(new RoundTable(i, j, Math.floor(Math.random() * 12)));
        }
    }
    
    for (var p = 0; p < myGuests.length; p++) {
        draggableGuests.push(new Guest(myGuests[p].name, 100, 100 * (p + 1)));
    }
    logEvent("Finished Init");
}();
