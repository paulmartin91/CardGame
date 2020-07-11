import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

//Components
import Login from './components/Login'
import Lobby from './components/Lobby'
import GameSearch from './components/GameSearch'
import GamePage from './components/GamePage'
import './components/Style/Components.scss'

//Socket Variables
const ENDPOINT = 'localhost:3001'
const socket = io(ENDPOINT)

function App() {

  //States
  //const [pageDirect, setPageDirect] = useState('Login');
  const [pageDirect, setPageDirect] = useState('GamePage'); //<- for development
  
  
  useEffect(() => {


  }, [ENDPOINT])

  return(
    <div>
      <p>Q: What page am I on?<br />A: {pageDirect}</p>
      {
        pageDirect === 'Login' ? <Login socket={socket} ENDPOINT={ENDPOINT} pageDirect={pageDirect} setPageDirect={setPageDirect} /> : 
        pageDirect === 'GameSearch' ? <GameSearch socket={socket} ENDPOINT={ENDPOINT} pageDirect={pageDirect} setPageDirect={setPageDirect} /> : 
        pageDirect === 'Lobby' ? <Lobby socket={socket} ENDPOINT={ENDPOINT} pageDirect={pageDirect} setPageDirect={setPageDirect} /> :
        pageDirect === 'GamePage' ? <GamePage socket={socket} ENDPOINT={ENDPOINT} pageDirect={pageDirect} setPageDirect={setPageDirect} /> :
        <p>error</p>
      }
    </div>
  )
}

export default App;