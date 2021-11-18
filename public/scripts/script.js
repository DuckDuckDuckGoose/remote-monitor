const socket = io();
socket.on(`connect`, () => {
  console.log(socket.id);
})
window.addEventListener(`load`, () => {
  for(let i = 0;i < 10;i++) {
    Pie();
  }
})




function Pie() {
  this.div = document.createElement(`div`);
  this.div.classList.add(`module`);
  this.div.classList.add(`graph`);
  this.canvas = document.createElement(`canvas`);
  this.canvas.classList.add(`graph-canvas`);
  this.canvas.width = 400;
  this.canvas.height = 400;
  this.div.appendChild(this.canvas);
  this.div = this.document.body.appendChild(this.div);
  let ele = this.div.getElementsByClassName(`graph-canvas`);
  this.canvas = ele.item(0);
  this.ctx = this.canvas.getContext(`2d`);
  this.ctx.fillStyle = `#00ff00`;
  this.ctx.fillRect(0, 0, canvas.width, canvas.height);
}
