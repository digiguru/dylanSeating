"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SeatQuerying = SeatQuerying;

var _underscore = require("underscore");

function SeatQuerying() {
  'use strict';

  return {
    getTable: function getTable(plan, id) {
      return _underscore._.find(plan.tableList, function (item) {
        return item.id == id;
      });
    },
    getGuest: function getGuest(plan, id) {
      console.log("GetGuest" + id);

      var guest = _underscore._.find(plan.guestList, function (item) {
        return item.id == id;
      });

      if (guest) return guest;
      /*Not sure if this is needed*/

      guest = _underscore._.chain(plan.tableList).pluck('seatList').flatten().find(function (item) {
        return item.id == id;
      }).value();
      if (guest) return guest;
      /*Not sure if this is needed*/

      guest = _underscore._.chain(plan.tableList).pluck('seatList').flatten().pluck('seat').flatten().find(function (item) {
        return item.id == id;
      }).value();
      return guest;
    },
    getSeat: function getSeat(plan, id) {
      var seat = _underscore._.chain(plan.tableList).pluck('seatList').flatten().find(function (item) {
        return item.id == id;
      }).value();

      return seat;
    },
    getSeatByNumber: function getSeatByNumber(plan, seatNumber) {
      var allSeats = _underscore._.chain(plan.tableList).pluck('seatList').flatten().value();

      return allSeats[seatNumber];
    }
  };
}

;