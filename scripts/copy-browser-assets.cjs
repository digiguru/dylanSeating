const { copyFileSync, cpSync, existsSync, mkdirSync, rmSync } = require('node:fs');
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

mkdirSync(vendorDirectory, { recursive: true });

copyAsset('jquery', ['jquery.min.js'], 'jquery.min.js');
copyAsset('underscore', ['underscore-umd-min.js', 'underscore-min.js'], 'underscore-min.js');
copyAsset('raphael', ['raphael.min.js'], 'raphael.min.js');
copySocketIoClient('socket.io.min.js');

rmSync(publicDirectory, { recursive: true, force: true });
cpSync(staticDirectory, publicDirectory, { recursive: true });
copyFileSync(join(staticDirectory, 'socketExampleClient.html'), join(publicDirectory, 'index.html'));
