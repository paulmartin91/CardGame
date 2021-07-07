import React, { useState, useEffect, useRef} from 'react';
import MessageBox from '../Containers/MessageBox';
import { getCurrentUser, logout } from '../Services/authservice';
import socket, {connectSocket} from '../Services/Socket/socket'
import leaveGame from '../Services/Socket/leaveGame'

// const Lobby = ({socket, ENDPOINT, setPageDirect}) => {
const Lobby = ({history, gameName, setGameName, playerList, setPlayerList, messages, setMessages, username, setUsername}) => {
    
    const [startGame, setStartGame] = useState(false)

    useEffect(()=>{
        
        //make sure the socket is connected
        connectSocket()

        setUsername(getCurrentUser().username)

        //if no game, redirect to gameSearch
        !gameName && history.push("/gameSearch")

        //socket.on('server response playerList refresh', (res) => console.log(res));
        socket.on("server_response_playerList_refresh", players => {
            console.log(players)
            //console.log('here')
            setPlayerList(players)
        });

        // socket.on("server_response_leave_current_game", response => {
        //     if (response){
        //         setGameName()
        //         setPlayerList({})
        //         history.push("/gameSearch")
        //     } else console.log('error!')  
        // })

        socket.on('server_request_all_ready', isStart => {
            if (isStart === false) console.log('All players not ready')
            else setStartGame(isStart) 
        })        

        socket.on('server_request_start', () => {
            // socket.removeAllListeners();
            history.push('./gamePage')
        })      

    }, [])

    const playerListRefresh = () => socket.emit('client_request_playerList_refresh', gameName)

    const readyUp = () => socket.emit('client_request_ready')

    const start = () => socket.emit('client_request_start_game')

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
                <button className={playerList[username] && playerList[username].ready ? "mb-5 btn btn-warning" : "mb-5 btn btn-success"} name="ready-button" onClick={readyUp}>{playerList[username] && playerList[username].ready ? "unready" : "ready up"}</button>

                {/* Start */}
                <button className="mb-5 btn btn-success ml-5" onClick={start} disabled={!startGame}>Start!</button>
                
                {/* Message Box */}
                <MessageBox 
                    username={username} 
                    messages={messages}
                    setMessages={setMessages}
                />
        </div>
    )
}

export default Lobby