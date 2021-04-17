import socket from "./socket";

export default function leaveGame(){
  console.log('leave')
  socket.emit('client_request_leave_current_game')
}