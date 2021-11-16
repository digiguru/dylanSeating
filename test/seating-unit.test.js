/* brackets-xunit: qunit */
/*brackets-xunit: includes=jquery.js,underscore.js,raphael.2.0.1.js,dylanSeatingHitched.js* */
/*jslint nomen: true*/
/*global $, console, module, test, equal, start, stop, expect, DylanSeating */
import $ from "jquery";
import {DylanSeating} from '../src/dylanSeatingHitched'
import 'expect-puppeteer'
import "regenerator-runtime/runtime";

describe('Stuff', () => {


    var equal = function(expected, actual, description) {
        expect(expected).toBe(actual);
    },
        testSpeed = 1,//,
        //Mocks
        socket = {
            on: function (socketName) {
                "use strict";
                console.log("Mock socket " + socketName);
            },
            emit: function (socketName, object, functionObj) {
                "use strict";
                console.log(["Mock Emit " + socketName, object]);
                if (functionObj) {
                    functionObj();
                }
            }
        };

        describe('Go to Site', () => {
            beforeAll(async () => {
                await page.goto('http://localhost:3000/socketExampleClient.html');
                
            });
            test('open site', async () => {
                await expect(page).toMatch('plans');
            })

            test.skip('myTables starts off blank', function () {
                let myDylanSeating = new DylanSeating();
                myDylanSeating.setAnimationTime(testSpeed);
        
                equal(myDylanSeating.getTables().length, 0, 'myTables starts off blank');
            });
        });

        

        describe.skip('Stuff', () => {
            test('Load standard data and check it', function () {

                var exampleSave = {
                    guestList: [{
                        id: 1,
                        name: "Fred Boodle",
                        x: 30,
                        y: 30
                    }],
                    tableList: [{
                        type: "table",
                        x: 400,
                        y: 400,
                        seatList: [
                            {
                                id: 1,
                                guest: {
                                    id: 2,
                                    name: "Bob Cranberry",
                                    x: 30,
                                    y: 30
                                },
                                seatNumber: 1
                            },
                            {
                                id: 2,
                                seatNumber: 2
                            },
                            {
                                id: 3,
                                seatNumber: 3
                            }
                        ],
                        seatCount: 3
                    }, {
                        type: "desk",
                        x: 600,
                        y: 50,
                        rotation: 0
                    }, {
                        type: "table",
                        x: 200,
                        y: 200,
                        seatCount: 5
                    }]
                };

                
                myDylanSeating.LoadDataExternal({});
                equal(myDylanSeating.getTables().length, 0, 'There are no tables after loading an empty object');

                
                $.when(myDylanSeating.LoadDataExternal(exampleSave)).then(function () {
                    start();
                    equal(myDylanSeating.getTables().length, 3, 'There are 3 tables');
                    equal(myDylanSeating.getTables()[0].seatCount, 3, 'There are 3 seats on the first table');
                    /*stop();
                    $.when(myDylanSeating.ClearDataExternal()).then(function () {
                        start();
                        equal(myDylanSeating.getTables().length, 0, 'The stage has been cleared');

                    });*/

                    
                });
                stop();


            });
        
        
        test('AddGuest, undo, redo', function testAddGuestUndo() {
            expect(4);
            //	start();
            stop();
            $.when(myDylanSeating.ClearDataExternal()).then(function testAddGuestUndoAfterClear() {
                start();
                equal(myDylanSeating.getGuests().length, 0, 'guests start off empty');
                var ctrl = myDylanSeating.getController();
                stop();


                $.when(ctrl.ac.Call({
                    name: "AddGuest",
                    args: {
                        id: 1,
                        name: "Test Guest",
                        x: 10,
                        y: 10
                    }
                })).then(function testAddGuestUndoAfterClearAndAddGuest() {
                    start();
                    equal(myDylanSeating.getGuests().length, 1, 'Adding guest makes it go up by one');
                    stop();
                    $.when(ctrl.ac.Undo()).then(function testAddGuestUndoAfterClearAndAddGuestAndUndo() {
                        start();
                        equal(myDylanSeating.getGuests().length, 0, 'Undoing task makes the guest count go back to 0');
                        stop();
                        $.when(ctrl.ac.Redo()).then(function () {
                            start();
                            equal(myDylanSeating.getGuests().length, 1, 'guests now goes back to 1');
                        });
                    });
                });
            });
        });

        test('AddTable, undo, redo', done => {
            expect(4);
            $.when(myDylanSeating.ClearDataExternal()).then(function () {
                start();
                equal(myDylanSeating.getTables().length, 0, 'tables start off empty');
                var ctrl = myDylanSeating.getController();
                stop();
                $.when(ctrl.ac.Call("AddTable", {
                    id: 1,
                    type: "table",
                    x: 200,
                    y: 200,
                    seatCount: 5
                })).then(function () {
                    start();
                    equal(myDylanSeating.getTables().length, 1, 'Adding table makes it go up by one');
                    stop();
                    $.when(ctrl.ac.Undo()).then(function () {
                        start();
                        equal(myDylanSeating.getTables().length, 0, 'Undoing task makes the table count go back to 0');
                        stop();
                        $.when(ctrl.ac.Redo()).then(function () {
                            start();
                            equal(myDylanSeating.getTables().length, 1, 'table now goes back to 1');
                        });
                    });
                });

            });
        });

        test('AddTable AddGuestAtNewSeat, undo, redo', done => {
            expect(18);
            $.when(myDylanSeating.ClearDataExternal()).then(function () {
                start();
                equal(myDylanSeating.getTables().length, 0, 'tables start off empty');

                var ctrl = myDylanSeating.getController(),
                    callAddTable = {
                        name: "AddTable",
                        args: {
                            id: 1,
                            type: "table",
                            x: 250,
                            y: 100,
                            seatCount: 3
                        }
                    },
                    callAddGuest = {
                        name: "AddGuest",
                        args: {
                            id: 1,
                            name: "Test Guest",
                            x: 10,
                            y: 10
                        }
                    };

                stop();

                $.when(ctrl.ac.CallMultiple([callAddTable, callAddGuest])).then(function () {
                    start();
                    equal(myDylanSeating.getTables().length, 1, 'Adding table makes it go up by one');
                    equal(myDylanSeating.getGuests().length, 1, 'Adding a guest makes it go up by one');
                    equal(myDylanSeating.getTables()[0].seatCount, 3, 'The seatcount starts off at 3');
                    stop();
                    $.when(ctrl.ac.Call("PlaceGuestOnNewSeat", {
                        guest: 1,
                        table: 1,
                        seatMarker: 1
                    })).then(function () {
                        start();
                        equal(myDylanSeating.getTables()[0].seatCount, 4, 'The seatcount goes up to 4');
                        equal(myDylanSeating.getTables()[0].tableSeatList[0].guest, false, 'There is no guest sitting at seat 1.');
                        equal(myDylanSeating.getTables()[0].tableSeatList[1].guest, false, 'There is no guest sitting at seat 2.');
                        equal(myDylanSeating.getTables()[0].tableSeatList[2].guest.name, 'Test Guest', 'The guest "Test Guest" gets seated at seat number 3');
                        equal(myDylanSeating.getTables()[0].tableSeatList[3].guest, false, 'There is no guest sitting at seat 4.');
                        stop();
                        $.when(ctrl.ac.Undo()).then(function () {
                            start();
                            console.log("UNDO!!!!!");
                            equal(myDylanSeating.getTables()[0].seatCount, 3, 'The seatcount goes down to 3');
                            equal(myDylanSeating.getTables()[0].tableSeatList[0].guest, false, 'There is no guest sitting at seat 1.');
                            equal(myDylanSeating.getTables()[0].tableSeatList[1].guest, false, 'There is no guest sitting at seat 2.');
                            equal(myDylanSeating.getTables()[0].tableSeatList[2].guest, false, 'There is no guest sitting at seat 3.');
                            stop();
                            $.when(ctrl.ac.Redo()).then(function () {
                                start();
                                equal(myDylanSeating.getTables()[0].seatCount, 4, 'The seatcount goes up to 4');
                                equal(myDylanSeating.getTables()[0].tableSeatList[0].guest, false, 'There is no guest sitting at seat 1.');
                                equal(myDylanSeating.getTables()[0].tableSeatList[1].guest, false, 'There is no guest sitting at seat 2.');
                                equal(myDylanSeating.getTables()[0].tableSeatList[2].guest.name, 'Test Guest', 'The guest "Test Guest" gets seated at seat number 3');
                                equal(myDylanSeating.getTables()[0].tableSeatList[3].guest, false, 'There is no guest sitting at seat 4.');

                            });
                        });
                    });
                });

            });
        });

        test('AddTable AddGuest Place Guest On Each Seat, undo, redo', done => {
            expect(44);
            $.when(myDylanSeating.ClearDataExternal()).then(function () {
                start();
                equal(myDylanSeating.getTables().length, 0, 'tables start off empty');

                var ctrl = myDylanSeating.getController(),
                    callAddTable = {
                        name: "AddTable",
                        args: {
                            id: 1,
                            type: "table",
                            x: 250,
                            y: 100,
                            seatCount: 3
                        }
                    },
                    callAddGuest = {
                        name: "AddGuest",
                        args: {
                            id: 1,
                            name: "Test Guest",
                            x: 10,
                            y: 10
                        }
                    };

                stop();

                $.when(ctrl.ac.CallMultiple([callAddTable, callAddGuest])).then(function () {
                    start();
                    equal(myDylanSeating.getTables().length, 1, 'Adding table makes it go up by one');
                    equal(myDylanSeating.getGuests().length, 1, 'Adding a guest makes it go up by one');
                    equal(myDylanSeating.getTables()[0].seatCount, 3, 'The seatcount starts off at 3');
                    stop();
                    $.when(ctrl.ac.Call("PlaceGuestOnSeat", {
                        guest: 1,
                        table: 1,
                        seat: 1
                    })).then(function () {
                        start();
                        equal(myDylanSeating.getTables()[0].seatCount, 3, 'The seatcount remains at 3');
                        equal(myDylanSeating.getTables()[0].tableSeatList[0].guest.name, 'Test Guest', 'There is no guest sitting at seat 1.');
                        equal(myDylanSeating.getTables()[0].tableSeatList[1].guest, false, 'The guest "Test Guest" gets seated at seat number 3');
                        equal(myDylanSeating.getTables()[0].tableSeatList[2].guest, false, 'There is no guest sitting at seat 3.');
                        stop();
                        /*Hmmm - I don't like having to say the current state with "guestOriginalSeat",
                            I think Call will have to calculate the current state*/
                        $.when(ctrl.ac.Call("PlaceGuestOnSeat", {
                            guest: 1,
                            table: 1,
                            seat: 2,
                            guestOriginalSeat: 1
                        })).then(function () {
                            start();
                            equal(myDylanSeating.getTables()[0].seatCount, 3, 'The seatcount remains at 3');
                            equal(myDylanSeating.getTables()[0].tableSeatList[0].guest, false, 'There is no guest sitting at seat 1.');
                            equal(myDylanSeating.getTables()[0].tableSeatList[1].guest.name, 'Test Guest', 'The guest "Test Guest" gets seated at seat number 3');
                            equal(myDylanSeating.getTables()[0].tableSeatList[2].guest, false, 'There is no guest sitting at seat 3.');
                            stop();
                            $.when(ctrl.ac.Call("PlaceGuestOnSeat", {
                                guest: 1,
                                table: 1,
                                seat: 3,
                                guestOriginalSeat: 2
                            })).then(function () {
                                start();
                                equal(myDylanSeating.getTables()[0].seatCount, 3, 'The seatcount remains at 3');
                                equal(myDylanSeating.getTables()[0].tableSeatList[0].guest, false, 'There is no guest sitting at seat 1.');
                                equal(myDylanSeating.getTables()[0].tableSeatList[1].guest, false, 'The guest "Test Guest" gets seated at seat number 3');
                                equal(myDylanSeating.getTables()[0].tableSeatList[2].guest.name, 'Test Guest', 'There is no guest sitting at seat 3.');
                                stop();
                                $.when(ctrl.ac.Call("PlaceGuestOnSeat", {
                                    guest: 1,
                                    table: 1,
                                    seat: 1,
                                    guestOriginalSeat: 3
                                })).then(function () {
                                    start();
                                    equal(myDylanSeating.getTables()[0].seatCount, 3, 'The seatcount remains at 3');
                                    equal(myDylanSeating.getTables()[0].tableSeatList[0].guest.name, 'Test Guest', 'There is no guest sitting at seat 1.');
                                    equal(myDylanSeating.getTables()[0].tableSeatList[1].guest, false, 'The guest "Test Guest" gets seated at seat number 3');
                                    equal(myDylanSeating.getTables()[0].tableSeatList[2].guest, false, 'There is no guest sitting at seat 3.');
                                    stop();
                                    $.when(ctrl.ac.Undo()).then(function () {
                                        start();
                                        console.log("UNDO!!!!!");
                                        equal(myDylanSeating.getTables()[0].seatCount, 3, 'The seatcount goes down to 3');
                                        equal(myDylanSeating.getTables()[0].tableSeatList[0].guest, false, 'There is no guest sitting at seat 1.');
                                        equal(myDylanSeating.getTables()[0].tableSeatList[1].guest, false, 'There is no guest sitting at seat 2.');
                                        equal(myDylanSeating.getTables()[0].tableSeatList[2].guest.name, 'Test Guest', 'There is no guest sitting at seat 3.');
                                        stop();
                                        $.when(ctrl.ac.Undo()).then(function () {
                                            start();
                                            console.log("UNDO!!!!!");
                                            equal(myDylanSeating.getTables()[0].seatCount, 3, 'The seatcount goes down to 3');
                                            equal(myDylanSeating.getTables()[0].tableSeatList[0].guest, false, 'There is no guest sitting at seat 1.');
                                            equal(myDylanSeating.getTables()[0].tableSeatList[1].guest.name, 'Test Guest', 'There is no guest sitting at seat 2.');
                                            equal(myDylanSeating.getTables()[0].tableSeatList[2].guest, false, 'There is no guest sitting at seat 3.');
                                            stop();
                                            $.when(ctrl.ac.Undo()).then(function () {
                                                start();
                                                console.log("UNDO!!!!!");
                                                equal(myDylanSeating.getTables()[0].seatCount, 3, 'The seatcount goes down to 3');
                                                equal(myDylanSeating.getTables()[0].tableSeatList[0].guest.name, 'Test Guest', 'There is no guest sitting at seat 1.');
                                                equal(myDylanSeating.getTables()[0].tableSeatList[1].guest, false, 'There is no guest sitting at seat 2.');
                                                equal(myDylanSeating.getTables()[0].tableSeatList[2].guest, false, 'There is no guest sitting at seat 3.');
                                                stop();
                                                $.when(ctrl.ac.Undo()).then(function () {
                                                    start();
                                                    console.log("UNDO!!!!!");
                                                    equal(myDylanSeating.getTables()[0].seatCount, 3, 'The seatcount goes down to 3');
                                                    equal(myDylanSeating.getTables()[0].tableSeatList[0].guest, false, 'There is no guest sitting at seat 1.');
                                                    equal(myDylanSeating.getTables()[0].tableSeatList[1].guest, false, 'There is no guest sitting at seat 2.');
                                                    equal(myDylanSeating.getTables()[0].tableSeatList[2].guest, false, 'There is no guest sitting at seat 3.');
                                                    stop();
                                                    $.when(ctrl.ac.Redo()).then(function () {
                                                        start();
                                                        equal(myDylanSeating.getTables()[0].seatCount, 3, 'The seatcount goes up to 4');
                                                        equal(myDylanSeating.getTables()[0].tableSeatList[0].guest.name, 'Test Guest', 'There is no guest sitting at seat 1.');
                                                        equal(myDylanSeating.getTables()[0].tableSeatList[1].guest, false, 'There is no guest sitting at seat 2.');
                                                        equal(myDylanSeating.getTables()[0].tableSeatList[2].guest, false, 'The guest "Test Guest" gets seated at seat number 3');
                                                        stop();
                                                        $.when(ctrl.ac.Redo()).then(function () {
                                                            start();
                                                            equal(myDylanSeating.getTables()[0].seatCount, 3, 'The seatcount goes up to 4');
                                                            equal(myDylanSeating.getTables()[0].tableSeatList[0].guest, false, 'There is no guest sitting at seat 1.');
                                                            equal(myDylanSeating.getTables()[0].tableSeatList[1].guest.name, 'Test Guest', 'There is no guest sitting at seat 2.');
                                                            equal(myDylanSeating.getTables()[0].tableSeatList[2].guest, false, 'The guest "Test Guest" gets seated at seat number 3');
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });

            });
        });


        test('AddTable then move then undo, then undo, then redo, then redo', function () {
            expect(10);
            stop();
            $.when(myDylanSeating.ClearDataExternal()).then(function () {
                start();
                equal(myDylanSeating.getTables().length, 0, 'tables start off empty');
                var ctrl = myDylanSeating.getController();
                stop();
                $.when(ctrl.ac.Call("AddTable", {
                    id: 1,
                    type: "table",
                    x: 200,
                    y: 200,
                    seatCount: 5
                })).then(function () {
                    start();
                    equal(myDylanSeating.getTables().length, 1, 'Adding table makes it go up by one');
                    stop();
                    $.when(ctrl.ac.Call("MoveTable", {
                        table: 1,
                        previous: {
                            x: 200,
                            y: 200
                        },
                        current: {
                            x: 400,
                            y: 400
                        }
                    })).then(function () {
                        start();
                        equal(myDylanSeating.getTables()[0].GetX(), 400, 'Moving table repositions x axis');
                        equal(myDylanSeating.getTables()[0].GetY(), 400, 'Moving table repositions y axis');
                        stop();
                        $.when(ctrl.ac.Undo()).then(function () {
                            start();
                            equal(myDylanSeating.getTables()[0].GetX(), 200, 'Moving table repositions x axis');
                            equal(myDylanSeating.getTables()[0].GetY(), 200, 'Moving table repositions y axis');

                            stop();
                            $.when(ctrl.ac.Undo()).then(function () {
                                start();
                                equal(myDylanSeating.getTables().length, 0, 'Undo removes the table');
                                stop();
                                $.when(ctrl.ac.Redo()).then(function () {
                                    start();
                                    equal(myDylanSeating.getTables().length, 1, 'Redo adds the table back');

                                    stop();
                                    $.when(ctrl.ac.Redo()).then(function () {
                                        start();
                                        equal(myDylanSeating.getTables()[0].GetX(), 400, 'Moving table repositions x axis');
                                        equal(myDylanSeating.getTables()[0].GetY(), 400, 'Moving table repositions y axis');
                                    });

                                });
                            });

                        });
                    });
                });
            });
        });

        test('CallMultiple : [AddTable,MoveTable], then Undo, then Redo', function () {
            expect(8);
            stop();
            $.when(myDylanSeating.ClearDataExternal()).then(function () {
                start();
                equal(myDylanSeating.getTables().length, 0, 'tables start off empty');


                var ctrl = myDylanSeating.getController(),
                    callAddTable = {
                        name: "AddTable",
                        args: {
                            id: 1,
                            type: "table",
                            x: 250,
                            y: 100,
                            seatCount: 3
                        }
                    },
                    callMoveTable = {
                        name: "MoveTable",
                        args: {
                            table: 1,
                            previous: {
                                x: 250,
                                y: 100
                            },
                            current: {
                                x: 300,
                                y: 150
                            }
                        }
                    };
                stop();
                $.when(ctrl.ac.CallMultiple([callAddTable, callMoveTable])).then(function () {
                    start();
                    equal(myDylanSeating.getTables().length, 1, 'Adding table makes it go up by one');
                    equal(myDylanSeating.getTables()[0].GetX(), 300, 'Moving table repositions x axis');
                    equal(myDylanSeating.getTables()[0].GetY(), 150, 'Moving table repositions y axis');
                    stop();
                    $.when(ctrl.ac.Undo()).then(function () {
                        start();
                        equal(myDylanSeating.getTables().length, 0, 'Undoing moves the table, but then gets rid of it!');
                        stop();
                        $.when(ctrl.ac.Redo()).then(function () {
                            start();
                            equal(myDylanSeating.getTables().length, 1, 'Adding table makes it go up by one');
                            equal(myDylanSeating.getTables()[0].GetX(), 300, 'Moving table repositions x axis');
                            equal(myDylanSeating.getTables()[0].GetY(), 150, 'Moving table repositions y axis');

                        });
                    });

                });
            });
        });



        test('SwapGuestWithGuest, then Undo, then Redo', function () {
            expect(11);
            stop();
            $.when(myDylanSeating.ClearDataExternal()).then(function () {
                start();
                equal(myDylanSeating.getTables().length, 0, 'tables start off empty');


                var ctrl = myDylanSeating.getController(),
                    callAddTable1 = {
                        name: "AddTable",
                        args: {
                            id: 1,
                            type: "table",
                            x: 100,
                            y: 100,
                            seatCount: 3
                        }
                    },
                    callAddTable2 = {
                        name: "AddTable",
                        args: {
                            id: 2,
                            type: "table",
                            x: 250,
                            y: 250,
                            seatCount: 3
                        }
                    },
                    callAddGuest1 = {
                        name: "AddGuest",
                        args: {
                            id: 1,
                            name: "Guest 1",
                            x: 10,
                            y: 10
                        }
                    },
                    callAddGuest2 = {
                        name: "AddGuest",
                        args: {
                            id: 2,
                            name: "Guest 2",
                            x: 10,
                            y: 10
                        }
                    };
                stop();
                $.when(ctrl.ac.CallMultiple([callAddTable1, callAddTable2, callAddGuest1, callAddGuest2])).then(function () {
                    start();
                    equal(myDylanSeating.getTables().length, 2, 'Added 2 tables');
                    equal(myDylanSeating.getGuests().length, 2, 'Added 2 guests');
                    
                    
                    
                    stop();
                    
                    
                    $.when(ctrl.ac.Call("PlaceGuestOnSeat", {
                        guest: 1,
                        seat: 1
                    })).then(function () {
                        start();
                        equal(myDylanSeating.getTables()[0].tableSeatList[0].guest.name, 'Guest 1', 'Guest 1 in the right place');
                        stop();
                        $.when(ctrl.ac.Call("PlaceGuestOnSeat", {
                            guest: 2,
                            seat: 6
                        })).then(function () {
                            start();
                            equal(myDylanSeating.getTables()[1].tableSeatList[2].guest.name, 'Guest 2', 'Guest 2 in the right place');
                            stop();
                            $.when(ctrl.ac.Call("SwapGuestWithGuest", {
                                guest1: 1,
                                guest2: 2
                            })).then(function () {
                                start();
                                equal(myDylanSeating.getTables()[0].tableSeatList[0].guest.name, 'Guest 2', 'Guest 2 is now where Guest 1 used to be');
                                equal(myDylanSeating.getTables()[1].tableSeatList[2].guest.name, 'Guest 1', 'Guest 1 is now where Guest 2 used to be');
                                stop();
                                $.when(ctrl.ac.Undo()).then(function () {
                                    start();
                                    equal(myDylanSeating.getTables()[0].tableSeatList[0].guest.name, 'Guest 1', 'Guest 2 is now where Guest 1 used to be');
                                    equal(myDylanSeating.getTables()[1].tableSeatList[2].guest.name, 'Guest 2', 'Guest 1 is now where Guest 2 used to be');
                                    
                                    
                                    stop();
                                    $.when(ctrl.ac.Redo()).then(function () {
                                        start();
                                        equal(myDylanSeating.getTables()[0].tableSeatList[0].guest.name, 'Guest 2', 'Guest 2 is now where Guest 1 used to be');
                                        equal(myDylanSeating.getTables()[1].tableSeatList[2].guest.name, 'Guest 1', 'Guest 1 is now where Guest 2 used to be');
                                        
                                        
                                        
                                    });
                                });
                                
                                
                            });
                            
                            
                        });
                    });
                    
                });
            });
        });

        test('SwapGuestWithGuest, then Undo, then Redo', function () {
            stop();
            $.when(myDylanSeating.ClearDataExternal()).then(function () {
                start();
                equal(myDylanSeating.getTables().length, 0, 'tables start off empty');


                var ctrl = myDylanSeating.getController(),
                    callAddTable1 = {
                        name: "AddTable",
                        args: {
                            id: 1,
                            type: "table",
                            x: 100,
                            y: 100,
                            seatCount: 3
                        }
                    },
                    callAddSeatAt = {
                        name: "AddSeatAtPosition",
                        args: {
                            table: 1,
                            seatNumber: 1
                        }
                    };
                stop();
                $.when(ctrl.ac.CallMultiple([callAddTable1])).then(function () {
                    start();
                    equal(myDylanSeating.getTables().length, 1, 'Added 1 tables');
                    equal(myDylanSeating.getTables()[0].seatCount, 3, 'Has 3 seats');
                    stop();
                    $.when(ctrl.ac.CallMultiple([callAddSeatAt])).then(function () {
                        start();
                        equal(myDylanSeating.getTables().length, 1, 'Added 1 tables');
                        equal(myDylanSeating.getTables()[0].seatCount, 4, 'Added 1 seat');
                        stop();
                        $.when(ctrl.ac.Undo()).then(function () {
                            start();
                            equal(myDylanSeating.getTables().length, 1, 'Added 1 tables');
                            equal(myDylanSeating.getTables()[0].seatCount, 3, 'removed 1 seat');
                
                            
                            
                            stop();
                            $.when(ctrl.ac.Redo()).then(function () {
                                start();
                                equal(myDylanSeating.getTables().length, 1, 'Added 1 tables');
                                equal(myDylanSeating.getTables()[0].seatCount, 4, 'Added 1 seat');
                                
                                
                                
                            });
                        });
                        
                        
                    });
                });
            });
        });



        test('EditGuest, then Undo, then Redo', function () {
            stop();
            $.when(myDylanSeating.ClearDataExternal()).then(function () {
                start();
                equal(myDylanSeating.getTables().length, 0, 'tables start off empty');


                var ctrl = myDylanSeating.getController(),
                    callAddGuest = {
                        name: "AddGuest",
                        args: {
                            id: 1,
                            name: "Primary",
                            x: 250,
                            y: 250
                        }
                    },
                    callEditGuest = {
                        name: "EditGuest",
                        args: {
                            guest: 1,
                            previous: { name: "Primary" },
                            current: { name: "Secondary"}
                        }
                    };
                stop();
                $.when(ctrl.ac.CallMultiple([callAddGuest])).then(function () {
                    start();
                    equal(myDylanSeating.getGuests().length, 1, 'Added 1 guest');
                    equal(myDylanSeating.getGuests()[0].name, 'Primary', 'his naem - Primary');
                    stop();
                    $.when(ctrl.ac.CallMultiple([callEditGuest])).then(function () {
                        start();
                        equal(myDylanSeating.getGuests().length, 1, 'Added 1 guest');
                        equal(myDylanSeating.getGuests()[0].name, 'Secondary', 'his naem - Primary');
                        stop();
                        $.when(ctrl.ac.Undo()).then(function () {
                            start();
                            equal(myDylanSeating.getGuests().length, 1, 'Added 1 guest');
                            equal(myDylanSeating.getGuests()[0].name, 'Primary', 'his naem - Primary');
                
                            
                            
                            stop();
                            $.when(ctrl.ac.Redo()).then(function () {
                                start();
                                equal(myDylanSeating.getGuests().length, 1, 'Added 1 guest');
                                equal(myDylanSeating.getGuests()[0].name, 'Secondary', 'his naem - Primary');
                                
                                
                                
                            });
                        });
                        
                        
                    });
                });
            });
        });
    });

//All of the following still need tests to be written for them:
//  "EditGuest", {name:name}
//});
});