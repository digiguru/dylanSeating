/* brackets-xunit: qunit */
/* brackets-xunit: includes=underscore.js,seatQuerying.js* */
import {SeatQuerying} from './seatQuerying';

var sq;
QUnit.module("Basic Functions", {
    setup: function () {
        sq = new SeatQuerying();
    }
});

test('Empty table', function () {
    var table = sq.getTable({}, 1);
    equal(table, null, 'A table cannot be found from an emopty list');
});
test('Empty guest', function () {
    var table = sq.getGuest({}, 1);
    equal(table, null, 'A table cannot be found from an emopty list');
});
test('Empty seat', function () {
    var table = sq.getSeat({}, 1);
    equal(table, null, 'A table cannot be found from an emopty list');
});
test('Empty seatNumber', function () {
    var table = sq.getSeatByNumber({}, 1);
    equal(table, null, 'A table cannot be found from an emopty list');
});

test('Single table', function () {
    var table = sq.getTable({tableList:[{id:1, name:"Table1"}]}, 1);
    deepEqual(table, {id:1, name:"Table1"}, 'A table can be found');
});
test('Guest in guestlist', function () {
    var guest = sq.getGuest({guestList:[{id:1, name:"Guest1"}]}, 1);
    deepEqual(guest, {id:1, name:"Guest1"}, 'A guest can be found');
});

test('Guest in table', function () {
    var guest = sq.getGuest({tableList:[{seatList:[{id:1, name:"GuestOnSeat"}]}]}, 1);
    deepEqual(guest, {id:1, name:"GuestOnSeat"}, 'A guest can be found');
});

test('Guest in table', function () {
    //Not sure if this one is okay?
    var guest = sq.getGuest({tableList:[{seatList:[{seat:{id:1, name:"GuestOnSeat"}}]}]}, 1);
    deepEqual(guest, {id:1, name:"GuestOnSeat"}, 'A guest can be found');
});

test('Guest in table', function () {
    var guest = sq.getGuest({tableList:[{seatList:[{seat:[{id:1, name:"GuestOnSeat"}]}]}]}, 1);
    deepEqual(guest, {id:1, name:"GuestOnSeat"}, 'A guest can be found');
});

test('Seat', function () {
    var seat = sq.getSeat({tableList:[{seatList:[{id: 1, name:"Seat1"}]}]}, 1);
    deepEqual(seat, {id: 1, name:"Seat1"}, 'A seat can be found');
});

test('Seat by Number', function () {
    var seat = sq.getSeatByNumber({tableList:[{seatList:[{id: 1, name:"Seat1"}]}]}, 0);
    deepEqual(seat, {id: 1, name:"Seat1"}, 'A seat can be found');
});






