import { io } from "socket.io-client";
import { getJwt } from "../authservice";

const URL = "http://localhost:3000/";

const socket = io(URL, {
  autoConnect: false,
  auth: {
    token: ""
  }
});

export function connectSocket(){
  //if socket is not already connected
  if (!socket.connected) {
    //assign auth token
    socket.auth.token = getJwt()
    //connect to the socket
    socket.connect()
  } else{
    console.log('user already connected')
  }
}

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;