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
    colSeatSelectedStroke = "blue";

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
var inrange = false,
    seatList = [],
    draggableGuests = [],
    AllEvents = [],
    AllEventsAuditBox = paper.text(200, 20, "loaded");

function logEvent(eventText) {
    AllEvents.push(eventText);
    AllEventsAuditBox.remove();
    AllEventsAuditBox = paper.text(
    400, 200, AllEvents.slice(-20).join("\n"));
}

var Guest = function(name, x, y) {
    logEvent("Create Guest");
    this.name = name;
    this.text = false;
    this.graphic = paper.path("M -10 -10 L 10 -10 L 0 10 z");
    this.graphic.attr({
        ox: 0,
        oy: 0
    });
    this.setGraphicPosition(x, y);
    this.graphic.attr({
        fill: colGuest,
        stroke: colGuestStroke,
        model: this
    });
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
    this.showHelpText(this.name);
    var possibleSeats = [],
        start = function(event) {
            var model = this.attr("model");
            model.startDrag();
            this.ox = this.attr("ox");
            this.oy = this.attr("oy");
            var threshold = 15;
            for (var i = 0; i < seatList.length; i++) {
                possibleSeats[i] = {
                    t: seatList[i].GetY() - threshold,
                    r: seatList[i].GetX() + threshold,
                    b: seatList[i].GetY() + threshold,
                    l: seatList[i].GetX() - threshold
                };
            }
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
                model.ghost.hide();
                model.removeFromSeat();
            }
              this.animate({
            "stroke-width": 2
            }, animationTime);
        };
    this.graphic.drag(move, start, up);
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
},
    Seat = function(x, y, rotation) {
        logEvent("Create Seat");
        this.graphic = paper.path("M -20 -10 L 20 -10 L 0 10 z");
        this.graphic.attr({
            ox: x,
            oy: y,
            rotation: rotation
        });
        this.graphic.translate(x, y);
        this.RemoveGuest = function() {
            if (this.guest) {
                logEvent("Remove seat for " + this.guest.name);
            }
            this.guest = false;
            this.isoccupied = false;
        };
        this.RemoveGuest();
        seatList.push(this);
    },
    Table = function(x, y, seatCount) {
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

        var start = function(event) {
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
/*
            this.attr({
                fill: "purple"
            });
            */
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
    };

Table.prototype.GetX = function() {
    return this.graphic.attr("cx");
};
Table.prototype.GetY = function() {
    return this.graphic.attr("cy");
};

Seat.prototype.GetX = function() {
    return this.graphic.attr("ox");
};
Seat.prototype.GetY = function() {
    return this.graphic.attr("oy");
};
Seat.prototype.GetRotation = function() {
    return this.graphic.attr("rotation");
};

Guest.prototype.startDrag = function() {
    this.hideName();
    if (!this.ghost) {  
      this.ghost = this.graphic.clone();
      this.ghost.GetX = function() {
          return this.attr("ox");
      };
      this.ghost.GetY = function() {
          return this.attr("oy");
      };
    }
    this.ghost.attr({
        ox: this.GetX(),
        oy: this.GetY()
    });
    
    this.ghost.attr("opacity", 0.3);
};
Guest.prototype.overEmptySeat = function(x, y, seat) {
    this.showHelpText("Move " + this.name + " to this seat", x, y);
    this.graphic.attr("rotation", seat.GetRotation());
};
Guest.prototype.overOccupiedSeat = function(x, y, seat) {
    this.showHelpText("Swap " + this.name + " with " + seat.guest.name, x, y);
    seat.guest.hideName();

};
Guest.prototype.moveGhostToNewLocation = function() {
    if (this.ghost) {
        this.ghost.show();
        this.ghost.model = this;
        
       /* 
        var myX = this.GetX(),
            myY = this.GetY(),
            translateX = this.ghost.GetX() - myX,
            translateY = this.ghost.GetY() - myY;
        this.ghost.animate({
            translation: translateX + " " + translateY//,
            //rotation: rotation
        }, animationTime, ">", function() {
            
            this.model.showHelpText(this.model.name);
            this.model.graphic.animate({
                opacity: 1
            }, animationTime);
            this.hide();
            this.model.showHelpText(this.model.name);
        });
        
        */
        
        
        this.ghost.animate({
            path: this.graphic.attr("path")
        }, animationTime, "<", function() {
            this.model.showHelpText(this.model.name);
            this.model.graphic.animate({
                opacity: 1
            }, animationTime);
            this.hide();
        });
        
    }
};
Guest.prototype.removeFromSeat = function() {
    logEvent("remove from seat " + this.name);
    var seatCX = 0,
        seatCY = 0;
    this.seat = false;
    this.animateToSpot(seatCX, seatCY, 0);
};
Guest.prototype.animateToSpot = function(x, y, rotation) {
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
Guest.prototype.swapWithGuestAt = function(seat) {
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
Guest.prototype.makeSureMainGraphicIsInRightPlace = function(seat) {
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
Guest.prototype.moveToSeat = function(seat) {


    logEvent("seat move for " + this.name);
    this.makeSureMainGraphicIsInRightPlace(seat);
    this.seat = seat;
    this.seat.isoccupied = true;
    this.seat.guest = this;
    this.moveGhostToNewLocation();

    for (var i = 0; i < seatList.length; i++) {
        var seatCheck = seatList[i];
        if (seatCheck.guest === this.seat.guest && seatCheck !== this.seat) {
            logEvent("Seat conflict");
            seatCheck.guest = null;
            seatCheck.isoccupied = false;
        }
    }
};

Guest.prototype.GetX = function() {
    return this.graphic.attr("ox");
};
Guest.prototype.GetY = function() {
    return this.graphic.attr("oy");
};
Table.prototype.setGraphicPosition = function(x, y) {
    this.graphic.attr({
        cx: x,
        cy: y
    });
};
Guest.prototype.setGraphicPosition = function(x, y) {

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
Seat.prototype.setGraphicPosition = function(x, y) {
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

var myGuests = [{
    name: "adam hall"},
{
    name: "simon dawson"},
{
    name: "aimee read"}];
var myTables = [];

var Init = function() {
    //Create Tables & Seats
    for (var i = 20; i < 900; i = i + Math.floor(Math.random() * 30) + 200) {
        for (var j = 20; j < 900; j = j + Math.floor(Math.random() * 30) + 200) {
            myTables.push(new Table(i, j, Math.floor(Math.random() * 12)));
        }
    }
    for (var p = 0; p < myGuests.length; p++) {
        draggableGuests.push(new Guest(myGuests[p].name, 100, 100 * (p + 1)));
    }
    logEvent("Finished Init");
}()
//Init();
  //});