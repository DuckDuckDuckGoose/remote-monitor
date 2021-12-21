const {Server} = require(`socket.io`);
const express = require(`express`);
const {createServer} = require(`http`);
const {outPort} = require(`./server.json`);
const path = require(`path`);

class DataOutServer {
  constructor() {

    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new Server({
      cors: {
        origin: `http://localhost`,
        methods: [`GET`, `POST`]
      }
    });

    this.sockets = {};

    this.io.on(`connection`, (socket) => {

      let id = socket.id;
      console.log(`Socket: ${id} connected`);

      this.sockets[id] = {socket: socket};

      socket.on(`disconnect`, () => {
        delete this.sockets[id];
        console.log(`Socket: ${id} disconnected`);
      })

    });
  }
  listen() {
    this.app.use(express.static(path.join(__dirname, `public`)))
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, `public/index.html`))
    });
    this.httpServer.listen(outPort);
    console.log(`Listening on port: ${outPort}`);
  }
}
module.exports = DataOutServer;
