const { copyFileSync, existsSync, mkdirSync } = require('node:fs');
const { dirname, join, resolve } = require('node:path');

const staticDirectory = resolve(__dirname, '..', 'static', 'vendor');

function copyAsset(packageName, candidates, destination) {
    const packageDirectory = dirname(require.resolve(packageName));
    const source = candidates
        .map((candidate) => join(packageDirectory, candidate))
        .find((candidate) => existsSync(candidate));

    if (!source) {
        throw new Error(`Could not find a browser build for ${packageName}.`);
    }

    copyFileSync(source, join(staticDirectory, destination));
}

mkdirSync(staticDirectory, { recursive: true });

copyAsset('jquery', ['jquery.min.js'], 'jquery.min.js');
copyAsset('underscore', ['underscore-umd-min.js', 'underscore-min.js'], 'underscore-min.js');
copyAsset('raphael', ['raphael.min.js'], 'raphael.min.js');
