const socket = io();
socket.on(`connect`, () => {
  console.log(socket.id);
})
socket.on(`dataPacket`, (data) => {
  console.log(data);
})
window.addEventListener(`load`, () => {

})
