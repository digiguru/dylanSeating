const mongoose = require('mongoose');

let registered = false;

function ensureStylingSchema() {
    const Guest = mongoose.model('Guest');
    const Seat = mongoose.model('Seat');
    const Table = mongoose.model('Table');

    Guest.schema.add({ colour: String });
    Seat.schema.add({ name: String, colour: String });
    Table.schema.add({ name: String, colour: String, rotation: Number });
}

function sameId(left, right) {
    return left !== undefined && left !== null && right !== undefined && right !== null && String(left) === String(right);
}

function findTable(plan, id) {
    return plan.tableList.find((table) => sameId(table.id, id));
}

function findGuest(plan, id) {
    let guest = plan.guestList.find((item) => sameId(item.id, id));

    if (guest) {
        return guest;
    }

    for (const table of plan.tableList) {
        for (const seat of table.seatList) {
            guest = seat.guest.find((item) => sameId(item.id, id));
            if (guest) {
                return guest;
            }
        }
    }

    return null;
}

function findChair(plan, data) {
    const table = findTable(plan, data.table);
    if (!table) {
        return null;
    }
    return table.seatList.find((seat) =>
        sameId(seat.id, data.id) || Number(seat.seatNumber) === Number(data.seatNumber)
    );
}

function findObject(plan, data) {
    if (data.objectType === 'guest') {
        return findGuest(plan, data.id);
    }
    if (data.objectType === 'table') {
        return findTable(plan, data.id);
    }
    if (data.objectType === 'chair') {
        return findChair(plan, data);
    }
    return null;
}

function registerObjectStyling(io) {
    if (registered) {
        return;
    }
    registered = true;
    ensureStylingSchema();

    io.on('connection', (socket) => {
        socket.on('EditObjectStyle', async (message, callback) => {
            try {
                const data = message && message.data;
                const planQuery = message && message.plan;
                const Plan = mongoose.model('Plan');
                const plan = await Plan.findOne(planQuery).exec();
                const object = plan && data && findObject(plan, data);

                if (!object) {
                    throw new Error('Could not find object to style.');
                }

                if (Object.prototype.hasOwnProperty.call(data.current || {}, 'name')) {
                    object.set('name', data.current.name);
                }
                if (Object.prototype.hasOwnProperty.call(data.current || {}, 'colour')) {
                    object.set('colour', data.current.colour);
                }

                await plan.save();
                socket.broadcast.emit('EditObjectStyleResponse', data);
                if (typeof callback === 'function') {
                    callback({ ok: true });
                }
            } catch (error) {
                console.error('Could not edit object style', error);
                if (typeof callback === 'function') {
                    callback({ ok: false, error: error.message });
                }
            }
        });
    });
}

module.exports = { registerObjectStyling };
