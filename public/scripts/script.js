const socket = io();
socket.on(`connect`, () => {
  console.log(socket.id);
})
window.addEventListener(`load`, () => {

})
