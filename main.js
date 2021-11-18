const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require(`path`);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  let id = socket.id
  console.log(`Socket: ${id} connected`);

  socket.on(`disconnect`, (socket) => {
    console.log(`Socket: ${id} disconnected`)
  })

  socket.on(`connect_error`, (socket) => {
    console.log(`Socket: ${id} connect error`)
  })
});

app.use(express.static(path.join(__dirname, `public`)))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, `public/index.html`))
})

httpServer.listen(3000);
