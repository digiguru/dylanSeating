/*jslint nomen: true */
/*global $:false, _:false, console:false, socket:false, Raphael:false, window:false, socket:false */
/**
 * @license DylanSeating v1
 *
 * (c) 2011-2012 by digiguru (Adam Hall)
 *
 * License: Creative Commons 3.0 (http://creativecommons.org/licenses/by-nc/3.0/)
 * Prequisites : jQuery, underscore, rapheal
 **/
var myPlanID, possibleSeats;
var socket;
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function ArrayRemove(from, to) {
    "use strict";
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
Array.prototype.insertAt = function ArrayInsertAt(o, index) {
    "use strict";
    if (index > -1 && index <= this.length) {
        this.splice(index, 0, o);
        return true;
    }
    return false;
};
var DylanSeating = function DylanSeating() {
    "use strict";
    this.Controller = function Controller() {
    };
    /*this.viewModule = {
        board: {
            generatePaperIfNotPresent: function () {
                if (!$("#board").length) {
                    $("body").prepend("<div id='board'></div>");
                }
                return window.Raphael("board", 900, 900);
            },
            paper: this.generatePaperIfNotPresent()
        },
        audit: {
            audits: [],
            auditBox: paper.text(200, 20, "loaded"),
            log: function(eventText) {
                this.audits.push(eventText);
                this.auditBox.remove();
                this.auditBox = paper.text(400, 200, this.audits.slice(-20).join("\n"));
            }
        }
    }*/
    var viewModule = (function () {
        var auditModule = function (paper) {
            var auditBox = paper.text(200, 20, "loaded");
            return {
                audits: [],
                log: function (eventText) {
                    this.audits.push(eventText);
                    auditBox.remove();
                    auditBox = paper.text(400, 200, this.audits.slice(-20).join("\n"));
                }
            };
        }, generatePaperIfNotPresent = function () {
            if (!$("#board").length) {
                $("body").prepend("<div id='board'></div>");
            }
            return Raphael("board", 900, 900);
        }, paper = generatePaperIfNotPresent();
        return {
            paper: paper,
            audit: auditModule(paper)
        };
    }());
    //console.log(view, view.paper);
    var seatList = [], myTables = [], myGuests = [], paper = viewModule.paper, logEvent = function logEvent(eventText) {
        viewModule.audit.log(eventText);
    }, MyToolBar, selectedGuestEdit, clearData = function () {
        var dfdRemoveAllData = $.Deferred(), arrAllDataDFD = [], i, l = myTables.length;
        if (myTables && l) {
            for (i = 0; i < l; i += 1) {
                arrAllDataDFD.push(myTables[i].remove());
            }
        }
        if (myGuests) {
            l = myGuests.length;
            for (i = 0; i < l; i += 1) {
                arrAllDataDFD.push(myGuests[i].remove());
            }
        }
        $.when.apply($, arrAllDataDFD).done(function () {
            myTables = [];
            myGuests = [];
            console.log("removed all data from the scene. it is now clean");
            dfdRemoveAllData.resolve();
        });
        return dfdRemoveAllData.promise();
    }, requestPlanList = function () {
        if (socket) {
            socket.emit('GetPlanList');
        }
    }, loadData = function (data) {
        var dfdRemoveAllData = $.Deferred(), arrAllDataDFD = [], loadGuest = function (data, callback) {
            return new Guest(data.name, data.x, data.y, data.id, callback);
        }, loadTable = function (data, callback) {
            return new RoundTable(data.x, data.y, data.seatCount, data.seatList, data.id, callback);
        }, loadDesk = function (data, callback) {
            return new Desk(data.x, data.y, data.rotation, callback);
        }, i, l, myTableData, myTable, tableComplete = function (table, data) {
            var dfd = $.Deferred();
            if (data.seatList && data.seatList.length) {
                var i2, l2, seat, guest;
                l2 = data.seatList.length;
                for (i2 = 0; i2 < l2; i2 += 1) {
                    seat = data.seatList[i2];
                    if (seat && seat.guest && seat.guest[0]) {
                        guest = seat.guest[0]; //Hack : needs to be property, not an array.
                        var a = loadGuest(guest, dfd.resolve);
                        myGuests.push(a);
                        controller.PlaceGuestOnSeat(guest.id, seat.id);
                    }
                }
            }
            return dfd;
        };
        if (data.tableList) {
            l = data.tableList.length;
            var makeCompleteFunction = function (data) {
                return function (table) {
                    tableComplete(table, data);
                };
            };
            for (i = 0; i < l; i += 1) {
                myTableData = data.tableList[i];
                myTable = null;
                if (data.tableList[i].type === "desk") {
                    myTable = loadDesk(myTableData, makeCompleteFunction(myTableData));
                }
                else if (data.tableList[i].type === "table") {
                    myTable = loadTable(myTableData, makeCompleteFunction(myTableData));
                }
                myTables.push(myTable);
                if (myTable.dfdPromise) {
                    arrAllDataDFD.push(myTable.dfdPromise);
                }
            }
        }
        if (data.guestList) {
            l = data.guestList.length;
            for (i = 0; i < l; i += 1) {
                var a = loadGuest(data.guestList[i]);
                myGuests.push(a);
            }
        }
        $.when.apply($, arrAllDataDFD).done(function () {
            dfdRemoveAllData.resolve();
        });
        return dfdRemoveAllData;
    }, Controller = function controller() {
        /*These functions grab the object from the stage. You can pass in the actual object or an ID, and they will cope with both.*/
        var getTableByID = function getTableByID(id) {
            var i, l = myTables.length;
            for (i = 0; i < l; i += 1) {
                if (myTables[i].id === id) {
                    return myTables[i];
                }
            }
            return null;
        }, getTable = function getTable(table) {
            if (typeof table === "number" || typeof table === "string") {
                table = getTableByID(table);
            }
            return table;
        }, getGuestByID = function getGuestByID(id) {
            var i, l = myGuests.length;
            for (i = 0; i < l; i += 1) {
                if (myGuests[i].id === id) {
                    return myGuests[i];
                }
            }
            return null;
        }, getSeatByID = function getSeatByID(id) {
            var i, l = myTables.length, j, m;
            for (i = 0; i < l; i += 1) {
                if (myTables[i].tableSeatList) {
                    j = 0;
                    for (m = myTables[i].tableSeatList.length; j < m; j += 1) {
                        if (myTables[i].tableSeatList[j].id === id) {
                            return myTables[i].tableSeatList[j];
                        }
                    }
                }
            }
            return false;
        }, getSeatMarkerByNumber = function getSeatMarkerByNumber(table, seatMarkerNumber) {
            var j, m = table.tableSeatAdditions.length;
            for (j = 0; j < m; j += 1) {
                if (table.tableSeatAdditions[j].seatNumber === seatMarkerNumber) {
                    return table.tableSeatAdditions[j];
                }
            }
            return null;
        }, getGuest = function getGuest(guest) {
            if (typeof guest === "number" || typeof guest === "string") {
                guest = getGuestByID(guest);
            }
            return guest;
        }, getSeat = function getSeat(seat) {
            if (typeof seat === "number" || typeof seat === "string") {
                seat = getSeatByID(seat);
            }
            return seat;
        }, getSeatCreatedByMarker = function getSeatCreatedByMarker(table, seatMarker) {
            var seat;
            table = getTable(table);
            if (typeof seatMarker === "number" || typeof seatMarker === "string") {
                seat = table.tableSeatList[seatMarker];
            }
            return seat;
        }, getSeatMarker = function getSeatMarker(table, seatMarker) {
            var seat;
            table = getTable(table);
            if (typeof seatMarker === "number" || typeof seatMarker === "string") {
                seat = getSeatMarkerByNumber(table, seatMarker);
            }
            return seat;
        }, topTableID = 0, topSeatID = 0, topGuestID = 0, 
        /*This clever little class stores actions and their opposite actions - allowing undoable events*/
        ActionController = function ActionController() {
            var cachedActions = [], getAction = function getAction(action) {
                if (!action.name) {
                    return cachedActions[action];
                }
                return action;
            };
            this.UndoActions = [];
            this.RedoActions = [];
            this.WrapMessage = function WrapMessage(data) {
                var plan = {
                    _id: myPlanID
                }; // Hack: Let's only deal with one floorplan for the time being!
                return {
                    data: data,
                    plan: plan
                };
            };
            this.Add = function Add(action) {
                //var dfd = new $.Deferred();
                if (!cachedActions[action.name]) {
                    action.oppositeName = "Undo" + action.name;
                    cachedActions[action.name] = action;
                    cachedActions[action.oppositeName] = {
                        name: action.oppositeName,
                        doAction: action.undoAction,
                        undoAction: action.doAction,
                        oppositeName: action.name
                    };
                }
                if (socket) {
                    socket.on(action.name + "Response", function (data) {
                        console.log(data);
                        action.doAction(data);
                        //dfd.resolve();
                        //controller.CreateSeatAndPlaceGuest(data);
                    });
                    socket.on(action.oppositeName + "Response", function (data) {
                        console.log(data);
                        action.undoAction(data);
                        //dfd.resolve();
                        //controller.CreateSeatAndPlaceGuest(data);
                    });
                }
            };
            this.CallNext = function CallNext(arrActionList, callback) {
                var dfd = $.Deferred(), nextAction = arrActionList.pop(), currentDFD = this.CallInner(nextAction, nextAction.args, nextAction.callback).promise();
                $.when(currentDFD).done(function chainedAction() {
                    if (arrActionList && arrActionList.length) {
                        var innerDFD = this.CallNext(arrActionList, callback);
                        $.when(innerDFD).done(function innerChaindAction() {
                            dfd.resolveWith(this);
                        });
                    }
                    else {
                        dfd.resolveWith(this);
                    }
                });
                return dfd;
            };
            this.CallMultiple = function CallMultiple(arrActionList, callback) {
                var arrListClone = this.CloneArray(arrActionList), reverse = false;
                this.UndoActions.push(arrListClone);
                return this.SequenceDeferred(arrActionList.reverse(), reverse, callback);
            };
            this.Call = function Call(myAction, args, callback) {
                var actionName = myAction, action;
                if (myAction && myAction.name) {
                    actionName = myAction.name;
                }
                if (myAction && myAction.args) {
                    args = myAction.args;
                }
                action = getAction(actionName);
                return this.CallMultiple([{
                        name: action.name,
                        oppositeName: action.oppositeName,
                        args: args
                    }], callback);
            };
            /*Deferred example*/
            this.CallInner = function CallInner(myAction, args, callback) {
                var actionName = myAction, dfdPromise;
                if (myAction && myAction.name) {
                    actionName = myAction.name;
                }
                if (myAction && myAction.args) {
                    args = myAction.args;
                }
                dfdPromise = this.CallInnerWithoutHistory(actionName, args, callback);
                return dfdPromise;
            };
            this.CallInnerWithoutHistory = function CallWithoutHistory(myAction, args, callback) {
                var actionName = myAction, action, dfdOverall = $.Deferred(), dfdAction = $.Deferred(), dfdSocket = $.Deferred(), ac = this;
                if (myAction && myAction.name) {
                    actionName = myAction.name;
                }
                if (myAction && myAction.args) {
                    args = myAction.args;
                }
                console.log("Doing" + actionName, args);
                action = getAction(actionName);
                if (action) {
                    if (socket) {
                        socket.emit(action.name, this.WrapMessage(args), function () {
                            console.log("called" + actionName, args);
                            dfdSocket.resolveWith(this);
                        });
                    }
                    else {
                        dfdSocket.resolveWith(this);
                    }
                    action
                        .doAction(args, function resolveCallInnerWithoutHistory() {
                        dfdAction.resolveWith(ac);
                    });
                }
                else {
                    console.log("No such action:" + actionName);
                    dfdSocket.resolve({
                        success: false,
                        message: "No such socket."
                    });
                    dfdAction.resolve({
                        success: false,
                        message: "No such action."
                    });
                }
                $.when(dfdAction, dfdSocket)
                    .then(function ResolveInnerWithoutHistory() {
                    dfdOverall.resolveWith(ac);
                });
                return dfdOverall.promise();
            };
            this.CloneArray = function CloneArray(array) {
                return array.slice();
            };
            this.SequenceDeferred = function SequenceDeferred(list, reverse, callback) {
                var dfd = $.Deferred(), nextAction = list.pop(), swapAction = getAction(nextAction.name), currentDFDPromise = this.CallInnerWithoutHistory(reverse ? swapAction.oppositeName : nextAction.name, nextAction.args, nextAction.callback).promise(), ac = this;
                $.when(currentDFDPromise).done(function chainedAction() {
                    if (list && list.length) {
                        var innerDeferred = this.SequenceDeferred(list, reverse, callback);
                        $.when(innerDeferred).done(function innerChaindAction() {
                            dfd.resolveWith(this);
                        });
                    }
                    else {
                        dfd.resolveWith(ac);
                    }
                });
                return dfd;
            };
            this.Undo = function Undo(callback) {
                var arrActionList = this.UndoActions.pop(), arrListClone = this.CloneArray(arrActionList), reverse = true;
                this.RedoActions.push(arrActionList);
                return this.SequenceDeferred(arrListClone, reverse, callback);
            };
            this.Redo = function Redo(callback) {
                var arrActionList = this.RedoActions.pop(), arrListClone = this.CloneArray(arrActionList), reverse = false;
                this.UndoActions.push(arrActionList);
                return this.SequenceDeferred(arrListClone.reverse(), reverse, callback);
            };
        };
        /*And now some concrete implementations. These could be assigned to the class later making the class itself reusuable.*/
        //seatMarker
        this.ClickAddSeatAtPosition = function ClickAddSeatAtPosition(table, seatNumber) {
            var data = {
                table: table.id,
                seatNumber: seatNumber
            };
            return this.ac.Call("AddSeatAtPosition", data);
        };
        this.ClickSeatRemove = function ClickSeatRemove(seat) {
            var data = {
                table: seat.table.id,
                seatNumber: seat.seatNumber
            };
            return this.ac.Call("UndoAddSeatAtPosition", data);
        };
        this.CreateSeatAndPlaceGuest = function CreateSeatAndPlaceGuest(guest, table, seatMarker) {
            guest = getGuest(guest);
            table = getTable(table);
            seatMarker = getSeatMarker(table, seatMarker);
            console.log("converting marker to seat");
            $.when(seatMarker.convertToSeat()).then(function (seat) {
                console.log("Finished creating seat - now place guest on new seat");
                guest.moveToSeat(seat);
            });
        };
        this.PlaceGuestOnSeat = function PlaceGuestOnSeat(guest, seat) {
            guest = getGuest(guest);
            seat = getSeat(seat);
            guest.moveToSeat(seat);
        }; //Example = Controller.PlaceGuestOnSeat(myGuests[0], myTables[4].tableSeatList[0]);
        this.RemoveGuestFromTheirSeat = function RemoveGuestFromTheirSeat(guest) {
            guest = getGuest(guest);
            guest.removeFromSeat();
        };
        this.RemoveGuestFromSeat = function RemoveGuestFromSeat(seat) {
            seat = getSeat(seat);
            seat.guest.removeFromSeat();
        };
        this.SwapGuests = function SwapGuests(guest1, guest2) {
            guest1 = getGuest(guest1);
            guest2 = getGuest(guest2);
            guest1.swapWithGuestAt(guest2.seat);
        };
        this.SwapGuestWithSeat = function SwapGuestWithSeat(guest, seat) {
            guest = getGuest(guest);
            seat = getSeat(seat);
            guest.swapWithGuestAt(seat);
        };
        this.NextTableID = function NextTableID() {
            var i, l = myTables.length;
            for (i = 0; i < l; i += 1) {
                if (myTables[i].id === topTableID) {
                    topTableID += 1;
                }
            }
            return topTableID;
        };
        this.NextSeatID = function NextSeatID() {
            topSeatID += 1;
            return topSeatID;
        };
        this.NextGuestID = function NextGuestID() {
            var i, l = myGuests.length;
            for (i = 0; i < l; i += 1) {
                if (myGuests[i].id === topTableID) {
                    topGuestID += 1;
                }
            }
            return topGuestID;
        };
        this.MoveGuestToSeatArea = function MoveGuestToSeatArea(model, mySeat) {
            var data;
            if (mySeat.isoccupied) {
                data = {
                    guest1: model.id,
                    guest2: mySeat.guest.id
                };
                return this.ac.Call("SwapGuestWithGuest", data);
            }
            if (mySeat.ismarker) {
                data = {
                    guest: model.id,
                    table: mySeat.table.id,
                    seatMarker: mySeat.seatNumber
                };
                return this.ac.Call("PlaceGuestOnNewSeat", data);
            }
            data = {
                guest: model.id,
                seat: mySeat.id,
                guestOriginalSeat: model.seat ? model.seat.id : null
            };
            return this.ac.Call("PlaceGuestOnSeat", data);
        };
        //When creating an action you should be using the raw objects.
        //Generally undo actions should be generated at the same time,
        //but occassionally added to after the original command has completed.
        //Example usage:
        //  ActionController.Call("PlaceGuestOnNewSeat",{guest:guest,table:table,seatMarker:seatMarker,guestOriginalSeat:guest.seat});
        //this will in turn create one of the following UNDO events:
        //  ActionController.Call("ReplaceGuestAndDeletePreviousSeat", {guest:guest,seat:seat});
        //which will remove the guest from their current seat, delete that seat and then move them to the
        //seat defined in the args. If Null it will move that guest off the stage entirely.
        //CreateSeatAndPlace = PlaceGuestOnNewSeat
        //  ActionController.Call("PlaceGuestOnNewSeat",{guest:guest,table:table,seatMarker:seatMarker,guestOriginalSeat:guest.seat});
        //  UNDO
        //  ActionController.Call("UndoPlaceGuestOnNewSeat", {guest:guest,table:table,seatMarker:seatMarker,guestOriginalSeat:guest.seat});
        //  ActionController.Call("PlaceGuestOnSeat",{guest:guest,seat:seat,guestOriginalSeat:guest.seat});
        //  UNDO
        //  ActionController.Call("UndoPlaceGuestOnSeat",{guest:guest,seat:seat,guestOriginalSeat:guest.seat});
        //  ActionController.Call("SwapGuestWithGuest",{guest1:guest,guest2:guest});
        //  UNDO
        //  ActionController.Call("UndoSwapGuestWithGuest",{guest1:guest,guest2:guest});
        //  ActionController.Call("AddSeatAtPosition", {table:table, seatNumber:seatNumber};
        //  UNDO
        //  ActionController.Call("UndoAddSeatAtPosition", {table:table, seatNumber:seatNumber};
        //  ActionController.Call("AddTable", {tableID:tableID, properties:{seatCount, width, colour}};
        //  UNDO
        //  ActionController.Call("UndoAddTable", {tableID:tableID, properties:{seatCount, width, colour}};
        //  ActionController.Call("AddGuest", {guestID:guestID, properties:{name, colour, gender}};
        //  UNDO
        //  ActionController.Call("UndoAddGuest", {guestID:guestID, properties:{name, colour, gender}};
        this.ac = new ActionController();
        this.ac.Add({
            name: "PlaceGuestOnNewSeat",
            doAction: function doActionPlaceGuestOnNewSeat(args, callback) {
                var guest = getGuest(args.guest), table = getTable(args.table), seatMarker = getSeatMarker(table, args.seatMarker);
                console.log("Convert to new seat from place guest on new seat");
                $.when(seatMarker.convertToSeat()).then(function (seat) {
                    console.log("DONE! - Convert to new seat from place guest on new seat");
                    //guest.moveToSeat(seat);
                    console.log("Place guest on new seat");
                    $.when(guest.moveToSeat(seat)).then(function whenPromiseDoActionPlaceGuestOnNewSeatPlaceGuest() {
                        console.log("DONE! - Place guest on new seat");
                        if (callback) {
                            callback();
                        }
                    });
                });
            },
            undoAction: function undoActionPlaceGuestOnNewSeat(args, callback) {
                var guest = getGuest(args.guest), table = getTable(args.table), seatFrom = getSeat(args.guestOriginalSeat), seatRemove = getSeatCreatedByMarker(table, args.seatMarker), dfdPromise;
                if (seatFrom) {
                    console.log("undoActionPlaceGuestOnNewSeat - Move to seat");
                    dfdPromise = guest.moveToSeat(seatFrom);
                }
                else {
                    console.log("undoActionPlaceGuestOnNewSeat - Remove from seat");
                    dfdPromise = guest.removeFromSeat();
                }
                $.when(dfdPromise).then(function undoActionPlaceGuestComplete() {
                    console.log("DONE! - undoActionPlaceGuestOnNewSeatComplete");
                    $.when(table.removeSeat(seatRemove.seatNumber)).then(function undoActionRemoveSeatComplete() {
                        if (callback) {
                            callback();
                        }
                    });
                });
            }
        });
        this.ac.Add({
            name: "PlaceGuestOnSeat",
            doAction: function doActionPlaceGuestOnSeat(args, callback) {
                var guest = getGuest(args.guest), seat = getSeat(args.seat);
                $.when(guest.moveToSeat(seat)).done(function () {
                    if (callback) {
                        callback();
                    }
                });
            },
            undoAction: function undoActionPlaceGuestOnSeat(args, callback) {
                var guest = getGuest(args.guest), seatFrom = getSeat(args.guestOriginalSeat), dfdPromise;
                if (seatFrom) {
                    dfdPromise = guest.moveToSeat(seatFrom);
                }
                else {
                    dfdPromise = guest.removeFromSeat();
                }
                $.when(dfdPromise).then(function undoActionPlaceGuestOnSeatComplete() {
                    console.log("DONE! - undoActionPlaceGuestOnSeatComplete");
                    if (callback) {
                        callback();
                    }
                });
            }
        });
        this.ac.Add({
            name: "SwapGuestWithGuest",
            doAction: function doActionSwapGuestWithGuest(args, callback) {
                var guest1 = getGuest(args.guest1), guest2 = getGuest(args.guest2);
                $.when(guest1.swapWithGuestAt(guest2.seat)).then(function doActionSwapGuestWithGuestComplete() {
                    console.log("DONE! - doActionSwapGuestWithGuestComplete");
                    if (callback) {
                        callback();
                    }
                });
            },
            undoAction: function undoActionSwapGuestWithGuest(args, callback) {
                var guest1 = getGuest(args.guest1), guest2 = getGuest(args.guest2);
                $.when(guest2.swapWithGuestAt(guest1.seat)).then(function undoActionSwapGuestWithGuestComplete() {
                    console.log("DONE! - undoActionSwapGuestWithGuestComplete");
                    if (callback) {
                        callback();
                    }
                });
            }
        });
        this.ac.Add({
            name: "AddSeatAtPosition",
            doAction: function doActionAddSeatAtPosition(args, callback) {
                var table = getTable(args.table);
                $.when(table.addSeatFromMarker(args.seatNumber)).then(function (seat) {
                    console.log("DONE! - doActionAddSeatAtPositionComplete", seat);
                    if (callback) {
                        callback();
                    }
                });
            },
            undoAction: function undoActionAddSeatAtPosition(args, callback) {
                var table = getTable(args.table);
                $.when(table.removeSeat(args.seatNumber)).then(function undoActionAddSeatAtPositionComplete() {
                    console.log("DONE! - undoActionAddSeatAtPositionComplete");
                    if (callback) {
                        callback();
                    }
                });
            }
        });
        this.ac.Add({
            name: "AddTable",
            doAction: function doActionAddTable(args, callback) {
                $.when(loadData({
                    tableList: [args]
                })).then(callback);
            },
            undoAction: function undoActionAddTable(args, callback) {
                var table = getTable(args.id);
                $.when(table.remove())
                    .then(function () {
                    myTables = _.reject(myTables, function undoActionAddTableRemoveItem(removeTable) {
                        return removeTable.id === args.id;
                    });
                    if (callback) {
                        callback();
                    }
                });
            }
        });
        this.ac.Add({
            name: "AddGuest",
            doAction: function doActionAddGuest(args, callback) {
                $.when(loadData({
                    guestList: [args]
                })).then(callback);
            },
            undoAction: function undoActionAddGuest(args, callback) {
                var guest = getGuest(args.id);
                $.when(guest.remove()).then(function whenPromiseAddGuest() {
                    myGuests = _.reject(myGuests, function (removeGuest) {
                        return removeGuest.id === args.id;
                    });
                    if (callback) {
                        callback();
                    }
                });
            }
        });
        this.ac.Add({
            name: "MoveTable",
            doAction: function doMoveTable(args, callback) {
                var table = getTable(args.table);
                console.log("MoveTable", args);
                table.animateTable(args.current, callback);
            },
            undoAction: function undoMoveTable(args, callback) {
                var table = getTable(args.table);
                console.log("UndoMoveTable", args);
                table.animateTable(args.previous, callback);
            }
        });
        this.ac.Add({
            name: "EditGuest",
            doAction: function doEditGuest(args, callback) {
                var guest = getGuest(args.guest);
                console.log("EditGuest", args);
                guest.SetName(args.current.name);
                if (callback) {
                    callback();
                }
            },
            undoAction: function undoEditGuest(args, callback) {
                var guest = getGuest(args.guest);
                console.log("UndoEditGuest", args);
                guest.SetName(args.previous.name);
                if (callback) {
                    callback();
                }
            }
        });
    }, controller = new Controller(), hideAllEditPanels = function () {
        $("#editGuest").hide();
        $("#editGuest").find("input").val("");
        $("#editPlan").hide();
        $("#editPlan").find("input").val("");
        $("#txtGuestName").change(function (e) {
            var previousGuest = {
                name: selectedGuestEdit.name
            }, currentGuest = {
                name: $(e.currentTarget).val()
            };
            if (previousGuest.name !== currentGuest.name) {
                controller.ac.Call("EditGuest", {
                    guest: selectedGuestEdit.id,
                    previous: previousGuest,
                    current: currentGuest
                });
            }
        });
        //$("#txtPlanName").change(function (e) { });
    }, showEditGuest = function (guest) {
        selectedGuestEdit = guest;
        hideAllEditPanels();
        $("#editGuest").show();
        $("#txtGuestName").val(guest.name);
    }, 
    /*showEditPlan = function (plan) {
        hideAllEditPanels();
        $("#editPlan").show();
        $("#txtPlanName").val(plan.name);
    },*/
    deletePlanData = function () {
        window.console.log("Attempting to deletePlanData");
        if (window.confirm("Are you sure you want to delete all the tables in this plan?")) {
            clearData();
            if (socket) {
                socket.emit('deletePlanData', controller.ac.WrapMessage());
            }
        }
    }, animationTime = 300, colGuest = "yellow", colGuestStroke = "black", colGuestMoveStroke = "blue", colGuestSwapStroke = "purple", colTable = "purple", colTableStroke = "black", colTableSelectedStroke = "yellow", colToolbarBack = "cyan", colSeatSelectedStroke = "blue", colDisabled = "grey", Generic = {
        PathGetX: function (graphic) {
            var myGraphic = graphic || this.graphic;
            if (myGraphic) {
                return myGraphic.attr("ox");
            }
            return 0;
        },
        PathGetY: function (graphic) {
            var myGraphic = graphic || this.graphic;
            if (myGraphic) {
                return myGraphic.attr("oy");
            }
            return 0;
        },
        GetRotation: function (graphic) {
            var myGraphic = graphic || this.graphic;
            return myGraphic.attr("rotation") || 0;
        },
        ShapeGetX: function (graphic) {
            var myGraphic = graphic || this.graphic;
            return myGraphic.attr("cx");
        },
        ShapeGetY: function (graphic) {
            var myGraphic = graphic || this.graphic;
            return myGraphic.attr("cy");
        },
        SetRelativeGraphicPosition: function (position, graphic) {
            var myGraphic = graphic || this.graphic, rotation = this.rotation;
            myGraphic.attr({
                ox: position.x,
                oy: position.y
            });
            myGraphic.transform("t" + position.x + "," + position.y + "R" + rotation);
        },
        SetAbsoluteGraphicPosition: function (position, graphic) {
            var myGraphic = graphic || this.graphic;
            myGraphic.attr({
                ox: position.x,
                oy: position.y
            });
            myGraphic.transform("T" + position.x + "," + position.y);
        },
        SetShapeGraphicPosition: function (position, graphic) {
            this.graphic.attr({
                cx: position.x,
                cy: position.y
            });
        },
        SetRotation: function (r, graphic) {
            var myGraphic = graphic || this.graphic, currentX = this.GetX(), currentY = this.GetY(), rotation = r;
            myGraphic.transform("t" + currentX + "," + currentY + "R" + rotation);
        },
        Disable: function (graphic, colour) {
            var myGraphic = graphic || this.graphic, myColour = colour || colDisabled;
            myGraphic.PreviousColourFill = myGraphic.attr("fill");
            if (myGraphic) {
                myGraphic.animate({
                    "stroke-width": 1,
                    "fill": myColour
                }, animationTime);
            }
            /*graphic.mouseover(function (event) { });
            graphic.mouseout(function (event) { });*/
        },
        Enable: function (graphic, colour) {
            var myGraphic = graphic || this.graphic, myColour = colour || colTableSelectedStroke;
            myGraphic.PreviousColourFill = myGraphic.attr("fill");
            if (myGraphic) {
                myGraphic.animate({
                    "fill": myColour
                }, animationTime);
            }
            graphic.mouseover(function (event) {
                logEvent("Over ToolboxIcon");
                Generic.Highlight(this);
            });
            graphic.mouseout(function (event) {
                logEvent("Out ToolboxIcon");
                Generic.Unhighlight(this);
            });
        },
        Highlight: function (graphic, colour) {
            var myGraphic = graphic || this.graphic, myColour = colour || colTableSelectedStroke;
            myGraphic.PreviousColour = myGraphic.attr("stroke");
            if (myGraphic) {
                myGraphic.animate({
                    "stroke-width": 2,
                    "stroke": myColour
                }, animationTime);
            }
        },
        Unhighlight: function (graphic, colour) {
            var myGraphic = graphic || this.graphic, myColour = colour || myGraphic.PreviousColour;
            if (myGraphic) {
                myGraphic.animate({
                    "stroke-width": 1,
                    "stroke": myColour
                }, animationTime);
            }
        }
    }, requestPlan = function () {
        console.log(["Request new plan", controller.ac.WrapMessage()]);
        if (socket) {
            socket.emit('GetPlan', controller.ac.WrapMessage());
        }
    }, shapes = {
        guestOLD: "M -10 -10 L 10 -10 L 0 10 z",
        desk: "m-61,-30l0,60l120,0l0,-60c-45,20 -75,20 -120,0z",
        seat: "M -20 -10 L 20 -10 L 0 10 z",
        guest: "m5.35835,-0.51847c-0.611,-1.104 -1.359,-1.998 -2.109,-2.623c-0.875,0.641 -1.941,1.031 -3.103,1.031c-1.164,0 -2.231,-0.391 -3.105,-1.031c-0.75,0.625 -1.498,1.519 -2.111,2.623c-1.422,2.563 -1.578,5.192 -0.35,5.874c0.55,0.307 1.127,0.078 1.723,-0.496c-0.105,0.582 -0.166,1.213 -0.166,1.873c0,2.932 1.139,5.307 2.543,5.307c0.846,0 1.265,-0.865 1.466,-2.189c0.201,1.324 0.62,2.189 1.463,2.189c1.406,0 2.545,-2.375 2.545,-5.307c0,-0.66 -0.061,-1.291 -0.168,-1.873c0.598,0.574 1.174,0.803 1.725,0.496c1.228,-0.682 1.069,-3.311 -0.353,-5.874zm-5.213,-2.592c2.362,0 4.278,-1.916 4.278,-4.279s-1.916,-4.279 -4.278,-4.279c-2.363,0 -4.28,1.916 -4.28,4.279s1.917,4.279 4.28,4.279z",
        logogithub: "M28.436,15.099c-1.201-0.202-2.451-0.335-3.466-0.371l-0.179-0.006c0.041-0.09,0.072-0.151,0.082-0.16c0.022-0.018,0.04-0.094,0.042-0.168c0-0.041,0.018-0.174,0.046-0.35c0.275,0.01,0.64,0.018,1.038,0.021c1.537,0.012,3.145,0.136,4.248,0.331c0.657,0.116,0.874,0.112,0.389-0.006c-0.491-0.119-1.947-0.294-3.107-0.37c-0.779-0.053-1.896-0.073-2.554-0.062c0.019-0.114,0.041-0.241,0.064-0.371c0.093-0.503,0.124-1.009,0.126-2.016c0.002-1.562-0.082-1.992-0.591-3.025c-0.207-0.422-0.441-0.78-0.724-1.104c0.247-0.729,0.241-1.858-0.015-2.848c-0.211-0.812-0.285-0.864-1.021-0.708C22.19,4.019,21.69,4.2,21.049,4.523c-0.303,0.153-0.721,0.391-1.024,0.578c-0.79-0.278-1.607-0.462-2.479-0.561c-0.884-0.1-3.051-0.044-3.82,0.098c-0.752,0.139-1.429,0.309-2.042,0.511c-0.306-0.189-0.75-0.444-1.067-0.604C9.973,4.221,9.473,4.041,8.847,3.908c-0.734-0.157-0.81-0.104-1.02,0.708c-0.26,1.003-0.262,2.151-0.005,2.878C7.852,7.577,7.87,7.636,7.877,7.682c-1.042,1.312-1.382,2.78-1.156,4.829c0.059,0.534,0.15,1.024,0.277,1.473c-0.665-0.004-1.611,0.02-2.294,0.064c-1.162,0.077-2.618,0.25-3.109,0.369c-0.484,0.118-0.269,0.122,0.389,0.007c1.103-0.194,2.712-0.32,4.248-0.331c0.29-0.001,0.561-0.007,0.794-0.013c0.07,0.237,0.15,0.463,0.241,0.678L7.26,14.759c-1.015,0.035-2.264,0.168-3.465,0.37c-0.901,0.151-2.231,0.453-2.386,0.54c-0.163,0.091-0.03,0.071,0.668-0.106c1.273-0.322,2.928-0.569,4.978-0.741l0.229-0.02c0.44,1.022,1.118,1.802,2.076,2.41c0.586,0.373,1.525,0.756,1.998,0.816c0.13,0.016,0.508,0.094,0.84,0.172c0.333,0.078,0.984,0.195,1.446,0.262h0.011c-0.009,0.006-0.017,0.01-0.025,0.016c-0.56,0.291-0.924,0.744-1.169,1.457c-0.11,0.033-0.247,0.078-0.395,0.129c-0.529,0.18-0.735,0.217-1.271,0.221c-0.556,0.004-0.688-0.02-1.02-0.176c-0.483-0.225-0.933-0.639-1.233-1.133c-0.501-0.826-1.367-1.41-2.089-1.41c-0.617,0-0.734,0.25-0.288,0.615c0.672,0.549,1.174,1.109,1.38,1.537c0.116,0.24,0.294,0.611,0.397,0.824c0.109,0.227,0.342,0.535,0.564,0.748c0.522,0.498,1.026,0.736,1.778,0.848c0.504,0.074,0.628,0.074,1.223-0.002c0.287-0.035,0.529-0.076,0.746-0.127c0,0.244,0,0.525,0,0.855c0,1.766-0.021,2.334-0.091,2.5c-0.132,0.316-0.428,0.641-0.716,0.787c-0.287,0.146-0.376,0.307-0.255,0.455c0.067,0.08,0.196,0.094,0.629,0.066c0.822-0.051,1.403-0.355,1.699-0.891c0.095-0.172,0.117-0.518,0.147-2.318c0.032-1.953,0.046-2.141,0.173-2.42c0.077-0.166,0.188-0.346,0.25-0.395c0.104-0.086,0.111,0.084,0.111,2.42c-0.001,2.578-0.027,2.889-0.285,3.385c-0.058,0.113-0.168,0.26-0.245,0.33c-0.135,0.123-0.192,0.438-0.098,0.533c0.155,0.154,0.932-0.088,1.356-0.422c0.722-0.572,0.808-1.045,0.814-4.461l0.003-2.004l0.219,0.021l0.219,0.02l0.036,2.621c0.041,2.951,0.047,2.994,0.549,3.564c0.285,0.322,0.572,0.5,1.039,0.639c0.625,0.188,0.813-0.102,0.393-0.605c-0.457-0.547-0.479-0.756-0.454-3.994c0.017-2.076,0.017-2.076,0.151-1.955c0.282,0.256,0.336,0.676,0.336,2.623c0,2.418,0.069,2.648,0.923,3.07c0.399,0.195,0.511,0.219,1.022,0.221c0.544,0.002,0.577-0.006,0.597-0.148c0.017-0.115-0.05-0.193-0.304-0.348c-0.333-0.205-0.564-0.467-0.709-0.797c-0.055-0.127-0.092-0.959-0.117-2.672c-0.036-2.393-0.044-2.502-0.193-2.877c-0.201-0.504-0.508-0.902-0.897-1.166c-0.101-0.066-0.202-0.121-0.333-0.162c0.161-0.016,0.317-0.033,0.468-0.055c1.572-0.209,2.403-0.383,3.07-0.641c1.411-0.543,2.365-1.445,2.882-2.724c0.046-0.114,0.092-0.222,0.131-0.309l0.398,0.033c2.051,0.173,3.706,0.42,4.979,0.743c0.698,0.177,0.831,0.198,0.668,0.105C30.666,15.551,29.336,15.25,28.436,15.099zM22.422,15.068c-0.233,0.512-0.883,1.17-1.408,1.428c-0.518,0.256-1.33,0.451-2.25,0.544c-0.629,0.064-4.137,0.083-4.716,0.026c-1.917-0.188-2.991-0.557-3.783-1.296c-0.75-0.702-1.1-1.655-1.039-2.828c0.039-0.734,0.216-1.195,0.679-1.755c0.421-0.51,0.864-0.825,1.386-0.985c0.437-0.134,1.778-0.146,3.581-0.03c0.797,0.051,1.456,0.051,2.252,0c1.886-0.119,3.145-0.106,3.61,0.038c0.731,0.226,1.397,0.834,1.797,1.644c0.18,0.362,0.215,0.516,0.241,1.075C22.808,13.699,22.675,14.517,22.422,15.068zM12.912,11.762c-1.073-0.188-1.686,1.649-0.863,2.587c0.391,0.445,0.738,0.518,1.172,0.248c0.402-0.251,0.62-0.72,0.62-1.328C13.841,12.458,13.472,11.862,12.912,11.762zM19.425,11.872c-1.073-0.188-1.687,1.647-0.864,2.586c0.392,0.445,0.738,0.519,1.173,0.247c0.401-0.25,0.62-0.72,0.62-1.328C20.354,12.569,19.985,11.971,19.425,11.872zM16.539,15.484c-0.023,0.074-0.135,0.184-0.248,0.243c-0.286,0.147-0.492,0.096-0.794-0.179c-0.187-0.169-0.272-0.258-0.329-0.081c-0.053,0.164,0.28,0.493,0.537,0.594c0.236,0.094,0.405,0.097,0.661-0.01c0.254-0.106,0.476-0.391,0.476-0.576C16.842,15.303,16.595,15.311,16.539,15.484zM16.222,14.909c0.163-0.144,0.2-0.44,0.044-0.597s-0.473-0.133-0.597,0.043c-0.144,0.206-0.067,0.363,0.036,0.53C15.865,15.009,16.08,15.034,16.222,14.909z",
        logonodejs: "M4.783,4.458L2.59,3.196C2.553,3.174,2.511,3.163,2.469,3.161H2.447C2.405,3.163,2.363,3.174,2.326,3.196L0.133,4.458C0.051,4.505,0,4.593,0,4.688l0.005,3.398c0,0.047,0.024,0.092,0.066,0.114c0.041,0.024,0.091,0.024,0.132,0l1.303-0.746c0.083-0.049,0.132-0.136,0.132-0.229V5.637c0-0.095,0.05-0.183,0.132-0.229l0.555-0.32c0.041-0.023,0.086-0.035,0.132-0.035c0.045,0,0.092,0.012,0.132,0.035l0.555,0.32c0.082,0.047,0.133,0.135,0.133,0.229v1.588c0,0.094,0.051,0.182,0.132,0.229l1.303,0.746c0.041,0.024,0.092,0.024,0.132,0c0.041-0.022,0.066-0.067,0.066-0.114l0.004-3.398C4.915,4.593,4.865,4.505,4.783,4.458zM17.93,0.745l-1.305-0.729c-0.042-0.023-0.091-0.022-0.132,0.001c-0.041,0.024-0.065,0.067-0.065,0.114v3.365c0,0.033-0.018,0.064-0.046,0.081s-0.064,0.017-0.093,0l-0.549-0.316c-0.082-0.047-0.183-0.047-0.265,0l-2.193,1.266c-0.082,0.047-0.133,0.135-0.133,0.229V7.29c0,0.095,0.051,0.182,0.132,0.229l2.194,1.267c0.082,0.048,0.183,0.048,0.265,0l2.194-1.267c0.082-0.048,0.133-0.135,0.133-0.229V0.977C18.066,0.88,18.014,0.792,17.93,0.745zM16.421,6.458c0,0.023-0.013,0.045-0.033,0.057l-0.753,0.435c-0.021,0.012-0.045,0.012-0.066,0l-0.753-0.435c-0.021-0.012-0.033-0.034-0.033-0.057v-0.87c0-0.023,0.013-0.045,0.033-0.058l0.753-0.435c0.021-0.012,0.045-0.012,0.066,0l0.753,0.435c0.021,0.012,0.033,0.034,0.033,0.058V6.458zM24.473,4.493l-2.18-1.266c-0.082-0.047-0.183-0.048-0.265,0l-2.193,1.266c-0.082,0.047-0.132,0.135-0.132,0.229v2.532c0,0.096,0.051,0.184,0.133,0.23l2.18,1.242c0.08,0.045,0.179,0.046,0.26,0.001l1.318-0.732c0.042-0.023,0.067-0.067,0.068-0.115c0-0.048-0.025-0.092-0.066-0.116l-2.207-1.266c-0.041-0.023-0.066-0.067-0.066-0.115V5.59c0-0.047,0.025-0.091,0.065-0.115l0.688-0.396c0.041-0.024,0.091-0.024,0.132,0l0.688,0.396c0.041,0.023,0.066,0.067,0.066,0.115v0.625c0,0.047,0.025,0.091,0.066,0.114c0.041,0.024,0.092,0.024,0.132,0l1.314-0.764c0.081-0.047,0.132-0.135,0.132-0.229V4.722C24.605,4.628,24.555,4.541,24.473,4.493zM11.363,4.48L9.169,3.214c-0.082-0.047-0.183-0.047-0.265,0L6.711,4.48C6.629,4.527,6.579,4.615,6.579,4.709v2.534c0,0.095,0.051,0.182,0.133,0.229l2.193,1.267c0.082,0.048,0.183,0.048,0.265,0l2.193-1.267c0.082-0.048,0.132-0.135,0.132-0.229V4.709C11.495,4.615,11.445,4.527,11.363,4.48zM31.019,4.382L28.95,3.187c-0.13-0.074-0.304-0.074-0.435,0l-2.068,1.195c-0.135,0.077-0.218,0.222-0.218,0.377v2.386c0,0.156,0.083,0.301,0.218,0.378l0.542,0.312c0.263,0.13,0.356,0.13,0.477,0.13c0.389,0,0.612-0.236,0.612-0.646V4.962c0-0.033-0.027-0.06-0.06-0.06h-0.263c-0.033,0-0.061,0.026-0.061,0.06v2.356c0,0.182-0.188,0.363-0.495,0.209l-0.566-0.326c-0.021-0.012-0.033-0.033-0.033-0.057V4.759c0-0.023,0.013-0.045,0.033-0.057l2.067-1.193c0.019-0.011,0.044-0.011,0.063,0l2.067,1.193c0.02,0.012,0.032,0.034,0.032,0.057v2.386c0,0.023-0.013,0.046-0.032,0.057l-2.068,1.193c-0.018,0.012-0.045,0.012-0.063,0l-0.53-0.314c-0.017-0.01-0.036-0.013-0.052-0.004c-0.146,0.083-0.175,0.094-0.312,0.143c-0.034,0.012-0.084,0.031,0.019,0.09l0.691,0.408c0.065,0.038,0.141,0.059,0.217,0.059s0.151-0.021,0.218-0.059l2.068-1.194c0.134-0.078,0.217-0.222,0.217-0.378V4.759C31.235,4.604,31.152,4.459,31.019,4.382zM29.371,6.768c-0.548,0-0.668-0.138-0.708-0.41c-0.005-0.029-0.029-0.051-0.06-0.051h-0.268c-0.033,0-0.06,0.026-0.06,0.06c0,0.349,0.189,0.765,1.095,0.765c0.655,0,1.031-0.259,1.031-0.709c0-0.447-0.302-0.566-0.938-0.65c-0.643-0.085-0.708-0.128-0.708-0.279c0-0.125,0.056-0.29,0.531-0.29c0.425,0,0.581,0.091,0.646,0.378c0.006,0.027,0.03,0.047,0.059,0.047h0.269c0.017,0,0.032-0.007,0.044-0.019c0.011-0.013,0.017-0.029,0.016-0.046c-0.042-0.493-0.37-0.723-1.032-0.723c-0.59,0-0.941,0.249-0.941,0.666c0,0.453,0.35,0.578,0.916,0.634c0.677,0.066,0.729,0.166,0.729,0.298C29.992,6.669,29.807,6.768,29.371,6.768zM22.128,5.446l-0.42,0.243c-0.016,0.009-0.025,0.026-0.025,0.044v0.486c0,0.019,0.01,0.035,0.025,0.044l0.42,0.243c0.016,0.009,0.035,0.009,0.052,0l0.421-0.243c0.016-0.009,0.025-0.025,0.025-0.044V5.733c0-0.018-0.01-0.035-0.025-0.044L22.18,5.446C22.163,5.438,22.144,5.438,22.128,5.446z",
        logoraph: "M27.777,18.941c0.584-0.881,0.896-1.914,0.896-2.998c0-1.457-0.567-2.826-1.598-3.854l-6.91-6.911l-0.003,0.002c-0.985-0.988-2.35-1.6-3.851-1.6c-1.502,0-2.864,0.612-3.85,1.6H12.46l-6.911,6.911c-1.031,1.029-1.598,2.398-1.598,3.854c0,1.457,0.567,2.826,1.598,3.854l6.231,6.229c0.25,0.281,0.512,0.544,0.789,0.785c1.016,0.961,2.338,1.49,3.743,1.49c1.456,0,2.825-0.565,3.854-1.598l6.723-6.725c0.021-0.019,0.034-0.032,0.051-0.051l0.14-0.138c0.26-0.26,0.487-0.54,0.688-0.838c0.004-0.008,0.01-0.015,0.014-0.021L27.777,18.941zM26.658,15.946c0,0.678-0.197,1.326-0.561,1.879c-0.222,0.298-0.447,0.559-0.684,0.784L25.4,18.625c-1.105,1.052-2.354,1.35-3.414,1.35c-0.584,0-1.109-0.09-1.523-0.195c-2.422-0.608-5.056-2.692-6.261-5.732c0.649,0.274,1.362,0.426,2.11,0.426c2.811,0,5.129-2.141,5.415-4.877l3.924,3.925C26.301,14.167,26.658,15.029,26.658,15.946zM16.312,5.6c1.89,0,3.426,1.538,3.426,3.427c0,1.89-1.536,3.427-3.426,3.427c-1.889,0-3.426-1.537-3.426-3.427C12.886,7.138,14.423,5.6,16.312,5.6zM6.974,18.375c-0.649-0.648-1.007-1.512-1.007-2.429c0-0.917,0.357-1.78,1.007-2.428l2.655-2.656c-0.693,2.359-0.991,4.842-0.831,7.221c0.057,0.854,0.175,1.677,0.345,2.46L6.974,18.375zM11.514,11.592c0.583,4.562,4.195,9.066,8.455,10.143c0.693,0.179,1.375,0.265,2.033,0.265c0.01,0,0.02,0,0.027,0l-3.289,3.289c-0.648,0.646-1.512,1.006-2.428,1.006c-0.638,0-1.248-0.177-1.779-0.5l0.001-0.002c-0.209-0.142-0.408-0.295-0.603-0.461c-0.015-0.019-0.031-0.026-0.046-0.043l-0.665-0.664c-1.367-1.567-2.227-3.903-2.412-6.671C10.669,15.856,10.921,13.673,11.514,11.592",
        logotwitter: "M14.605,13.11c0.913-2.851,2.029-4.698,3.313-6.038c0.959-1,1.453-1.316,0.891-0.216c0.25-0.199,0.606-0.464,0.885-0.605c1.555-0.733,1.442-0.119,0.373,0.54c2.923-1.045,2.82,0.286-0.271,0.949c2.527,0.047,5.214,1.656,5.987,5.077c0.105,0.474-0.021,0.428,0.464,0.514c1.047,0.186,2.03,0.174,2.991-0.13c-0.104,0.708-1.039,1.167-2.497,1.471c-0.541,0.112-0.651,0.083-0.005,0.229c0.799,0.179,1.69,0.226,2.634,0.182c-0.734,0.846-1.905,1.278-3.354,1.296c-0.904,3.309-2.976,5.678-5.596,7.164c-6.152,3.492-15.108,2.984-19.599-3.359c2.947,2.312,7.312,2.821,10.555-0.401c-2.125,0-2.674-1.591-0.99-2.449c-1.595-0.017-2.608-0.521-3.203-1.434c-0.226-0.347-0.229-0.374,0.14-0.64c0.405-0.293,0.958-0.423,1.528-0.467c-1.651-0.473-2.66-1.335-3.009-2.491c-0.116-0.382-0.134-0.363,0.256-0.462c0.38-0.097,0.87-0.148,1.309-0.17C6.11,10.88,5.336,9.917,5.139,8.852c-0.186-1.006,0.005-0.748,0.758-0.46C9.263,9.68,12.619,11.062,14.605,13.11L14.605,13.11z",
        iconback: "M21.871,9.814 15.684,16.001 21.871,22.188 18.335,25.725 8.612,16.001 18.335,6.276z",
        iconforward: "M10.129,22.186 16.316,15.999 10.129,9.812 13.665,6.276 23.389,15.999 13.665,25.725z",
        icontrash: "M20.826,5.75l0.396,1.188c1.54,0.575,2.589,1.44,2.589,2.626c0,2.405-4.308,3.498-8.312,3.498c-4.003,0-8.311-1.093-8.311-3.498c0-1.272,1.21-2.174,2.938-2.746l0.388-1.165c-2.443,0.648-4.327,1.876-4.327,3.91v2.264c0,1.224,0.685,2.155,1.759,2.845l0.396,9.265c0,1.381,3.274,2.5,7.312,2.5c4.038,0,7.313-1.119,7.313-2.5l0.405-9.493c0.885-0.664,1.438-1.521,1.438-2.617V9.562C24.812,7.625,23.101,6.42,20.826,5.75zM11.093,24.127c-0.476-0.286-1.022-0.846-1.166-1.237c-1.007-2.76-0.73-4.921-0.529-7.509c0.747,0.28,1.58,0.491,2.45,0.642c-0.216,2.658-0.43,4.923,0.003,7.828C11.916,24.278,11.567,24.411,11.093,24.127zM17.219,24.329c-0.019,0.445-0.691,0.856-1.517,0.856c-0.828,0-1.498-0.413-1.517-0.858c-0.126-2.996-0.032-5.322,0.068-8.039c0.418,0.022,0.835,0.037,1.246,0.037c0.543,0,1.097-0.02,1.651-0.059C17.251,18.994,17.346,21.325,17.219,24.329zM21.476,22.892c-0.143,0.392-0.69,0.95-1.165,1.235c-0.474,0.284-0.817,0.151-0.754-0.276c0.437-2.93,0.214-5.209-0.005-7.897c0.881-0.174,1.708-0.417,2.44-0.731C22.194,17.883,22.503,20.076,21.476,22.892zM11.338,9.512c0.525,0.173,1.092-0.109,1.268-0.633h-0.002l0.771-2.316h4.56l0.771,2.316c0.14,0.419,0.53,0.685,0.949,0.685c0.104,0,0.211-0.017,0.316-0.052c0.524-0.175,0.808-0.742,0.633-1.265l-1.002-3.001c-0.136-0.407-0.518-0.683-0.945-0.683h-6.002c-0.428,0-0.812,0.275-0.948,0.683l-1,2.999C10.532,8.77,10.815,9.337,11.338,9.512z"
    }, inrange = false, dragThreshold = 15, scene = {
        SeatConflictCheck: function (thisSeat) {
            var i = 0, l = seatList.length, seatCheck;
            logEvent("scene.SeatConflictCheck");
            for (i = 0; i < l; i += 1) {
                seatCheck = seatList[i];
                if (seatCheck.guest === thisSeat.guest && seatCheck !== thisSeat) {
                    logEvent("Seat conflict");
                    seatCheck.guest = false;
                    seatCheck.isoccupied = false;
                }
            }
        },
        GetCachedListOfSeatAreas: function () {
            var i = 0, l = seatList.length, possibleSeats = [];
            for (i = 0; i < l; i += 1) {
                possibleSeats[i] = {
                    t: seatList[i].GetY() - dragThreshold,
                    r: seatList[i].GetX() + dragThreshold,
                    b: seatList[i].GetY() + dragThreshold,
                    l: seatList[i].GetX() - dragThreshold
                };
            }
            return possibleSeats;
        }
    }, pathGenerateCircularArc = function (point1, point2, radius) {
        point1.x = point1.x || 0;
        point1.y = point1.y || 0;
        point2.x = point2.x || 0;
        point2.y = point2.y || 0;
        return "M" + point1.x + " " + point1.y + " L " + point1.x + " " + point1.y + " A " + radius + " " + radius + " 0 0 1 " + point2.x + " " + point2.y;
    }, ToolBar = function () {
        var lnkUndo = paper.path(shapes.iconback), lnkRedo = paper.path(shapes.iconforward), lnkDelete = paper.path(shapes.icontrash), lnkGitH = paper.path(shapes.logogithub), lnkNode = paper.path(shapes.logonodejs), lnkRaph = paper.path(shapes.logoraph), lnkTwit = paper.path(shapes.logotwitter);
        this.background = paper.rect(600, 20, 200, 600, 5);
        this.background.attr({
            fill: colToolbarBack,
            stroke: colTableStroke,
            model: this
        });
        this.toolBox = [];
        this.generateGuestSelect = function () {
            var obj = {
                graphic: undefined,
                type: "guest",
                createObject: function (x, y) {
                    if (!x) {
                        x = 30;
                    }
                    if (!y) {
                        y = 30;
                    }
                    return controller.ac.Call("AddGuest", {
                        id: controller.NextGuestID(),
                        name: "Example New Guest",
                        x: x,
                        y: y
                    });
                }
            }, guestSelect = paper.path(shapes.guest);
            guestSelect.attr({
                fill: colGuest,
                stroke: colGuestStroke,
                model: obj,
                ox: 0,
                oy: 0
            });
            obj.graphic = guestSelect;
            return obj;
        };
        this.generateTableSelect = function () {
            var obj = {
                graphic: undefined,
                type: "table",
                createObject: function (x, y) {
                    if (!x) {
                        x = 200;
                    }
                    if (!y) {
                        y = 200;
                    }
                    controller.ac.Call("AddTable", {
                        id: controller.NextTableID(),
                        type: "table",
                        x: x,
                        y: y,
                        seatCount: 5
                    });
                }
            }, tableSelect = paper.circle(0, 0, 20);
            tableSelect.attr({
                fill: colTable,
                stroke: colTableStroke,
                model: obj,
                ox: 0,
                oy: 0,
                type: "table"
            });
            obj.graphic = tableSelect;
            return obj;
        };
        this.generateDeskSelect = function () {
            var obj = {
                graphic: undefined,
                type: "desk",
                createObject: function (x, y) {
                    if (!x) {
                        x = 400;
                    }
                    if (!y) {
                        y = 400;
                    }
                    controller.ac.Call("AddTable", {
                        id: controller.NextTableID(),
                        type: "desk",
                        x: x,
                        y: y,
                        rotation: 90
                    });
                }
            }, tableSelect = paper.path(shapes.desk);
            tableSelect.attr({
                fill: colTable,
                stroke: colTableStroke,
                model: obj,
                ox: 0,
                oy: 0,
                type: "desk"
            });
            obj.graphic = tableSelect;
            return obj;
        };
        this.AddToolBoxItem = function (obj, helperText, type) {
            var item = obj.graphic, offsetY = (this.toolBox.length * 50), start = function (event) {
                this.ox = this.attr("ox");
                this.oy = this.attr("oy");
                this.animate({
                    "stroke-width": 3,
                    opacity: 0.7
                }, animationTime);
            }, move = function (mx, my) {
                var model = this.attr("model"), mouseCX = this.ox + mx, mouseCY = this.oy + my, myStroke = colGuestStroke;
                model.setGraphicPosition({
                    x: mouseCX,
                    y: mouseCY
                });
                this.attr({
                    stroke: myStroke
                });
            }, up = function () {
                var dfpCreateGuest, model = this.attr("model"), inToolBox = MyToolBar.background.getBBox().x < model.GetX();
                if (inToolBox) {
                    dfpCreateGuest = model.createObject();
                }
                else {
                    dfpCreateGuest = model.createObject(model.GetX(), model.GetY());
                }
                this.animate({
                    "stroke-width": 2,
                    opacity: 1
                }, animationTime);
                model.setGraphicPosition({
                    x: this.ox,
                    y: this.oy
                });
                $.when(dfpCreateGuest).done(function () {
                    showEditGuest(model);
                });
            };
            this.toolBox.push(obj);
            this.type = type;
            item.transform("t650," + offsetY);
            item.attr({
                ox: 650,
                oy: offsetY
            });
            item.mouseover(function (event) {
                logEvent("Over ToolboxItem");
                Generic.Highlight(this);
                this.attr("model").text = paper.text(this.attr("ox") + 75, this.attr("oy"), helperText);
                this.attr("model").text.show();
            });
            item.mouseout(function (event) {
                logEvent("Out ToolboxItem");
                Generic.Unhighlight(this);
                if (this.attr("model").text) {
                    this.attr("model").text.hide();
                }
            });
            obj.setGraphicPosition = Generic.SetRelativeGraphicPosition;
            obj.GetX = Generic.PathGetX;
            obj.GetY = Generic.PathGetY;
            item.drag(move, start, up);
        };
        this.AddToolBoxItem(this.generateGuestSelect(), "Add new person", "guest");
        this.AddToolBoxItem(this.generateTableSelect(), "Add new table", "table");
        this.AddToolBoxItem(this.generateDeskSelect(), "Add new desk", "desk");
        this.iconLeft = 0;
        this.iconTop = 450;
        this.enableButton = function (icon) {
            Generic.Enable(icon);
        };
        this.disableButton = function (icon) {
            Generic.Disable(icon);
        };
        this.applyStylingToIcon = function (icon, text, clickevent) {
            this.iconLeft = this.iconLeft + 40;
            var iconX = 600 + this.iconLeft;
            icon.attr({
                fill: colGuest,
                stroke: colGuestStroke,
                model: this,
                transform: "t" + iconX + "," + this.iconTop
            });
            icon.mouseover(function (event) {
                logEvent("Over ToolboxIcon");
                Generic.Highlight(this);
            });
            icon.mouseout(function (event) {
                logEvent("Out ToolboxIcon");
                Generic.Unhighlight(this);
            });
            icon.click(clickevent);
        };
        this.applyStylingToIcon(lnkUndo, "undo", function (e) {
            controller.ac.Undo();
        });
        this.applyStylingToIcon(lnkRedo, "redo", function (e) {
            controller.ac.Redo();
        });
        this.applyStylingToIcon(lnkDelete, "delete", function (e) {
            deletePlanData();
        });
        this.disableButton(lnkUndo);
        this.iconLeft = 0;
        this.iconTop = 500;
        this.linkTo = function (link) {
            window.alert(link);
        };
        this.applyStylingToIcon(lnkGitH, "Fork me on github", function (e) {
            controller.createNewPlan();
        });
        this.applyStylingToIcon(lnkNode, "Using Node.js on the server", function (e) {
            this.linkTo("hello");
        });
        this.applyStylingToIcon(lnkRaph, "Interface using RaphaelJS", function (e) {
            this.linkTo("hello");
        });
        this.applyStylingToIcon(lnkTwit, "Contact me via Twitter", function (e) {
            this.linkTo("hello");
        });
    }, Guest = function (name, x, y, id, callback) {
        this.id = id || controller.NextGuestID();
        logEvent("Create Guest");
        this.name = name;
        this.text = false;
        this.graphic = paper.path(shapes.guest); //deskShape);//
        this.graphic.attr({
            ox: 0,
            oy: 0
        });
        this.graphic.attr({
            fill: colGuest,
            stroke: colGuestStroke,
            model: this
        });
        this.SetName = function (newName) {
            this.name = newName;
            this.showHelpText(this.name);
        };
        this.graphic.mouseover(function (event) {
            Generic.Highlight(this, "black");
        });
        this.graphic.mouseout(function (event) {
            this.animate({
                "stroke-width": 1
            }, animationTime);
        });
        this.startDrag = function () {
            this.hideName();
            this.ghost = this.graphic.clone();
            this.ghost.attr("opacity", 0.3);
        };
        this.overEmptySeat = function (position, seat) {
            this.showHelpText("Move " + this.name + " to this seat", position);
            //this.graphic.attr("rotation", seat.GetRotation());
            this.SetRotation(seat.GetRotation());
        };
        this.SetBaseRotation = Generic.SetRotation;
        this.SetRotation = function (rotation) {
            this.rotation = rotation;
            this.SetBaseRotation(rotation);
        };
        this.overOccupiedSeat = function (position, seat) {
            this.showHelpText("Swap " + this.name + " with " + seat.guest.name, position);
            seat.guest.hideName();
        };
        this.overNewSeat = function (position, seat) {
            this.showHelpText("Create new seat and move " + this.name + " to it", position);
            this.SetRotation(seat.GetRotation());
        };
        this.moveGhostToNewLocation = function () {
            if (this.ghost) {
                this.ghost.show();
                this.ghost.model = this;
                this.ghost.animate({
                    transform: this.graphic.attr("transform")
                }, animationTime, "<", function () {
                    this.model.showHelpText(this.model.name);
                    this.model.graphic.animate({
                        opacity: 1
                    }, animationTime);
                    this.hide();
                });
            }
        };
        this.removeFromSeat = function () {
            var dfd = $.Deferred(), seatCX = 0, seatCY = 0;
            logEvent("remove from seat " + this.name);
            this.seat.RemoveGuest();
            this.seat = false;
            this.animateToSpot(seatCX, seatCY, 0, function () {
                console.log("Removed guest from seat");
                dfd.resolve();
            });
            return dfd.promise();
        };
        this.animateToSpot = function (x, y, rotation, callback) {
            if (this.graphic) {
                this.graphic.model = this;
                this.graphic.animate({
                    transform: "t" + x + "," + y + "R" + rotation
                }, animationTime, ">", function () {
                    this.attr({
                        ox: x,
                        oy: y
                    });
                    this.model.moveGhostToNewLocation();
                    this.model.showHelpText(this.model.name);
                    this.model.SetRotation(rotation);
                    if (callback) {
                        callback();
                    }
                });
            }
        };
        this.swapWithGuestAt = function (seat) {
            var meGuest = this, meSeat = this.seat, themGuest = seat.guest, themSeat = seat;
            logEvent("Swap " + meGuest.name + " from seat occupied by " + themGuest.name + ".");
            if (meSeat) {
                themGuest.moveToSeat(meSeat);
            }
            else {
                themGuest.removeFromSeat();
            }
            meGuest.moveToSeat(themSeat);
            //Consider for swapping 
            //object making them go 
            //in a curved line 
            //rather than straight.
        };
        this.makeSureMainGraphicIsInRightPlace = function makeSureMainGraphicIsInRightPlace(seat, callback) {
            var myCX = this.GetX(), myCY = this.GetY(), seatCX = seat.GetX(), seatCY = seat.GetY(), seatRotation = seat.GetRotation();
            if (myCX !== seatCX || myCY !== seatCY) {
                logEvent("Seat not in right place for " + this.name);
                this.animateToSpot(seatCX, seatCY, seatRotation, callback);
            }
            else {
                this.SetRotation(seatRotation);
                this.moveGhostToNewLocation();
                if (callback) {
                    callback();
                }
            }
        };
        this.moveToSeat = function moveToSeat(seat) {
            var dfd = $.Deferred();
            if (this.ghost) {
                this.ghost.toFront();
            }
            this.graphic.toFront();
            logEvent("seat move for " + this.name);
            this.makeSureMainGraphicIsInRightPlace(seat, function CallbackMakeSureMainGraphicIsInRightPlace() {
                dfd.resolve();
            });
            this.seat = seat;
            this.seat.isoccupied = true;
            this.seat.guest = this;
            scene.SeatConflictCheck(this.seat);
            return dfd.promise();
        };
        this.GetX = Generic.PathGetX;
        this.GetY = Generic.PathGetY;
        this.Rotation = Generic.Rotation;
        this.setGraphicPositionBase = Generic.SetRelativeGraphicPosition;
        this.setGraphicPosition = function (position) {
            this.setGraphicPositionBase(position);
            if (this.text) {
                this.text.attr({
                    x: position.x,
                    y: position.y - 20
                });
            }
        };
        this.showHelpText = function (text, position) {
            if (!position) {
                position = {
                    x: this.graphic.attr("ox"),
                    y: this.graphic.attr("oy")
                };
            }
            if (!position.x) {
                position.x = this.graphic.attr("ox");
            }
            if (!position.y) {
                position.y = this.graphic.attr("oy");
            }
            if (text) {
                this.hideName();
                this.text = paper.text(position.x, position.y - 20, text);
                this.text.show();
            }
        };
        this.hideName = function () {
            if (this.text) {
                this.text.hide();
            }
        };
        this.remove = function () {
            if (this.text) {
                this.text.remove();
                this.text = null;
            }
            var dfd = $.Deferred(), contextModel = this;
            if (this.graphic) {
                this.graphic.stop();
                this.graphic.animate({
                    opacity: "0"
                }, animationTime, true, function () {
                    this.remove();
                    contextModel.graphic = null;
                    dfd.resolve();
                });
            }
            return dfd.promise();
        };
        this.setGraphicPosition({
            x: x,
            y: y
        });
        this.showHelpText(this.name);
        var start = function (event) {
            //bring this model to the front
            this.toFront();
            this.ox = this.attr("ox");
            this.oy = this.attr("oy");
            //get the model object
            var model = this.attr("model");
            model.startDrag();
            showEditGuest(model);
            possibleSeats = scene.GetCachedListOfSeatAreas();
            this.animate({
                "stroke-width": 3,
                opacity: 0.7
            }, animationTime);
        }, move = function (mx, my) {
            var model = this.attr("model"), mouseCX = this.ox + mx, mouseCY = this.oy + my, lockX = 0, lockY = 0, myStroke = colGuestStroke, i = 0, l = myTables.length, tableCheck, mySeat;
            inrange = false;
            //You could improve performance by only looping tables nearby to the cursor.
            for (i = 0, l = myTables.length; i < l; i += 1) {
                tableCheck = myTables[i];
                mySeat = tableCheck.CheckOverSeat(mouseCX, mouseCY);
                if (mySeat) {
                    inrange = true;
                    lockX = mySeat.GetX();
                    lockY = mySeat.GetY();
                    if (mySeat.ismarker) {
                        myStroke = colGuestMoveStroke;
                        model.overNewSeat({
                            x: lockX,
                            y: lockY
                        }, mySeat);
                    }
                    else if (mySeat.isoccupied) {
                        myStroke = colGuestSwapStroke;
                        model.overOccupiedSeat({
                            x: lockX,
                            y: lockY
                        }, mySeat);
                    }
                    else {
                        myStroke = colGuestMoveStroke;
                        model.overEmptySeat({
                            x: lockX,
                            y: lockY
                        }, mySeat);
                    }
                }
            }
            if (inrange) {
                model.setGraphicPosition({
                    x: lockX,
                    y: lockY
                });
                this.attr({
                    stroke: myStroke
                });
            }
            else {
                model.hideName();
                model.setGraphicPosition({
                    x: mouseCX,
                    y: mouseCY
                });
            }
        }, up = function () {
            //*** NEED TO WRITE UP ON MARKER FUNCTION
            var model = this.attr("model"), i, l = myTables.length, tableCheck, mySeat;
            if (inrange) {
                for (i = 0, l = myTables.length; i < l; i += 1) {
                    tableCheck = myTables[i];
                    mySeat = tableCheck.CheckOverSeat(model.GetX(), model.GetY());
                    if (mySeat) {
                        inrange = true;
                        controller.MoveGuestToSeatArea(model, mySeat);
                    }
                }
            }
            else {
                model.ghost.hide();
                model.removeFromSeat();
            }
            this.animate({
                "stroke-width": 2
            }, animationTime);
        };
        this.graphic.drag(move, start, up);
        this.ToJson = function () {
            return {
                name: this.name,
                x: this.GetX(),
                y: this.GetY()
            };
        };
        if (callback) {
            callback();
        }
    }, Seat = function (x, y, rotation, table, seatNumber, id, guest) {
        logEvent("Create Seat");
        this.id = id || controller.NextSeatID();
        this.table = table;
        this.rotation = rotation;
        this.graphic = paper.path(shapes.seat);
        this.seatNumber = seatNumber;
        this.SetRotation = function (rotation) {
            this.rotation = rotation;
            if (this.guest) {
                this.guest.SetRotation(rotation);
            }
            this.SetBaseRotation(rotation);
        };
        this.graphic.attr({
            ox: x,
            oy: y,
            fill: "blue",
            model: this
        });
        this.graphic.transform("...t" + x + "," + y);
        this.GetX = Generic.PathGetX;
        this.GetY = Generic.PathGetY;
        this.GetLoc = function () {
            var x = this.GetX() || 0, y = this.GetY() || 0;
            if ((x === 0) && (y === 0)) {
                return null;
            }
            return {
                x: x,
                y: y
            };
        };
        this.SetBaseRotation = Generic.SetRotation;
        this.setGraphicPositionBase = Generic.SetRelativeGraphicPosition;
        this.GetRotation = function () {
            return this.rotation;
        };
        this.setGraphicPositionCore = function (position) {
            this.setGraphicPositionBase(position);
            if (this.guest) {
                this.guest.setGraphicPosition(position);
            }
            this.t = this.GetY() - dragThreshold;
            this.r = this.GetX() + dragThreshold;
            this.b = this.GetY() + dragThreshold;
            this.l = this.GetX() - dragThreshold;
        };
        this.setGraphicPosition = function (pointTo, pointFrom) {
            var dfd = $.Deferred(), mypath;
            if (pointFrom) {
                mypath = pathGenerateCircularArc(pointFrom, pointTo, this.table.widthWithChairs);
                this.setGraphicPositionCore(pointFrom);
                this.graphic.animate({
                    transform: "t" + pointTo.x + "," + pointTo.y + "R" + pointTo.r
                }, animationTime, true, function () {
                    this.attr("model").setGraphicPositionCore(pointTo);
                    this.attr("model").SetRotation(pointTo.r);
                    console.log("placed seat");
                    dfd.resolve();
                });
            }
            else {
                this.setGraphicPositionCore(pointTo);
                dfd.resolve();
            }
            return dfd.promise();
        };
        this.RemoveGuest = function Seat_RemoveGuest() {
            if (this.guest) {
                logEvent("Remove seat for " + this.guest.name);
            }
            this.guest = false;
            this.isoccupied = false;
        };
        this.remove = function Seat_Remove() {
            console.log("delete seat");
            var dfd = $.Deferred(), contextModel = this;
            this.RemoveGuest();
            if (this.graphic) {
                this.graphic.stop();
                this.graphic.animate({
                    transform: "T0,0"
                }, animationTime, true, function () {
                    console.log("destroy seat graphic");
                    this.remove();
                    contextModel.graphic = null;
                    dfd.resolve();
                });
            }
            return dfd.promise();
        };
        this.RemoveGuest();
        seatList.push(this);
        this.ToJson = function () {
            var myGuest;
            if (this.guest) {
                myGuest = this.guest.ToJson();
            }
            return {
                type: "seat",
                rotation: this.rotation,
                x: this.GetX(),
                y: this.GetY(),
                guest: myGuest
            };
        };
        var myMouseOver = function (event) {
            Generic.Highlight(this);
            this.animate({
                fill: "red"
            }, animationTime);
        }, myMouseOut = function (event) {
            Generic.Unhighlight(this);
            this.animate({
                fill: "blue"
            }, animationTime);
        }, myMouseClick = function (event) {
            logEvent("click empty seat");
            this.unmouseout(myMouseOut); // Suggest to Rapheal that calling this with no functions clears the list?
            controller.ClickSeatRemove(this.attr("model"));
        };
        this.graphic.mouseover(myMouseOver);
        this.graphic.mouseout(myMouseOut);
        this.graphic.click(myMouseClick);
    }, SeatMarker = function (x, y, table, seatNumber, rotation) {
        logEvent("Create SeatMarker");
        this.ismarker = true;
        this.rotation = rotation;
        this.SetBaseRotation = Generic.SetRotation;
        this.GetRotation = function () {
            return this.rotation;
        };
        this.SetRotation = function (rotation) {
            this.rotation = rotation;
            this.SetBaseRotation(rotation);
        };
        this.table = table;
        this.seatNumber = seatNumber;
        this.graphic = paper.circle(x, y, 4);
        this.graphic.attr({
            fill: "blue",
            model: this
        });
        this.GetX = Generic.PathGetX;
        this.GetY = Generic.PathGetY;
        this.GetLoc = function () {
            var x = this.GetX() || 0, y = this.GetY() || 0;
            if ((x === 0) && (y === 0)) {
                return null;
            }
            return {
                x: x,
                y: y
            };
        };
        this.convertToSeat = function () {
            return this.table.addSeatFromMarker(this.seatNumber + 1);
        };
        this.setGraphicPositionBase = Generic.SetRelativeGraphicPosition;
        this.setGraphicPositionCore = function (position) {
            this.setGraphicPositionBase(position);
            this.t = this.GetY() - dragThreshold;
            this.r = this.GetX() + dragThreshold;
            this.b = this.GetY() + dragThreshold;
            this.l = this.GetX() - dragThreshold;
        };
        this.setGraphicPosition = function (pointTo, pointFrom) {
            if (pointFrom) {
                var mypath = pathGenerateCircularArc(pointFrom, pointTo, this.table.widthWithChairs), animateAlongPath = false;
                this.setGraphicPositionCore(pointFrom);
                this.graphic.animate({
                    transform: "t" + pointTo.x + "," + pointTo.y
                }, animationTime, true, function () {
                    this.attr("model").setGraphicPositionCore(pointTo);
                });
                if (animateAlongPath) {
                    if (this.graphic2) {
                        this.graphic2.stop();
                        this.graphic2.remove();
                    }
                    this.graphic2 = paper.path(mypath);
                    this.graphic2.attr({
                        fill: "green",
                        model: this,
                        opacity: 0.5
                    });
                }
            }
            else {
                this.setGraphicPositionCore(pointTo);
            }
        };
        this.remove = function SeatMarkerRemove() {
            var dfd = $.Deferred(), contextModel = this;
            console.log("delete seat marker");
            if (this.graphic) {
                this.graphic.stop();
                this.graphic.animate({
                    transform: "T0,0"
                }, animationTime, true, function () {
                    this.remove();
                    console.log("destroy seat marker graphic");
                    contextModel.graphic = null;
                    dfd.resolve();
                });
            }
            return dfd.promise();
        };
        this.graphic.mouseover(function (event) {
            Generic.Highlight(this);
            this.animate({
                fill: "red"
            }, animationTime);
        });
        this.graphic.mouseout(function (event) {
            Generic.Unhighlight(this);
            this.animate({
                fill: "blue"
            }, animationTime);
        });
        this.graphic.click(function (event) {
            logEvent("click seatmarker");
            var model = this.attr("model");
            controller.ClickAddSeatAtPosition(model.table, model.seatNumber + 1);
        });
    }, 
    /*GenerateCirclePath = function (x, y, r) {
        var s = "M" + x + "," + (y - r) + "A" + r + "," + r + ",0,1,1," + (x - 0.1) + "," + (y - r) + " z";
        return s;
    },*/
    RoundTable = function (x, y, seatCount, seatList, id, callback) {
        var i, l, start = function (event) {
            var model = this.attr("model"), i, l, s;
            this.ox = model.GetX();
            this.oy = model.GetY();
            model.previousPosition = {
                x: model.GetX(),
                y: model.GetY()
            };
            for (i = 0, l = model.tableSeatList.length; i < l; i += 1) {
                s = model.tableSeatList[i];
                s.graphic.attr({
                    fromTableX: s.GetX(),
                    fromTableY: s.GetY()
                });
            }
            for (i = 0, l = model.tableSeatAdditions.length; i < l; i += 1) {
                s = model.tableSeatAdditions[i];
                s.graphic.attr({
                    fromTableX: s.GetX(),
                    fromTableY: s.GetY()
                });
            }
            model.seatSet.attr({
                stroke: colSeatSelectedStroke
            });
            this.attr("stroke", colTableSelectedStroke);
        }, move = function (mx, my) {
            var model = this.attr("model"), mouseCX = this.ox + mx, mouseCY = this.oy + my, i, l, s;
            for (i = 0, l = model.tableSeatList.length; i < l; i += 1) {
                s = model.tableSeatList[i];
                s.setGraphicPosition({
                    x: s.graphic.attr("fromTableX") + mx,
                    y: s.graphic.attr("fromTableY") + my
                });
            }
            for (i = 0, l = model.tableSeatAdditions.length; i < l; i += 1) {
                s = model.tableSeatAdditions[i];
                s.setGraphicPosition({
                    x: s.graphic.attr("fromTableX") + mx,
                    y: s.graphic.attr("fromTableY") + my
                });
            }
            model.setGraphicPosition({
                x: mouseCX,
                y: mouseCY
            });
        }, up = function () {
            var model = this.attr("model");
            model.seatSet.attr({
                stroke: colTableStroke
            });
            controller.ac.Call("MoveTable", {
                table: model.id,
                previous: model.previousPosition,
                current: {
                    x: model.GetX(),
                    y: model.GetY()
                }
            });
        };
        this.id = id || controller.NextTableID();
        logEvent("Create RoundTable");
        this.seatCount = seatCount;
        if (seatList) {
            this.seatCount = seatCount >= seatList.length ? seatCount : seatList.length;
        }
        this.GetX = Generic.ShapeGetX;
        this.GetY = Generic.ShapeGetY;
        this.GetLocation = function RoundTable_GetLocation() {
            return {
                x: this.GetX(),
                y: this.GetY(),
                r: this.rotation
            };
        };
        this.GetTwelve = function RoundTable_GetTwelve() {
            return {
                x: this.GetX(),
                y: this.GetY() - this.widthWithChairs
            };
        };
        this.remove = function RoundTableRemove() {
            var dfdRemoveTable = $.Deferred(), arrRemoveDFD = [], i, l, seat, seatMarker, contextualModel = this;
            for (i = 0, l = this.tableSeatList.length; i < l; i += 1) {
                seat = this.tableSeatList[i];
                arrRemoveDFD.push(seat.remove());
            }
            for (i = 0, l = this.tableSeatAdditions.length; i < l; i += 1) {
                seatMarker = this.tableSeatAdditions[i];
                arrRemoveDFD.push(seatMarker.remove());
            }
            $.when.apply($, arrRemoveDFD).done(function () {
                console.log("removed all contents of table");
                if (contextualModel.graphic) {
                    contextualModel.graphic.stop();
                    contextualModel.graphic.animate({
                        opacity: "0"
                    }, animationTime, true, function () {
                        this.remove();
                        contextualModel.graphic = null;
                        console.log("removed table");
                        dfdRemoveTable.resolve();
                    });
                }
                else {
                    console.log("no table to remove");
                    dfdRemoveTable.resolve();
                }
            });
            return dfdRemoveTable.promise();
        };
        this.setGraphicPositionBase = Generic.SetShapeGraphicPosition;
        this.setGraphicPosition = function RoundTable_setGraphicPosition(pointTo, pointFrom, callback) {
            var dfd = $.Deferred(), fixedPointTo;
            if (pointFrom) {
                fixedPointTo = {
                    x: pointTo.x,
                    y: pointTo.y
                };
                this.setGraphicPositionBase(pointFrom);
                this.graphic.animate({
                    cx: pointTo.x,
                    cy: pointTo.y
                }, animationTime, true, function () {
                    var model = this.attr("model"), t, seatCount = model.seatCount;
                    model.setGraphicPositionBase(fixedPointTo);
                    for (t = 0; t < seatCount; t += 1) {
                        model.placeSeat(t);
                        model.placeSeatMarker(t);
                    }
                    if (callback) {
                        callback();
                    }
                    dfd.resolve();
                });
            }
            else {
                this.setGraphicPositionBase(pointTo);
                if (callback) {
                    callback();
                }
                dfd.resolve();
            }
            return dfd.promise();
        };
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
        this.tableSeatAdditions = [];
        this.caclulateClockworkValues = function (divisions, pointNumber) {
            var alpha = 360 / divisions * pointNumber, a = (90 - alpha) * Math.PI / 180, x = this.GetX() + this.widthWithChairs * Math.cos(a), y = this.GetY() - this.widthWithChairs * Math.sin(a);
            return {
                alpha: alpha,
                a: a,
                x: x,
                y: y
            };
        };
        this.placeSeat = function RoundTable_PlaceSeat(seatNumber) {
            var dfdPromise, obj = this.caclulateClockworkValues(this.seatCount, seatNumber), moveToSeatLoc = {
                x: obj.x,
                y: obj.y,
                r: obj.alpha
            }, mySeat = this.tableSeatList[seatNumber], moveFromSeatLoc = mySeat.GetLoc() || (this.lastSeatMarkerLoc || this.GetTwelve());
            dfdPromise = mySeat.setGraphicPosition(moveToSeatLoc, moveFromSeatLoc);
            mySeat.seatNumber = seatNumber;
            this.lastSeatLoc = mySeat.GetLoc();
            mySeat.graphic.attr({
                fromTableX: moveToSeatLoc.x,
                fromTableY: moveToSeatLoc.y
            });
            return dfdPromise;
        };
        this.lastSeatMarkerLoc = null;
        this.lastSeatLoc = null;
        this.placeSeatMarker = function RoundTable_PlaceSeatMarker(seatNumber) {
            var seatCount = seatNumber > -1 ? this.seatCount * 2 : 1, seatNumberWithOffset = seatNumber > -1 ? (seatNumber * 2) + 1 : 0, obj = this.caclulateClockworkValues(seatCount, seatNumberWithOffset), seatNumberFixed = seatNumber > -1 ? seatNumber : 0, moveToSeatLoc = {
                x: obj.x,
                y: obj.y,
                r: obj.alpha
            }, mySeat = this.tableSeatAdditions[seatNumberFixed], moveFromSeatLoc = mySeat.GetLoc() || (this.lastSeatLoc || this.GetTwelve());
            mySeat.setGraphicPosition(moveToSeatLoc, moveFromSeatLoc);
            mySeat.SetRotation(obj.alpha);
            mySeat.seatNumber = seatNumberFixed;
            this.lastSeatMarkerLoc = moveToSeatLoc;
            mySeat.graphic.attr({
                fromTableX: moveToSeatLoc.x,
                fromTableY: moveToSeatLoc.y
            });
        };
        this.CheckOverSeat = function RoundTable_CheckOverSeat(x, y) {
            var i, l, seatCheck;
            for (i = 0, l = this.tableSeatList.length; i < l; i += 1) {
                seatCheck = this.tableSeatList[i];
                if ((seatCheck.t < y && seatCheck.b > y) && (seatCheck.r > x && seatCheck.l < x)) {
                    return seatCheck;
                }
            }
            for (i = 0, l = this.tableSeatAdditions.length; i < l; i += 1) {
                seatCheck = this.tableSeatAdditions[i];
                if ((seatCheck.t < y && seatCheck.b > y) && (seatCheck.r > x && seatCheck.l < x)) {
                    return seatCheck;
                }
            }
            return null;
        };
        this.addSeat = function RoundTable_AddSeat(seatNumber) {
            var mySeat = new Seat(0, 0, 0, this, seatNumber), mySeatMarker = new SeatMarker(0, 0, this, seatNumber, 0);
            this.tableSeatList.push(mySeat);
            this.tableSeatAdditions.push(mySeatMarker);
            this.seatSet.push(mySeat.graphic);
            this.seatSet.push(mySeatMarker.graphic);
        };
        this.addKnownSeat = function RoundTable_addKnownSeat(seat) {
            var mySeat = new Seat(0, 0, 0, this, seat.seatNumber, seat.id, seat.guest), mySeatMarker = new SeatMarker(0, 0, this, seat.seatNumber, 0);
            this.tableSeatList.push(mySeat);
            this.tableSeatAdditions.push(mySeatMarker);
            this.seatSet.push(mySeat.graphic);
            this.seatSet.push(mySeatMarker.graphic);
        };
        this.addSeatFromMarker = function RoundTable_AddSeatFromMarker(markerNumber) {
            var mySeat = new Seat(0, 0, 0, this, markerNumber), mySeatMarker = new SeatMarker(0, 0, this, markerNumber, 0);
            //markerNumber = this.tableSeatList.length ? markerNumber : 0;
            if (this.tableSeatList.length) {
                this.tableSeatList.insertAt(mySeat, markerNumber);
                this.tableSeatAdditions.insertAt(mySeatMarker, markerNumber);
            }
            else {
                this.tableSeatList.insertAt(mySeat, 0);
            }
            this.seatSet.push(mySeat.graphic);
            this.seatSet.push(mySeatMarker.graphic);
            var dfd = $.Deferred();
            this.renderSeats().then(function () {
                dfd.resolve(mySeat);
            });
            return dfd;
        };
        this.removeSeat = function RoundTable_RemoveSeat(index) {
            var isLastSeat = (this.seatCount === index), dfd = $.Deferred(), dfdList = [], context = this, dfdSeatRemove = this.tableSeatList[index].remove(), dfdSeatMarkerRemove;
            logEvent("remove seat" + index);
            dfdList.push(dfdSeatRemove);
            $.when(dfdSeatRemove).done(function removeSeatCallback() {
                context.tableSeatList.remove(index);
            });
            if (!isLastSeat) {
                dfdSeatMarkerRemove = this.tableSeatAdditions[index].remove();
                $.when(dfdSeatMarkerRemove).done(function () {
                    context.tableSeatAdditions.remove(index);
                });
                dfdList.push(dfdSeatMarkerRemove);
            }
            $.when.apply($, dfdList).done(function () {
                var myDFD = context.renderSeats();
                $.when(myDFD).done(function () {
                    dfd.resolve();
                });
            });
            return dfd.promise();
        };
        this.renderSeats = function renderSeats() {
            var dfd = $.Deferred(), arrAllSeatsDFD = [], isLastSeat = (this.tableSeatList.length === 1), t, l;
            this.seatCount = this.tableSeatList.length;
            for (t = 0, l = this.tableSeatList.length; t < l; t += 1) {
                arrAllSeatsDFD.push(this.placeSeat(t));
                this.placeSeatMarker(t);
            }
            if (isLastSeat) {
                this.placeSeatMarker();
            }
            $.when.apply($, arrAllSeatsDFD).done(function () {
                console.log("all done with seat processing");
                dfd.resolve();
            });
            this.dfdPromise = dfd.promise();
            return dfd.promise();
        };
        for (i = 0, l = this.seatCount; i < l; i += 1) {
            if (seatList && seatList[i]) {
                this.addKnownSeat(seatList[i]);
            }
            else {
                this.addSeat(i);
            }
        }
        this.dfdPromise = this.renderSeats();
        var me = this;
        $.when(this.dfdPromise).then(function () {
            if (callback) {
                callback(me);
            }
        });
        this.animateTable = function (position, callback) {
            var currentLocation = this.GetLocation();
            if ((currentLocation.x !== position.x) || (currentLocation.y !== position.y) || (currentLocation.r !== position.r)) {
                return this.setGraphicPosition(position, currentLocation, callback);
            }
        };
        this.graphic.drag(move, start, up);
        this.graphic.mouseover(function (event) {
            Generic.Highlight(this);
        });
        this.graphic.mouseout(function (event) {
            Generic.Unhighlight(this);
        });
        this.ToJson = function () {
            var seatObject = [], i, l;
            for (i = 0, l = this.tableSeatList.length; i < l; i += 1) {
                seatObject.push(this.tableSeatList[i].ToJson());
            }
            return {
                type: "round",
                seatCount: this.tableSeatList.length,
                x: this.GetX(),
                y: this.GetY(),
                seatList: seatObject
            };
        };
    }, MathHelper = {
        calculateAngle: function (center, point) {
            var twelveOClock = {
                x: center.x,
                y: center.y - Math.sqrt(Math.abs(point.x - center.x) * Math.abs(point.x - center.x) + Math.abs(point.y - center.y) * Math.abs(point.y - center.y))
            };
            return (2 * Math.atan2(point.y - twelveOClock.y, point.x - twelveOClock.x)) * 180 / Math.PI;
        },
        roundValue: function (val, rounding) {
            return Math.round(val / rounding) * rounding;
        }
    }, Desk = function (x, y, rotation, callback) {
        this.id = controller.NextTableID();
        this.widthWithChairs = 30;
        logEvent("Create Desk");
        this.GetX = Generic.PathGetX;
        this.GetY = Generic.PathGetY;
        this.remove = function DeskRemove() {
            var dfdRemoveTable = $.Deferred(), arrRemoveDFD = [], i, l, seat, contextualModel = this;
            for (i = 0, l = this.tableSeatList.length; i < l; i += 1) {
                seat = this.tableSeatList[i];
                arrRemoveDFD.push(seat.remove());
            }
            $.when.apply($, arrRemoveDFD).done(function () {
                console.log("removed all contents of table");
                if (contextualModel.graphic) {
                    contextualModel.graphic.stop();
                    contextualModel.graphic.animate({
                        opacity: "0"
                    }, animationTime, true, function () {
                        this.remove();
                        contextualModel.graphic = null;
                        console.log("removed table");
                        dfdRemoveTable.resolve();
                    });
                }
                else {
                    console.log("no table to remove");
                    dfdRemoveTable.resolve();
                }
            });
            return dfdRemoveTable.promise();
        };
        this.GetLocation = function () {
            return {
                x: this.GetX(),
                y: this.GetY(),
                r: this.rotation
            };
        };
        this.setGraphicPositionBase = Generic.SetRelativeGraphicPosition;
        this.setGraphicPosition = function (pointTo, pointFrom, callback) {
            if (pointFrom) {
                //var fixedPointTo = {x:pointTo.x - (this.width/2), y:pointTo.y - (this.width/2)};
                //var fixedPointTo = {x:pointTo.x, y:pointTo.y};
                this.setGraphicPositionBase(pointFrom);
                //this.setGraphicPositionBase(fixedPointTo);
                this.rotation = pointTo.r;
                this.graphic.animate({
                    transform: "t" + pointTo.x + "," + pointTo.y + "R" + pointTo.r,
                    //rotation: pointTo.r
                    ox: pointTo.x,
                    oy: pointTo.y
                }, animationTime, true, function () {
                    var model = this.attr("model");
                    //model.setGraphicPositionBase(pointTo);
                    model.placeSeat(model.tableSeatList[0], true);
                    if (callback) {
                        callback();
                    }
                });
            }
            else {
                this.setGraphicPositionBase(pointTo);
                this.placeSeat(this.tableSeatList[0], false);
                if (callback) {
                    callback();
                }
            }
            this.placeRotationHandle(pointTo);
        };
        this.placeRotationHandle = function (pointTo) {
            this.rotationHandle.attr({
                cx: pointTo.x + 50,
                cy: pointTo.y + 50
            });
        };
        this.caclulateRotationPlacement = function (rotation) {
            var alpha = rotation, //360 / divisions * pointNumber,
            a = (90 - alpha) * Math.PI / 180, x = this.GetX() + this.widthWithChairs * Math.cos(a), y = this.GetY() - this.widthWithChairs * Math.sin(a);
            return {
                alpha: alpha,
                a: a,
                x: x,
                y: y
            };
        };
        this.placeSeat = function (mySeat, animated) {
            var obj = this.caclulateRotationPlacement(this.rotation), moveToSeatLoc = {
                x: obj.x,
                y: obj.y,
                r: obj.alpha
            }, moveFromSeatLoc;
            if (animated) {
                moveFromSeatLoc = mySeat.GetLoc() || {
                    x: 0,
                    y: 0
                };
                mySeat.setGraphicPosition(moveToSeatLoc, moveFromSeatLoc);
            }
            else {
                mySeat.setGraphicPosition(moveToSeatLoc);
            }
            mySeat.SetRotation(obj.alpha);
            //mySeat.seatNumber = seatNumber;
            mySeat.graphic.attr({
                fromTableX: moveToSeatLoc.x,
                fromTableY: moveToSeatLoc.y
            });
        };
        this.rotation = rotation;
        this.graphic = paper.path(shapes.desk); //
        this.graphic.attr({
            ox: 0,
            oy: 30,
            rotation: rotation,
            fill: colTable,
            stroke: colTableStroke,
            model: this
        });
        this.rotationHandle = paper.circle(60, 60, 10);
        this.rotationHandle.attr({
            rotation: rotation,
            fill: colTable,
            stroke: colTableStroke,
            model: this
        });
        var rotationstart = function (event) {
            logEvent("StartRotation Desk");
            var model = this.attr("model");
            model.previousPosition = model.GetLocation(); //{x:model.GetX(),y:model.GetY(),r:model.rotation}
            model.offsetRotation = model.rotation;
        }, rotationmove = function (mx, my) {
            var model = this.attr("model"), mouseCX = this.attr("cx") + mx, mouseCY = this.attr("cy") + my, offset = 135, rounding = 22.5, calculateAngle = MathHelper.calculateAngle, roundValue = MathHelper.roundValue, newANGLE = calculateAngle({
                x: model.GetX(),
                y: model.GetY()
            }, {
                x: mouseCX,
                y: mouseCY
            }) - offset;
            newANGLE = roundValue(newANGLE, rounding);
            model.rotation = newANGLE + model.offsetRotation;
            model.graphic.attr({
                transform: "T" + model.GetX() + "," + model.GetY() + "R" + model.rotation
            });
            model.placeSeat(model.tableSeatList[0], false);
        }, rotationup = function () {
            logEvent("EndRotation Desk");
            var model = this.attr("model");
            controller.ac.Call("MoveTable", {
                table: model.id,
                previous: model.previousPosition,
                current: model.GetLocation()
            });
        }, start = function (event) {
            logEvent("StartDrag Desk");
            var model = this.attr("model"), i, l, s;
            model.previousPosition = model.GetLocation(); //{x:model.GetX(),y:model.GetY(),r:model.rotation}
            this.ox = model.GetX();
            this.oy = model.GetY();
            for (i = 0, l = model.tableSeatList.length; i < l; i += 1) {
                s = model.tableSeatList[i];
                s.graphic.attr({
                    fromTableX: s.GetX(),
                    fromTableY: s.GetY()
                });
            }
            model.seatSet.attr({
                stroke: colSeatSelectedStroke
            });
            this.attr("stroke", colTableSelectedStroke);
        }, move = function (mx, my) {
            var model = this.attr("model"), mouseCX = this.ox + mx, mouseCY = this.oy + my, i, l, s;
            for (i = 0, l = model.tableSeatList.length; i < l; i += 1) {
                s = model.tableSeatList[i];
                s.setGraphicPosition({
                    x: s.graphic.attr("fromTableX") + mx,
                    y: s.graphic.attr("fromTableY") + my
                });
            }
            model.setGraphicPosition({
                x: mouseCX,
                y: mouseCY
            });
        }, up = function () {
            logEvent("EndDrag Desk");
            var model = this.attr("model");
            model.seatSet.attr({
                stroke: colTableStroke
            });
            controller.ac.Call("MoveTable", {
                table: model.id,
                previous: model.previousPosition,
                current: model.GetLocation() //{x:model.GetX(),y:model.GetY(),r:model.rotation}
            });
        };
        this.rotationHandle.drag(rotationmove, rotationstart, rotationup);
        this.rotationHandle.mouseover(function (event) {
            logEvent("Over Desk Rotation");
            Generic.Highlight(this);
        });
        this.rotationHandle.mouseout(function (event) {
            logEvent("Out Desk Rotation");
            Generic.Unhighlight(this);
        });
        this.seatSet = paper.set();
        this.seatSet.push(this.graphic);
        this.seatSet.push(this.rotationHandle);
        this.tableSeatList = [];
        this.addSeat = function () {
            var mySeat = new Seat(x, y, rotation);
            mySeat.table = this;
            this.tableSeatList.push(mySeat);
            this.seatSet.push(mySeat.graphic);
            this.placeSeat(this.tableSeatList[0], false);
        };
        this.CheckOverSeat = function (x, y) {
            var i, l, seatCheck;
            for (i = 0, l = this.tableSeatList.length; i < l; i += 1) {
                seatCheck = this.tableSeatList[i];
                if ((seatCheck.t < y && seatCheck.b > y) && (seatCheck.r > x && seatCheck.l < x)) {
                    return seatCheck;
                }
            }
            return null;
        };
        this.addSeat();
        this.setGraphicPosition({
            x: x,
            y: y
        });
        this.graphic.drag(move, start, up);
        this.graphic.mouseover(function (event) {
            Generic.Highlight(this);
        });
        this.graphic.mouseout(function (event) {
            Generic.Unhighlight(this);
        });
        this.animateTable = function (position, callback) {
            var currentLocation = this.GetLocation();
            if ((currentLocation.x !== position.x) || (currentLocation.y !== position.y) || (currentLocation.r !== position.r)) {
                return this.setGraphicPosition(position, currentLocation, callback);
            }
        };
        this.ToJson = function () {
            var seatObject = [], i, l;
            for (i = 0, l = this.tableSeatList.length; i < l; i += 1) {
                seatObject.push(this.tableSeatList[i].ToJson());
            }
            return {
                type: "desk",
                rotation: this.rotation,
                x: this.GetX(),
                y: this.GetY(),
                seatList: seatObject
            };
        };
        if (callback) {
            callback();
        }
    }, SaveAll = function () {
        var SaveObject = {
            tableList: [],
            guestList: []
        }, i, l;
        for (i = 0, l = myTables.length; i < l; i += 1) {
            SaveObject.tableList.push(myTables[i].ToJson());
        }
        for (i = 0, l = myGuests.length; i < l; i += 1) {
            if (!myGuests[i].seat) {
                SaveObject.guestList.push(myGuests[i].ToJson());
            }
        }
        return SaveObject;
    }, createNewPlan = function () {
        $.when(clearData()).then(function () {
            if (socket) {
                socket.emit('AddPlan');
            }
        });
    }, saveNewPlan = function () {
        window.alert("need to be able to save a new plan");
    }, renderAllPlans = function (data) {
        var summaryText = "Summary", i, l, summaryRow;
        if (data.length !== 0) {
            for (i = 0, l = data.length; i < l; i += 1) {
                summaryRow = "Unnamed plan (" + data[i].guestList.length + " guests " + data[i].tableList.length + " tables)";
                console.log([data[i], summaryRow]);
                myPlanID = data[i]._id;
                summaryText += ". " + summaryRow;
                $("#lstPlans").append($("<option>").attr({
                    value: myPlanID,
                    text: summaryRow
                }).append(summaryRow));
            }
            requestPlan(); //Hack - load last plan
        }
        else {
            saveNewPlan();
        }
        console.log(summaryText);
    };
    this.getController = function () {
        return controller;
    };
    this.getTables = function () {
        return myTables;
    };
    this.getGuests = function () {
        return myGuests;
    };
    this.setAnimationTime = function (newTime) {
        animationTime = newTime;
    };
    paper.customAttributes = {
        model: function (model) {
            this.myModel = model;
            return this.myModel;
        },
        ox: function (ox) {
            this.myOx = ox;
            return this.myOx;
        },
        oy: function (oy) {
            this.myOy = oy;
            return this.myOy;
        },
        fromTableX: function (fromTableX) {
            this.myfromTableX = fromTableX;
            return this.myfromTableX;
        },
        fromTableY: function (fromTableY) {
            this.myfromTableY = fromTableY;
            return this.myfromTableY;
        },
        rotation: function (rotation) {
            this.myrotation = rotation;
            return this.myrotation;
        }
    };
    this.ClearDataExternal = function () {
        return clearData();
    };
    this.LoadDataExternal = function (data) {
        return loadData(data);
    };
    if (socket) {
        socket.on('AddPlanResponse', function (data) {
            console.log(data);
            loadData([data]);
        });
        socket.on('GetPlanResponse', function (data) {
            console.log(data);
            loadData(data);
        });
        socket.on('GetPlanListResponse', function (data) {
            console.log(data);
            renderAllPlans(data);
        });
    }
    (function () {
        MyToolBar = new ToolBar();
        requestPlanList();
        logEvent("Finished Init");
        $("#lstPlans").change(function (o) {
            console.log("Change option");
            myPlanID = o.currentTarget.value;
            $.when(clearData()).then(requestPlan);
        });
        hideAllEditPanels();
    }());
    if (socket) {
        socket.on('CreateSeatAndPlaceGuestResponse', function (data) {
            console.log(data);
            controller.CreateSeatAndPlaceGuest(data.table, data.guest, data.seatMarker);
            //socket.emit('my other event', { my: 'data' });
        });
        socket.on('PlaceGuestOnSeatResponse', function (data) {
            console.log(data);
            controller.PlaceGuestOnSeat(data.guest, data.seat);
            //socket.emit('my other event', { my: 'data' });
        });
        socket.on('SwapGuestWithSeatResponse', function (data) {
            console.log(data);
            controller.SwapGuestWithSeat(data.guest, data.seat);
            //socket.emit('my other event', { my: 'data' });
        });
        socket.on('AddSeatAtPositionResponse', function (data) {
            console.log(data);
            controller.AddSeatAtPosition(data.table, data.seatNumber);
            //socket.emit('my other event', { my: 'data' });
        });
        socket.on('RemoveSeatResponse', function (data) {
            console.log(data);
            controller.RemoveSeat(data.seat);
            //socket.emit('my other event', { my: 'data' });
        });
    }
};
//# sourceMappingURL=dylanSeatingHitched.js.map