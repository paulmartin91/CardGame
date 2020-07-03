import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Socket } from 'net';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login'
import Lobby from './components/Lobby'
import GameSearch from './components/GameSearch'

const App = () => {

  //States
  const [pageDirect, setPageDirect] = useState('');
  
  //Socket Variables
  const ENDPOINT = 'localhost:3001'
  const socket = io(ENDPOINT)

  useEffect(() => {

  }, [ENDPOINT])

  return(
    <div>
      <Login socket={socket} ENDPOINT={ENDPOINT} pageDirect={pageDirect} setPageDirect={setPageDirect} />
      <Lobby socket={socket} ENDPOINT={ENDPOINT} pageDirect={pageDirect} setPageDirect={setPageDirect} />
      {/* <Lobby />
      <GameSearch />
      <GamePage /> */}
    </div>
  )
}

export default App;