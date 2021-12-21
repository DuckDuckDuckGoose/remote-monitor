const { Server } = require(`socket.io`);
const {port} = require(`./server.json`);

const io = new Server({
  cors: {
    origin: `http://localhost`,
    methods: [`GET`, `POST`]
  }
});

let sockets = {};

io.on(`connection`, (socket) => {

  let id = socket.id;
  console.log(`Socket: ${id} connected`);
  sockets[id] = {socket: socket};
  socket.on(`disconnect`, () => {
    delete sockets[id];
    console.log(`Socket: ${id} disconnected`);
  })

  socket.emit(`HEADER_REQUEST`, null);
  socket.on(`HEADER`, (header) => {
    sockets[id].header = header;
    socket.emit(`RUN`, true)
    socket.emit(`DELAY`, 750)
  })

  socket.onAny((event, ...args) => {
    //console.log(`recieved ${args} from socket:${id} with event ${event}`)
    console.log(args[0])
  })
});

io.listen(port);
