const serverModule = require('./socketExampleExpress.js');
const { registerObjectStyling } = require('./objectStylingServer.js');

registerObjectStyling(serverModule.io);

if (require.main === module) {
    serverModule.startServer().catch((error) => {
        console.error('Unable to start DylanSeating', error);
        process.exitCode = 1;
    });
}

module.exports = serverModule;
