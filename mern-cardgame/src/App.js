import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Socket } from 'net';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login'
import Lobby from './components/Lobby'
import GameSearch from './components/GameSearch'

const App = () => {

  //set state
  const [name, setName] = useState('');
  const ENDPOINT = 'localhost:3001'
  const socket = io(ENDPOINT)


  useEffect(() => {
    
    socket.emit('test1')

    setName(name)

  }, [ENDPOINT])

  return(
    <div>
      <Login socket={socket} ENDPOINT={ENDPOINT} />
      <Lobby socket={socket} />
      {/* <Lobby />
      <GameSearch />
      <GamePage /> */}
    </div>
  )
}

export default App;