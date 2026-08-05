const { server } = require('./socketExampleExpress.js');

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
});
