const {spawn} = require(`child_process`);
const fs = require(`fs`);

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

let command = `Get-Counter "\\PhysicalDisk(*)\\Disk Read Bytes/sec", "\\Processor(*)\\% Processor Time" -Continuous`;
let child = spawn(`powershell.exe`, [`-command`, command]);
(() => {
  let content = ``;
  let stdout = child.stdout;
  stdout.on(`data`, (data) => {
    content = content.concat(data.toString());
    content = stdoutSegmenter(content);
  })
})()

///[\d\/]{10}\s*[\d:]{8}/g
// /\\{2}.*\s*[\d.]*/g


function stdoutSegmenter(stdoutContent) {
  let dates = stdoutContent.match(/[\d\/]{10}\s*[\d:]{8}/g);
  if(dates && dates.length >= 2) {
    let segments = [];
    let start, end;
    for(let i = 0;i < dates.length - 1;i++) {
      start = stdoutContent.indexOf(dates[i]);
      end = stdoutContent.indexOf(dates[i + 1]);
      segments.push(stdoutContent.slice(start, end));
    }
    segments.forEach((segment) => {
      segmentParser(segment);
    })
    return stdoutContent.slice(end)
  }
  return stdoutContent
}

function segmentParser(segment) {
  let date = segment.match(/[\d\/]{10}\s*[\d:]{8}/g)[0];
  let rawCounters = segment.match(/\\{2}.*\s*[\d.]*/g);
  let counters = rawCounters.map((rawCounter, index) => {
    let counter = rawCounter.slice(0, rawCounter.lastIndexOf(`:`) - 1)
      .match(/[^\\]+/g).slice(1).join(`\\`);
    let value = rawCounter.slice(rawCounter.lastIndexOf(`:`) + 1)
      .replace(/\s/g, ``);
    return [counter, parseInt(value)];
  })
  let segmentObj = {date: date, data: Object.fromEntries(counters)};
  sendDataPacket(segmentObj);
}

function sendDataPacket(segmentObj) {
  io.emit(`dataPacket`, segmentObj);
}

function getCounters() {
  return new Promise(async (resolve, reject) => {
    let data = fs.readFileSync(`./counters.txt`).toString();
    let counters = data.split(`\r\n`).filter((str) => str.length > 0);
    resolve(counters);
  })
}

function createCommand() {
  return new Promise(async(resolve, reject) => {
    let counters = await getCounters();
    let command = `Get-Counter ` + counters.map((str) => `"${str}"`).join(`, `)
  })
}










httpServer.listen(3000, () => {
  console.log(`Server listening on port: 3000`)
});
