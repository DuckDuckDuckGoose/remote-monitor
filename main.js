const {spawn} = require(`child_process`);

const child = spawn(`typeperf`, [`-cf`, `counters.txt`], {shell: false});
child.stdout.on(`data`, (rawData) => {
  console.log(rawData.toString());
})
