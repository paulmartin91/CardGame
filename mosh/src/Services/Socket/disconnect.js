import socket from './socket'

export default function disconnect(){ 
  console.log('here')
  socket.emit('client_request_disconnect_reason', 'logged_out')
  //socket.disconnect() 
}