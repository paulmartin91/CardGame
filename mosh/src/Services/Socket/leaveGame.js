import socket from "./socket";

export default function leaveGame(){socket.emit('client request leave current game')}