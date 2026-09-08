const mongoose = require('mongoose');
const { io } = require('./socketExampleExpress.js');
const { registerObjectStyling } = require('./objectStylingServer.js');

describe('object styling persistence', () => {
    beforeAll(() => {
        registerObjectStyling(io);
    });

    test('extends saved guests, tables and chairs with styling fields', () => {
        const Guest = mongoose.model('Guest');
        const Table = mongoose.model('Table');
        const Seat = mongoose.model('Seat');

        expect(Guest.schema.path('colour')).toBeDefined();
        expect(Table.schema.path('name')).toBeDefined();
        expect(Table.schema.path('colour')).toBeDefined();
        expect(Table.schema.path('rotation')).toBeDefined();
        expect(Seat.schema.path('name')).toBeDefined();
        expect(Seat.schema.path('colour')).toBeDefined();
    });
});
