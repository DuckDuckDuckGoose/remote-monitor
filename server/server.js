const DataInServer = require(`./DataInServer.js`);
const DataOutServer = require(`./DataOutServer.js`);

const dataIn = new DataInServer();
const dataOut = new DataOutServer();

dataIn.listen();
dataOut.listen();
