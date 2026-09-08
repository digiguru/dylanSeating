const { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { dirname, join, resolve } = require('node:path');

const projectDirectory = resolve(__dirname, '..');
const staticDirectory = join(projectDirectory, 'static');
const vendorDirectory = join(staticDirectory, 'vendor');
const publicDirectory = join(projectDirectory, 'public');

function copyAsset(packageName, candidates, destination) {
    const packageDirectory = dirname(require.resolve(packageName));
    const source = candidates
        .map((candidate) => join(packageDirectory, candidate))
        .find((candidate) => existsSync(candidate));

    if (!source) {
        throw new Error(`Could not find a browser build for ${packageName}.`);
    }

    copyFileSync(source, join(vendorDirectory, destination));
}

function copySocketIoClient(destination) {
    const packageDirectory = resolve(dirname(require.resolve('socket.io-client')), '..', '..');
    const source = join(packageDirectory, 'dist', 'socket.io.min.js');

    if (!existsSync(source)) {
        throw new Error('Could not find the Socket.IO browser build.');
    }

    copyFileSync(source, join(vendorDirectory, destination));
}

function replaceRequired(source, legacy, replacement, description) {
    if (!source.includes(legacy)) {
        throw new Error(`Could not find legacy code for ${description}.`);
    }
    return source.replace(legacy, replacement);
}

function patchLegacyDeskConstructor() {
    const target = join(publicDirectory, 'dylanSeatingHitched.js');
    const legacyConstructor = 'Desk = function (x, y, rotation, callback) {\n            this.id = controller.NextTableID();';
    const fixedConstructor = 'Desk = function (x, y, rotation, id, callback) {\n            this.id = id || controller.NextTableID();';
    const source = readFileSync(target, 'utf8');

    writeFileSync(target, replaceRequired(source, legacyConstructor, fixedConstructor, 'Desk constructor'));
}

function patchLooseGuestDrag() {
    const target = join(publicDirectory, 'dylanSeatingHitched.js');
    const legacyDrop = `                    } else {
                        model.ghost.hide();
                        model.removeFromSeat();
                    }`;
    const fixedDrop = `                    } else {
                        model.ghost.hide();
                        if (model.seat) {
                            model.removeFromSeat();
                        } else {
                            model.showHelpText(model.name);
                        }
                    }`;
    const source = readFileSync(target, 'utf8');

    writeFileSync(target, replaceRequired(source, legacyDrop, fixedDrop, 'loose guest drag'));
}

function patchObjectStyling() {
    const target = join(publicDirectory, 'dylanSeatingHitched.js');
    let source = readFileSync(target, 'utf8');

    source = replaceRequired(
        source,
        'return new Guest(data.name, data.x, data.y, data.id, callback);',
        'return new Guest(data.name, data.x, data.y, data.id, callback, data.colour);',
        'guest colour loading'
    );
    source = replaceRequired(
        source,
        'return new RoundTable(data.x, data.y, data.seatCount, data.seatList, data.id, callback);',
        'return new RoundTable(data.x, data.y, data.seatCount, data.seatList, data.id, callback, data.name, data.colour);',
        'round table styling loading'
    );
    source = replaceRequired(
        source,
        'return new Desk(data.x, data.y, data.rotation, data.id, callback);',
        'return new Desk(data.x, data.y, data.rotation, data.id, callback, data.name, data.colour, data.seatList);',
        'desk styling loading'
    );

    source = replaceRequired(
        source,
        'Guest = function (name, x, y, id, callback) {',
        'Guest = function (name, x, y, id, callback, colour) {',
        'Guest styling constructor'
    );
    source = replaceRequired(
        source,
        'RoundTable = function (x, y, seatCount, seatList, id, callback) {',
        'RoundTable = function (x, y, seatCount, seatList, id, callback, name, colour) {',
        'RoundTable styling constructor'
    );
    source = replaceRequired(
        source,
        'Desk = function (x, y, rotation, id, callback) {',
        'Desk = function (x, y, rotation, id, callback, name, colour, seatData) {',
        'Desk styling constructor parameters'
    );
    source = replaceRequired(
        source,
        'Seat = function (x, y, rotation, table, seatNumber, id, guest) {',
        'Seat = function (x, y, rotation, table, seatNumber, id, guest, name, colour) {',
        'Seat styling constructor'
    );

    source = replaceRequired(
        source,
        'var mySeat = new Seat(0, 0, 0, this, seat.seatNumber, seat.id, seat.guest),',
        'var mySeat = new Seat(0, 0, 0, this, seat.seatNumber, seat.id, seat.guest, seat.name, seat.colour),',
        'known chair styling loading'
    );
    source = replaceRequired(
        source,
        'var mySeat = new Seat(x, y, rotation);\n                mySeat.table = this;',
        'var storedSeat = seatData && seatData[0],\n                    mySeat = new Seat(x, y, rotation, this, 0, storedSeat && storedSeat.id, storedSeat && storedSeat.guest, storedSeat && storedSeat.name, storedSeat && storedSeat.colour);',
        'desk chair styling loading'
    );

    source = replaceRequired(
        source,
        `            this.ToJson = function () {
                return {
                    name: this.name,
                    x: this.GetX(),
                    y: this.GetY()
                };
            };
            if (callback) {`,
        `            this.ToJson = function () {
                return {
                    name: this.name,
                    x: this.GetX(),
                    y: this.GetY()
                };
            };
            if (window.DylanSeatingObjectStyling) {
                window.DylanSeatingObjectStyling.register(this, "guest", { name: this.name, colour: colour });
            }
            if (callback) {`,
        'Guest styling registration'
    );

    source = replaceRequired(
        source,
        `            this.graphic.click(myMouseClick);
        },
        SeatMarker = function`,
        `            this.graphic.click(myMouseClick);
            if (window.DylanSeatingObjectStyling) {
                window.DylanSeatingObjectStyling.register(this, "chair", { name: name, colour: colour });
            }
        },
        SeatMarker = function`,
        'chair styling registration'
    );

    source = replaceRequired(
        source,
        `                return {
                    type: "round",
                    seatCount: this.tableSeatList.length,
                    x: this.GetX(),
                    y: this.GetY(),
                    seatList: seatObject
                };
            };
        },
        MathHelper = {`,
        `                return {
                    type: "round",
                    seatCount: this.tableSeatList.length,
                    x: this.GetX(),
                    y: this.GetY(),
                    seatList: seatObject
                };
            };
            if (window.DylanSeatingObjectStyling) {
                window.DylanSeatingObjectStyling.register(this, "round-table", { name: name, colour: colour });
            }
        },
        MathHelper = {`,
        'round table styling registration'
    );

    source = replaceRequired(
        source,
        `                return {
                    type: "desk",
                    rotation: this.rotation,
                    x: this.GetX(),
                    y: this.GetY(),
                    seatList: seatObject
                };
            };
            if (callback) {`,
        `                return {
                    type: "desk",
                    rotation: this.rotation,
                    x: this.GetX(),
                    y: this.GetY(),
                    seatList: seatObject
                };
            };
            if (window.DylanSeatingObjectStyling) {
                window.DylanSeatingObjectStyling.register(this, "desk", { name: name, colour: colour });
            }
            if (callback) {`,
        'desk styling registration'
    );

    source = replaceRequired(
        source,
        `            var myMouseOver = function (event) {
                    Generic.Highlight(this);
                    this.animate({
                        fill: "red"
                    }, animationTime);
                },
                myMouseOut = function (event) {
                    Generic.Unhighlight(this);
                    this.animate({
                        fill: "blue"
                    }, animationTime);
                },`,
        `            var myMouseOver = function (event) {
                    Generic.Highlight(this);
                },
                myMouseOut = function (event) {
                    Generic.Unhighlight(this);
                    this.attr({ fill: this.attr("model").colour || "#cce8cf" });
                },`,
        'chair hover colour preservation'
    );

    writeFileSync(target, source);
}

mkdirSync(vendorDirectory, { recursive: true });

copyAsset('jquery', ['jquery.min.js'], 'jquery.min.js');
copyAsset('underscore', ['underscore-umd-min.js', 'underscore-min.js'], 'underscore-min.js');
copyAsset('raphael', ['raphael.min.js'], 'raphael.min.js');
copySocketIoClient('socket.io.min.js');

rmSync(publicDirectory, { recursive: true, force: true });
cpSync(staticDirectory, publicDirectory, { recursive: true });
patchLegacyDeskConstructor();
patchLooseGuestDrag();
patchObjectStyling();
copyFileSync(join(staticDirectory, 'socketExampleClient.html'), join(publicDirectory, 'index.html'));
