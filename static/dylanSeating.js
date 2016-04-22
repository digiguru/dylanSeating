/*jslint nomen: true */
/*global $:false, _:false, console:false, socket:false, Raphael:false, window:false */

var paper = Raphael("board", 900, 900),
    animationTime = 300,
    colGuest = "yellow",
    colGuestStroke = "black",
    colGuestMoveStroke = "blue",
    colGuestSwapStroke = "purple",
    colTable = "purple",
    colTableStroke = "black",
    colTableSelectedStroke = "yellow",
    colSeatSelectedStroke = "blue",
    guestShape = "M -10 -10 L 10 -10 L 0 10 z",
    deskShape = "m-60,0l0,60l120,0l0,-60c-45,20 -75,20 -120,0z";

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
