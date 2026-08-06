const mongoose = require('mongoose');
const { io: createClient } = require('socket.io-client');
const socketFunction = require('./api/socket-io.js');
const { connectDatabase, io, server, SOCKET_IO_PATH } = require('./socketExampleExpress.js');

describe('application server', () => {
    let origin;

    beforeAll(async () => {
        await new Promise((resolve, reject) => {
            server.once('error', reject);
            server.listen(0, '127.0.0.1', () => {
                server.off('error', reject);
                origin = `http://127.0.0.1:${server.address().port}`;
                resolve();
            });
        });
    });

    afterAll(async () => {
        await new Promise((resolve, reject) => {
            server.close((error) => (error ? reject(error) : resolve()));
        });
    });

    test('serves the seating client without connecting to MongoDB on import', async () => {
        const response = await fetch(origin);
        const body = await response.text();

        expect(response.ok).toBe(true);
        expect(body).toContain('dylanSeating Demo');
        expect(response.headers.get('ratelimit')).toBeTruthy();
    });

    test('requires database configuration only when a connection is requested', async () => {
        const originalConnectionString = process.env.MONGOATLAS_CONNECTION;

        delete process.env.MONGOATLAS_CONNECTION;
        await expect(connectDatabase()).rejects.toThrow('MONGOATLAS_CONNECTION must be set');

        if (originalConnectionString === undefined) {
            delete process.env.MONGOATLAS_CONNECTION;
        } else {
            process.env.MONGOATLAS_CONNECTION = originalConnectionString;
        }
    });

    test('exports a WebSocket-only Socket.IO server for the Vercel API route', async () => {
        const originalConnectionString = process.env.MONGOATLAS_CONNECTION;
        const connect = jest.spyOn(mongoose, 'connect').mockResolvedValue(mongoose.connection);
        process.env.MONGOATLAS_CONNECTION = 'mongodb://example.test/dylanSeating';

        const socket = await new Promise((resolveSocket, rejectSocket) => {
            const client = createClient(origin, {
                forceNew: true,
                path: SOCKET_IO_PATH,
                timeout: 1000,
                transports: ['websocket']
            });

            client.once('connect', () => resolveSocket(client));
            client.once('connect_error', rejectSocket);
        });

        try {
            expect(socketFunction).toBe(server);
            expect(io.path()).toBe(SOCKET_IO_PATH);
            expect(connect).toHaveBeenCalledWith('mongodb://example.test/dylanSeating');
        } finally {
            socket.disconnect();
            connect.mockRestore();
            if (originalConnectionString === undefined) {
                delete process.env.MONGOATLAS_CONNECTION;
            } else {
                process.env.MONGOATLAS_CONNECTION = originalConnectionString;
            }
        }
    });
});
