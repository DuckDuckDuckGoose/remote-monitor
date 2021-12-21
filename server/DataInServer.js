const { Server } = require(`socket.io`);
const {inPort} = require(`./server.json`);

class DataInServer {
  constructor() {

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

      socket.emit(`HEADER_REQUEST`, null);
      socket.on(`HEADER`, (header) => {
      })

    });
  }
  listen() {
    this.io.listen(inPort)
    console.log(`Listening on port: ${inPort}`);
  }
}
module.exports = DataInServer;
