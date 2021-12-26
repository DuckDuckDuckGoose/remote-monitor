// imports & main vars
const osu = require(`node-os-utils`);
const {io} = require(`socket.io-client`);
const {ip, port} = require(`./client.json`);
let delay = 5000;
let running = false;
let interval = null;

// socket setup
const socket = io(`http://${ip}:${port.toString()}`);
socket.on(`HEADER_REQUEST`, () => {
  socket.emit(`HEADER`, getHeader());
})
socket.on(`RUN`, (bool) => {
  if(bool) {
    newInterval();
  } else {
    delInterval();
  }
})
socket.on(`DELAY`, (del) => {
  if(delay) {
    delay = del;
  } else {
    delay = 5000;
  }
  if(running) {
    newInterval();
  }
})
socket.onAny((event, ...args) => {
  console.log(`recieved ${args} with event ${event}`)
})

//perf data poll function
async function getPerfData() {
  return {
    cpu: {
      usage: await osu.cpu.usage()
    },
    network: await osu.netstat.inOut(),
    drive: await (async () => {
      try{
        return await osu.disk.info();
      } catch(e) {
        return `not supported`;
      }
    })(),
    memory: await osu.mem.info()
  }
}

//header data poll function
function getHeader() {
  let header = {};
  header.hostname = osu.os.hostname();
  header.ip = osu.os.ip();
  header.cpu = {count: osu.cpu.count(), model: osu.cpu.model()};
  header.os = {name: osu.os.oos(), type: osu.os.type(), arch: osu.os.arch()}
  return header;
}

function newInterval() {
  delInterval();
  running = true;
  interval = setInterval(async () => {
    let data = await getPerfData()
    socket.emit(`DATA`, data);
  }, delay)
}
function delInterval() {
  if(interval) {
    clearInterval(interval)
  }
  running = false;
}
