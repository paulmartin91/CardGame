import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Socket } from 'net';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login'
import Lobby from './components/Lobby'
import GameSearch from './components/GameSearch'

//Socket Variables
const ENDPOINT = 'localhost:3001'
const socket = io(ENDPOINT)

function App() {

  //States
  const [pageDirect, setPageDirect] = useState('Login');
  
  
  useEffect(() => {


  }, [ENDPOINT])

  return(
    <div>
      {
        pageDirect == 'Login' ? <Login socket={socket} ENDPOINT={ENDPOINT} pageDirect={pageDirect} setPageDirect={setPageDirect} /> : 
        pageDirect == 'GameSearch' ? <GameSearch socket={socket} ENDPOINT={ENDPOINT} pageDirect={pageDirect} setPageDirect={setPageDirect} /> : 
        pageDirect == 'Lobby' ? <Lobby socket={socket} ENDPOINT={ENDPOINT} pageDirect={pageDirect} setPageDirect={setPageDirect} /> :
        <p>error</p>
      }
      {/* <Lobby />
      <GameSearch />
      <GamePage /> */}
    </div>
  )
}

export default App;