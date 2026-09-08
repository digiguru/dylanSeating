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

function patchLegacyDeskConstructor() {
    const target = join(publicDirectory, 'dylanSeatingHitched.js');
    const legacyConstructor = 'Desk = function (x, y, rotation, callback) {\n            this.id = controller.NextTableID();';
    const fixedConstructor = 'Desk = function (x, y, rotation, id, callback) {\n            this.id = id || controller.NextTableID();';
    const source = readFileSync(target, 'utf8');

    if (!source.includes(legacyConstructor)) {
        throw new Error('Could not find the legacy Desk constructor to patch.');
    }

    writeFileSync(target, source.replace(legacyConstructor, fixedConstructor));
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

    if (!source.includes(legacyDrop)) {
        throw new Error('Could not find the legacy loose-guest drop path to patch.');
    }

    writeFileSync(target, source.replace(legacyDrop, fixedDrop));
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
copyFileSync(join(staticDirectory, 'socketExampleClient.html'), join(publicDirectory, 'index.html'));
