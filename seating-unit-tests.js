var testSpeed = 1000;
//Mocks
socket = {
	on: function(socketName) {
		console.log("Mock socket " + socketName);
	},
	emit: function(socketName, object, functionObj) {
		console.log(["Mock Emit " + socketName,object]);
		if(functionObj) {
			functionObj();
		}
	}
}
$(function() {
	
var myDylanSeating;


module("Basic Functions", {
	setup:function() {
		myDylanSeating = new dylanSeating();
			myDylanSeating.setAnimationTime(testSpeed);
	}
});
test('myTables starts off blank', function() {

	equals(myDylanSeating.getTables().length, 0, 'myTables starts off blank');
});


test('Load standard data and check it', function() {
	
	var exampleSave = {
		guestList: [{
		    name: "Fred Boodle",
		    x: 30,
		    y: 30
		}],
		tableList: [{
		    type: "table",
		    x: 400,
		    y: 400,
		    seatCount: 10
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
	equals(myDylanSeating.getTables().length, 0, 'There are no tables after loading an empty object');
	
	$.when(myDylanSeating.LoadDataExternal(exampleSave)).then(
		function() {
			start();
			equals(myDylanSeating.getTables().length, 3, 'There are 3 tables');
			//stop();
			$.when(myDylanSeating.ClearDataExternal()).then(
				function() {
					//start();
					equals(myDylanSeating.getTables().length, 0, 'The stage has been cleared');
					
				}
			);
			
		}
	);
	stop();
	
	
});
	

module("Controller Functions", {
	setup:function() {
		myDylanSeating = new dylanSeating();
		myDylanSeating.setAnimationTime(testSpeed);
	}
});

test('AddGuest, undo, redo', function testAddGuestUndo() {
	expect(4);
//	start();
	stop();
	$.when(myDylanSeating.ClearDataExternal()).then(
		function testAddGuestUndoAfterClear() {
			start();
			equals(myDylanSeating.getGuests().length,0, 'guests start off empty');
			var ctrl = myDylanSeating.getController();
			stop();
			
			
			$.when(ctrl.ac.Call({name:"AddGuest", args:{id: 1,name: "Test Guest",x: 10,y: 10}}))
			 .then(
			       function testAddGuestUndoAfterClearAndAddGuest(){ 
					start();
					equals(myDylanSeating.getGuests().length,1, 'Adding guest makes it go up by one');
					stop();
					$.when(ctrl.ac.Undo())
					 .then(
						function testAddGuestUndoAfterClearAndAddGuestAndUndo(){ 
							start();
							equals(myDylanSeating.getGuests().length,0, 'Undoing task makes the guest count go back to 0');	
							stop();
							$.when(ctrl.ac.Redo())
							.then(
							        function(){ 
									start();
									equals(myDylanSeating.getGuests().length,1, 'guests now goes back to 1');
							        }
							);
						}
					);
					
					
				}
			);
			//stop();
			
		}
	);
	//stop();
});

asyncTest('AddTable, undo, redo', function() {
	expect(4);
	$.when(myDylanSeating.ClearDataExternal()).then(
		function() {
			start();
			equals(myDylanSeating.getTables().length,0, 'tables start off empty');
			var ctrl = myDylanSeating.getController();
			stop();
			$.when(ctrl.ac.Call("AddTable", {id: 1,type:"table",x: 200, y: 200, seatCount:5}))
			 .then(
			       function(){ 
					start();
					equals(myDylanSeating.getTables().length,1, 'Adding table makes it go up by one');
					stop();
					$.when(ctrl.ac.Undo())
					 .then(
						function(){ 
							start();
							equals(myDylanSeating.getTables().length,0, 'Undoing task makes the table count go back to 0');	
						stop();
							$.when(ctrl.ac.Redo())
							.then(
							        function(){ 
									start();
									equals(myDylanSeating.getTables().length,1, 'table now goes back to 1');
							        }
							);
						}
					);
				}
			);
			
		}
	);
});

asyncTest('AddTable AddGuestAtNewSeat, undo, redo', function() {
	expect(4);
	$.when(myDylanSeating.ClearDataExternal()).then(
		function() {
			start();
			equals(myDylanSeating.getTables().length,0, 'tables start off empty');
			
			var callAddTable = {
				name: "AddTable",
				args: {id: 1,type:"table",x: 250, y: 100, seatCount:3}
			},
			   callAddGuest = {
				name: "AddGuest",
				args: {id: 1,name: "Test Guest",x: 10,y: 10}
			};
			var ctrl = myDylanSeating.getController();
			
			stop();
			
			$.when(ctrl.ac.CallMultiple([callAddTable,callAddGuest]))
			 .then(
				function(){ 
					start();
					equals(myDylanSeating.getTables().length,1, 'Adding table makes it go up by one');
					equals(myDylanSeating.getGuests().length,1, 'Adding a guest makes it go up by one');
					equals(myDylanSeating.getTables()[0].seatCount,3, 'The seatcount starts off at 3');
					stop();
					//{guest:guest,table:table,seatMarker:seatMarker,guestOriginalSeat:guest.seat}
					$.when(ctrl.ac.Call("PlaceGuestOnNewSeat", {guest: 1,table:1,seatMarker:1}))
					.then(function() {
						equals(myDylanSeating.getTables().length,1, 'Adding table makes it go up by one');
								equals(myDylanSeating.getGuests().length,1, 'Adding a guest makes it go up by one');
								equals(myDylanSeating.getTables()[0].seatCount,3, 'The seatcount starts off at 3');
						$.when(ctrl.ac.Undo())
						 .then(
							function(){ 
								start();
								equals(myDylanSeating.getTables().length,1, 'Adding table makes it go up by one');
								equals(myDylanSeating.getGuests().length,1, 'Adding a guest makes it go up by one');
								equals(myDylanSeating.getTables()[0].seatCount,3, 'The seatcount starts off at 3');
								stop();
								$.when(ctrl.ac.Redo())
								.then(
									function(){ 
										start();
										equals(myDylanSeating.getTables().length,1, 'table now goes back to 1');
									}
								);
							}
						);
					});
				}
			);
			
		}
	);
});

//All of the following still need tests to be written for them:
    //  "PlaceGuestOnNewSeat", {guest:guest,table:table,seatMarker:seatMarker,guestOriginalSeat:guest.seat}
    //  "PlaceGuestOnSeat",    {guest:guest,seat:seat,guestOriginalSeat:guest.seat}
    //  "SwapGuestWithGuest",  {guest1:guest,guest2:guest}
    //  "AddSeatAtPosition",   {table:table, seatNumber:seatNumber}
    //  "EditGuest", {name:name}
//});

test('AddTable then move then undo, then undo, then redo, then redo', function() {
	expect(10);
	stop();
	$.when(myDylanSeating.ClearDataExternal()).then(
		function() {
			start();
			equals(myDylanSeating.getTables().length,0, 'tables start off empty');
			var ctrl = myDylanSeating.getController();
			stop();
			$.when(ctrl.ac.Call("AddTable", {id: 1,type:"table",x: 200, y: 200, seatCount:5}))
			 .then(
			       function(){ 
					start();
					equals(myDylanSeating.getTables().length,1, 'Adding table makes it go up by one');
					stop();
					$.when(ctrl.ac.Call("MoveTable", 
							    {
								table:1,
								previous:{x:200,y:200},
								current:{x:400,y:400}
							    }))
					.then(
					      function(){
							start();
							equals(myDylanSeating.getTables()[0].GetX(),400, 'Moving table repositions x axis');
							equals(myDylanSeating.getTables()[0].GetY(),400, 'Moving table repositions y axis');
							stop();
							$.when(ctrl.ac.Undo())
							 .then(
								function(){ 
									start();
									equals(myDylanSeating.getTables()[0].GetX(),200, 'Moving table repositions x axis');
									equals(myDylanSeating.getTables()[0].GetY(),200, 'Moving table repositions y axis');
							
									stop();
									$.when(ctrl.ac.Undo())
									 .then(
										function(){ 
											start();
											equals(myDylanSeating.getTables().length,0, 'Undo removes the table');
											stop();
											$.when(ctrl.ac.Redo())
											 .then(
												function(){ 
													start();
													equals(myDylanSeating.getTables().length,1, 'Redo adds the table back');
												
													stop();
													$.when(ctrl.ac.Redo())
													 .then(
														function(){ 
															start();
															equals(myDylanSeating.getTables()[0].GetX(),400, 'Moving table repositions x axis');
															equals(myDylanSeating.getTables()[0].GetY(),400, 'Moving table repositions y axis');
														}
													);
												
												}
											);
										}
									);
							
								}
							);
						}
					);
				}
			);
		}
	);
});


test('CallMultiple : [AddTable,MoveTable], then Undo, then Redo', function() {
	expect(8);
	stop();
	$.when(myDylanSeating.ClearDataExternal()).then(
		function() {
			start();
			equals(myDylanSeating.getTables().length,0, 'tables start off empty');
			
			
			var callAddTable = {
				name: "AddTable",
				args: {id: 1,type:"table",x: 250, y: 100, seatCount:3}
			},
			   callMoveTable = {
				name: "MoveTable",
				args: {
					table:1,
					previous:{x:250,y:100},
					current:{x:300,y:150}
				}
			};
			var ctrl = myDylanSeating.getController();
			stop();
			$.when(ctrl.ac.CallMultiple([callAddTable,callMoveTable]))
			 .then(
			       function(){ 
					start();
					equals(myDylanSeating.getTables().length,1, 'Adding table makes it go up by one');
					equals(myDylanSeating.getTables()[0].GetX(),300, 'Moving table repositions x axis');
					equals(myDylanSeating.getTables()[0].GetY(),150, 'Moving table repositions y axis');
					stop();
					$.when(ctrl.ac.Undo())
					.then(
						function(){ 
							start();
							equals(myDylanSeating.getTables().length,0, 'Undoing moves the table, but then gets rid of it!');
							stop();
							$.when(ctrl.ac.Redo())
							.then(
								function(){ 
									start();
									equals(myDylanSeating.getTables().length,1, 'Adding table makes it go up by one');
									equals(myDylanSeating.getTables()[0].GetX(),300, 'Moving table repositions x axis');
									equals(myDylanSeating.getTables()[0].GetY(),150, 'Moving table repositions y axis');
									
								}
							);
						}
					);
					
				}
			);
		}
	);
});


});
