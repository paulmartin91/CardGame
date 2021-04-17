import React, { useState, useEffect} from 'react';
import MessageBox from '../Containers/MessageBox';
import { getCurrentUser, logout } from '../Services/authservice';
import socket, {connectSocket} from '../Services/Socket/socket'
import leaveGame from '../Services/Socket/leaveGame'

// const Lobby = ({socket, ENDPOINT, setPageDirect}) => {
const Lobby = ({history, gameName, setGameName, playerList, setPlayerList}) => {
    
    const [isReady, setIsReady] = useState(false)
    const [username, setUsername] = useState()

    useEffect(()=>{

        connectSocket()

        setUsername(getCurrentUser())

        //socket.on('server response playerList refresh', (res) => console.log(res));
        socket.on("server_response_playerList_refresh", (players) => {
            console.log(players)
            setPlayerList(players)
        });

        socket.on("server_response_leave_current_game", response => {
            if (response){
                setGameName()
                setPlayerList({})
                history.push("/gameSearch")
            } else console.log('error!')  
        })

        // setPlayerList(playerList)

        // socket.on('other player ready status changed', ready => {
        //     console.log(ready.ready)
        //     ready.ready ? document.getElementById(ready.username).style = "background-color: #B7E2C0; transition: 0.5s" : document.getElementById(ready.username).style = "background-color:; transition: 0.5s"
        // })

        // socket.on('player ready status changed', isReady => {
        //     setIsReady(isReady)
        //     isReady ? document.getElementById(socket.username).style = "background-color: #B7E2C0; transition: 0.5s" : document.getElementById(socket.username).style = "background-color:; transition: 0.5s"
        // })
  
        // socket.on('new user joined game', response => {
        //     setMessages(messages => [...messages, {
        //         time: response.time,
        //         username: 'Server',
        //         message: `${response.username} has joined the lobby, currently ${Object.keys(playerList).length == 1 ? ' 1 player' : `${Object.keys(playerList).length} players`} in the lobby`
        //     }])
        //     document.getElementById(`messageBox`).scrollTop = document.getElementById(`messageBox`).scrollHeight
        //     setPlayerList(response.playerList)
        //     // document.getElementById("lobbymessages").innerHTML += `${user.username} has joined the lobby, currently ${user.users.length == 1 ? ' 1 player' : `${user.users.length} players`} in lobby <br>`
        // })

        // socket.on('recieve message', async message => {
        //     setMessages(messages => [...messages, message])
        //     document.getElementById(`messageBox`).scrollTop = document.getElementById(`messageBox`).scrollHeight
        //     document.getElementById(`messagesInput`).value = ''
        //     console.log(messages)
        // })

        
        // socket.on('starting game', (startObj) => {
        //     if (!startObj.start) {
        //         setMessages(messages => [...messages, {
        //             time: 'n/a',
        //             username: 'Server',
        //             message: `Game starting in ${startObj.count}...`
        //         }])
        //         document.getElementById(`messageBox`).scrollTop = document.getElementById(`messageBox`).scrollHeight
        //     }
        //     if (startObj.start) {
        //         socket.playerList = playerList
        //         setPageDirect('GamePage')
        //     }
        // })
        

    }, [])

    const playerListRefresh = async () => {
        socket.emit('client_request_playerList_refresh', gameName)
    }

    const handleClick = event => {
        // if (event.target.name === "ready-button") {
        //     socket.emit('ready', isReady);
        // }
        setIsReady(!isReady)
        let templist = {...playerList}
        templist[username].ready = !isReady //.ready = !oldList[username].ready
        setPlayerList(templist)
    }

    return (
        <div className="container w-50 p-3 border rounded container mt-5">
            <div className="d-flex justify-content-between">
                <h4 className="mb-5" style={{textAlign: "center"}}>Welcome to {gameName}</h4>
                <div>
                    <button className="btn-danger rounded mr-2" onClick={leaveGame}>Leave Game</button>
                    <button className="btn-danger rounded" onClick={logout}>Logout</button>
                </div>
            </div>
            {/* {socket.gameName}</h4> */}
            <div className="d-flex justify-content-between mb-2">
                <h3><small>Players currently in the lobby...</small></h3>
                <button className="btn btn-primary" onClick={playerListRefresh}>⟳</button>
            </div>
                <ul className="list-group mb-1" style={{transition: "1s"}}>
                    {/* Player List */}
                    {Object.keys(playerList).map(name => <li key={name} className="list-group-item d-flex justify-content-between align-items-center" style={{backgroundColor: playerList[name].ready && 'yellow'}} >{name}</li>)}
                </ul>
                
                {/* Ready Button */}
                <button className={isReady ? "ready mb-5 btn btn-warning" : "not-ready mb-5 btn btn-success"} name="ready-button" onClick={handleClick}>{isReady ? "unready" : "ready up"}</button>

                {/* Start */}
                <button className="mb-5 btn btn-success ml-5" onClick={() => history.push('./gamepage')}>Start!</button>
                
                {/* Message Box */}
                <MessageBox username={username}/>
        </div>
    )
}

export default Lobby