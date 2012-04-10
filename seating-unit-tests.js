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
/*
Raphael = function() {
	console.log("Mock Raphael");
}
paper = {
	text: function() {
		console.log("Mock Text");
		return {};
	}
}
*/
$(function() {
	


var myDylanSeating = new dylanSeating();


test('myTables starts off blank', function() {
	
	ok(myDylanSeating.getTables().length === 0, 'myTables starts off blank');
});

test('Test standard controller functions', function() {
	ok(myDylanSeating.getGuests().length === 0, 'guests starts off empty');
	var ctrl = myDylanSeating.getController();
	ctrl.ac.Call("AddGuest", {id: 1,name: "Test Guest",x: 10,y: 10});
	ok(myDylanSeating.getGuests().length === 1, 'guests go up by one');
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
	ok(myDylanSeating.getTables().length === 0, 'There are no tables after loading an empty object');
	myDylanSeating.LoadDataExternal(exampleSave);

	ok(myDylanSeating.getTables().length === 3, 'There are 3 tables');
	
});



});