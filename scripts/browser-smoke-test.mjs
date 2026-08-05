import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const require = createRequire(import.meta.url);
const httpServer = require('http-server');
const projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const staticDirectory = join(projectDirectory, 'static');
const staticServer = httpServer.createServer({ root: staticDirectory });
const server = staticServer.server;

let browser;
let browserHome;

try {
    await new Promise((resolveServer, rejectServer) => {
        server.once('error', rejectServer);
        server.listen(0, '127.0.0.1', () => {
            server.off('error', rejectServer);
            resolveServer();
        });
    });

    const { port } = server.address();
    const serverUrl = `http://127.0.0.1:${port}`;

    for (const asset of ['vendor/jquery.min.js', 'vendor/underscore-min.js', 'vendor/raphael.min.js']) {
        const response = await fetch(`${serverUrl}/${asset}`);
        if (!response.ok) {
            throw new Error(`Expected ${asset} to be available, received ${response.status}.`);
        }
    }

    browserHome = await mkdtemp(join(tmpdir(), 'dylan-seating-browser-'));
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        env: { ...process.env, HOME: browserHome }
    });

    const page = await browser.newPage();
    await page.goto(`${serverUrl}/seatingtest.htm`, { waitUntil: 'networkidle0' });
    const heading = await page.$eval('h1', (element) => element.textContent);

    if (!heading?.includes('My Guests')) {
        throw new Error('The seating page did not render its expected heading.');
    }

    console.log('Browser smoke test passed.');
} finally {
    await browser?.close();
    await new Promise((resolveServer, rejectServer) => {
        server.close((error) => (error ? rejectServer(error) : resolveServer()));
    });
    if (browserHome) {
        await rm(browserHome, { recursive: true, force: true });
    }
}
