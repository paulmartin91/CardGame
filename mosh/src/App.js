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
  'paul': {'ready': false, 'playerNumber': 0},
  'john': {'ready': false, 'playerNumber': 1},
  // {'name': 'george', 'ready': false, 'hand': []},
}

const App = () => {

  //for development
  const [username, setUsername] = useState('paul')
  const [gameName, setGameName] = useState()
  const [playerList, setPlayerList] = useState({})

  //actual
  const [checkUser, setCheckUser] = useState(null) 

    useEffect(() => {
      socket.on("connect_error", (err) => {
        console.log(err.message)
      })
    }, [])
  
  return (
    <Switch>
        <ProtectedRoute
          path='/gamesearch'
          render={(props) => 
            <GameSearch 
              setPlayerList={setPlayerList} 
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
              {...props}
            />
          }
        />
        <ProtectedRoute
          path='/gamepage'
          component={GamePage}
        />
        {/* <Route 
          path='/gamesearch' 
          render={props => {
            if (checkUser === null) {
              console.log(checkUser)
              return <Redirect to="/" />
            }
            return (
              <GameSearch 
                username={username} 
                gameName={gameName} 
                setGameName={setGameName} 
                {...props} 
              />
            )
          }} 
        /> */}
        {/* <Route 
          path='/gamelobby/' 
          render={props => {
            // if (!user) return <Redirect to="/" />
            return(
              <GameLobby 
                username={username} 
                gameName={gameName} 
                playerList={playerList} 
                setPlayerList={setPlayerList} 
                {...props} 
              />)
            }
          } 
        /> */}
        {/* <Route 
          path='/gamepage/' 
          render={props => 
            <GamePage 
              username={username} 
              gameName={gameName} 
              playerList={playerList} 
              {...props} 
            />
          } 
        /> */}
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
