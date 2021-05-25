import {useEffect, useState} from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect }from "react-router-dom";

import GameSearch from "./Pages/GameSearch";
import Login from './Pages/Login'
import NotFound from './Pages/NotFound'
import GameLobby from "./Pages/GameLobby";
import GamePage from "./Pages/GamePage";
import Test from './Pages/Test';
import { getCurrentUser } from './Services/authservice'
import ProtectedRoute from './Components/Common/protectedRoute'
import socket from './Services/Socket/socket'

//for development
const DEVplayerList = {
  'paul12': {'ready': false, 'playerNumber': 0},
  'paul21': {'ready': false, 'playerNumber': 1},
  // {'name': 'george', 'ready': false, 'hand': []},
}

const App = () => {

  //for development
  const [username, setUsername] = useState('')
  const [gameName, setGameName] = useState()
  const [playerList, setPlayerList] = useState({})
  const [messages, setMessages] = useState([])

  //actual
  const [checkUser, setCheckUser] = useState(null) 

    useEffect(() => {
      socket.on("connect_error", (err) => {
        console.log(err.message)
      })

      socket.on('server_redirect_user_to_game', game => {
        setPlayerList(game.players)
        setGameName(game.name)
      })

      socket.on('server_request_leave_game', () => setGameName(null))

    }, [])
  
  return (
    <Switch>
        <ProtectedRoute
          path='/gamesearch'
          gameName={gameName}
          render={(props) => 
            <GameSearch 
              setPlayerList={setPlayerList}
              setGameName={setGameName}
              {...props}
            />
          }
        />
        <ProtectedRoute
          path='/gamelobby'
          render={(props) => 
            <GameLobby 
              playerList={playerList}
              setPlayerList={setPlayerList}
              gameName={gameName}
              setGameName={setGameName}
              messages={messages}
              setMessages={setMessages}
              username={username}
              setUsername={setUsername}
              {...props}
            />
          }
        />
        <ProtectedRoute
          path='/gamepage'
          render={(props) => 
            <GamePage 
              // playerList={playerList}
              playerList={playerList}
              setPlayerList={setPlayerList}
              gameName={gameName}
              messages={messages}
              setMessages={setMessages}
              username={username}
              setUsername={setUsername}
              {...props}
            />
          }
        />
        <Route 
          path='/not-found' 
          component={NotFound} 
        />
        <Route 
          path='/' 
          render={ props => 
            <Login 
              setUsername={setUsername}
              {...props} 
            />
          }
        />
        <Redirect 
          to='/not-found' 
        />
      </Switch>
  );
}

export default App;
