import { io } from "socket.io-client";
import { getJwt } from "../authservice";
import {logout} from '../authservice'

const URL = "http://localhost:3000/";

const socket = io(URL, {
  autoConnect: false,
  auth: {
    token: ""
  },
  'reconnection delay': 2500,
  'secure': true,
  'max reconnection attempts': 10,
  'reconnection': true 
});

export function connectSocket(){
  //if socket is not already connected
  if (!socket.connected) {
    //assign auth token
    socket.auth.token = getJwt()
    //try and connect to the socket
    socket.connect()
  } else{
    console.log('user already connected')
  }
}

socket.on('disconnect', reason => {
  console.log('disconnect')
  if (reason === 'transport close') {
      logout()
      window.alert('Server closed, user logged out')
  }
})

socket.onAny((event, ...args) => {
  //console.log(event, args);
});

export default socket;