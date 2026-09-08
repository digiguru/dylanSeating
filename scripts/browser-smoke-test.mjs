import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const require = createRequire(import.meta.url);
const httpServer = require('http-server');
const projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDirectory = join(projectDirectory, 'public');
const staticServer = httpServer.createServer({ root: publicDirectory });
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

    for (const asset of [
        'vendor/jquery.min.js',
        'vendor/underscore-min.js',
        'vendor/raphael.min.js',
        'vendor/socket.io.min.js',
        'canvas-layout.js'
    ]) {
        const response = await fetch(`${serverUrl}/${asset}`);
        if (!response.ok) {
            throw new Error(`Expected ${asset} to be available, received ${response.status}.`);
        }
    }

    const homeResponse = await fetch(serverUrl);
    const homePage = await homeResponse.text();
    if (!homeResponse.ok || !homePage.includes('/api/socket-io/socket.io') || !homePage.includes('canvas-layout.js')) {
        throw new Error('Expected the Vercel-ready client page and canvas layout helper to be available at the site root.');
    }

    browserHome = await mkdtemp(join(tmpdir(), 'dylan-seating-browser-'));
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        env: { ...process.env, HOME: browserHome }
    });

    const page = await browser.newPage();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.setViewport({ width: 1600, height: 1400 });
    await page.goto(`${serverUrl}/seatingtest.htm`, { waitUntil: 'networkidle0' });
    const heading = await page.$eval('h1', (element) => element.textContent);

    if (!heading?.includes('My Guests')) {
        throw new Error('The seating page did not render its expected heading.');
    }

    await page.goto(serverUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#board svg');

    const canvasLayout = await page.evaluate(() => {
        const svg = document.querySelector('#board svg');
        const background = Array.from(svg.querySelectorAll('rect')).find((element) =>
            element.getAttribute('width') === '200' && element.getAttribute('height') === '600'
        );
        const expectedPositions = new Set(['120,120', '120,190', '120,260']);
        const alignedObjects = Array.from(svg.querySelectorAll('path, circle')).filter((element) => {
            const matrix = element.getCTM();
            if (!matrix) {
                return false;
            }
            return expectedPositions.has(`${Math.round(matrix.e)},${Math.round(matrix.f)}`);
        });

        return {
            heading: document.querySelector('.board-label')?.textContent,
            toolboxX: Number(background?.getAttribute('x')),
            toolboxY: Number(background?.getAttribute('y')),
            alignedObjectCount: alignedObjects.length
        };
    });

    if (canvasLayout.heading !== 'Seating Canvas') {
        throw new Error(`Expected Seating Canvas heading, received ${canvasLayout.heading}.`);
    }
    if (canvasLayout.toolboxX !== 20 || canvasLayout.toolboxY !== 72) {
        throw new Error(`Expected toolbox at 20,72; received ${canvasLayout.toolboxX},${canvasLayout.toolboxY}.`);
    }
    if (canvasLayout.alignedObjectCount !== 3) {
        throw new Error(`Expected three centred toolbox objects, found ${canvasLayout.alignedObjectCount}.`);
    }

    const deskCreation = await page.evaluate(async () => {
        const before = myDylanSeating.getTables().length;
        const controller = myDylanSeating.getController();

        controller.ac.Call('AddTable', {
            id: 'browser-desk-regression',
            type: 'desk',
            x: 320,
            y: 320,
            rotation: 90
        });

        await new Promise((resolve) => setTimeout(resolve, 50));

        const tables = myDylanSeating.getTables();
        const newestTable = tables[tables.length - 1];
        return {
            before,
            after: tables.length,
            id: newestTable?.id,
            type: newestTable?.ToJson?.().type
        };
    });

    if (deskCreation.after !== deskCreation.before + 1) {
        throw new Error(`Expected desk creation to add one table; before=${deskCreation.before}, after=${deskCreation.after}.`);
    }
    if (deskCreation.id !== 'browser-desk-regression' || deskCreation.type !== 'desk') {
        throw new Error(`Expected created desk to preserve its id/type; received ${deskCreation.id}/${deskCreation.type}.`);
    }

    const looseGuestBefore = await page.evaluate(async () => {
        const controller = myDylanSeating.getController();
        controller.ac.Call('AddGuest', {
            id: 'browser-loose-guest-regression',
            name: 'Loose Guest',
            x: 500,
            y: 500
        });

        await new Promise((resolve) => setTimeout(resolve, 50));

        const guest = myDylanSeating.getGuests().find((candidate) => candidate.id === 'browser-loose-guest-regression');
        guest.graphic.node.setAttribute('id', 'browser-loose-guest');
        return {
            x: guest.GetX(),
            y: guest.GetY(),
            hasSeat: Boolean(guest.seat)
        };
    });

    if (looseGuestBefore.hasSeat) {
        throw new Error('Expected newly added regression guest to start loose on the canvas.');
    }

    const looseGuestElement = await page.$('#browser-loose-guest');
    if (!looseGuestElement) {
        throw new Error('Could not find the newly created loose guest graphic.');
    }
    await looseGuestElement.evaluate((element) => element.scrollIntoView({ block: 'center', inline: 'center' }));
    const looseGuestBox = await looseGuestElement.boundingBox();
    if (!looseGuestBox) {
        throw new Error('Could not measure the newly created loose guest graphic.');
    }

    const dragStartX = looseGuestBox.x + looseGuestBox.width / 2;
    const dragStartY = looseGuestBox.y + looseGuestBox.height / 2;
    await page.mouse.move(dragStartX, dragStartY);
    await page.mouse.down();
    await page.mouse.move(dragStartX + 120, dragStartY + 80, { steps: 8 });
    await page.mouse.up();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const looseGuestAfter = await page.evaluate(() => {
        const guest = myDylanSeating.getGuests().find((candidate) => candidate.id === 'browser-loose-guest-regression');
        return {
            x: guest.GetX(),
            y: guest.GetY(),
            hasSeat: Boolean(guest.seat)
        };
    });

    if (looseGuestAfter.hasSeat) {
        throw new Error('Expected loose guest to remain unseated after an empty-canvas drag.');
    }
    if (looseGuestAfter.x < looseGuestBefore.x + 80 || looseGuestAfter.y < looseGuestBefore.y + 50) {
        throw new Error(`Expected loose guest to stay at its dragged position; moved from ${looseGuestBefore.x},${looseGuestBefore.y} to ${looseGuestAfter.x},${looseGuestAfter.y}.`);
    }
    if (pageErrors.length > 0) {
        throw new Error(`Unexpected browser error while exercising seating interactions: ${pageErrors.join(' | ')}`);
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