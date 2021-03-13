import * as _ from 'underscore';

export function SeatQuerying () {
    'use strict';
    return {
        getTable: function (plan, id) {
            return _.find(plan.tableList, function(item) {
                return item.id == id;
            });
        },
        getGuest: function (plan, id) {
            console.log("GetGuest" + id);
            var guest = _.find(plan.guestList, function(item) {
                    return item.id == id;
                });

            if (guest) return guest;

            /*Not sure if this is needed*/
            guest = _.chain(plan.tableList)
                .pluck('seatList')
                .flatten()
                .find(function(item) {
                    return item.id == id;
                })
                .value();

            if (guest) return guest;
            /*Not sure if this is needed*/

            guest = _.chain(plan.tableList)
                .pluck('seatList')
                .flatten()
                .pluck('seat')
                .flatten()
                .find(function(item) {
                    return item.id == id;
                })
                .value();

            return guest;
        },
        getSeat: function (plan, id) {
            
            var seat = _.chain(plan.tableList)
                .pluck('seatList')
                .flatten()
                .find(function(item) {
                    return item.id == id;
                })
                .value();
            
            return seat;
        },
        getSeatByNumber: function (plan, seatNumber) {
            
             var allSeats = _.chain(plan.tableList)
                .pluck('seatList')
                .flatten()
                .value();
            
            return allSeats[seatNumber];

        }
    };
};
