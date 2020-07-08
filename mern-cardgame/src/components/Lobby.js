import React, { useState, useEffect} from 'react';


const Lobby = ({socket}) => {

    //States
    const [playerList, setPlayerList] = useState(socket.playerList)
    const [isReady, setIsReady] = useState(false)

    useEffect(()=>{

        socket.on('other player ready status changed', ready => {
            console.log(ready.ready)
            ready.ready ? document.getElementById(ready.username).style = "background-color: #B7E2C0; transition: 0.5s" : document.getElementById(ready.username).style = "background-color:; transition: 0.5s"
        })

        socket.on('player ready status changed', {})

        socket.on('new user joined game', response => {
            console.log(response)
            setPlayerList(response.playerList)
            // document.getElementById("lobbymessages").innerHTML += `${user.username} has joined the lobby, currently ${user.users.length == 1 ? ' 1 player' : `${user.users.length} players`} in lobby <br>`
        })

    })

    const handleClick = (event) => {
        console.log(playerList)
        if (event.target.name === "ready-button") {
            socket.emit('ready', isReady);
            setIsReady(!isReady)
        }
    }

    return (
        <div class="lobbyBody p-3 border rounded container mt-5">
            <h4 class="mb-5" style={{textAlign: "center"}}>Welcome to {socket.gameName}</h4>
            <h3><small>Players currently in the lobby...</small></h3>
                <ul class="list-group mb-1" style={{transition: "1s"}}>
                    {/* Player List */}
                    {playerList.map(x=> <li class="list-group-item d-flex justify-content-between align-items-center" id={x}>{x}</li>)}
                </ul>
                {/* Ready Button */}
                <button class="mb-5 btn btn-success" name="ready-button" onClick={handleClick}>ready up</button>
                <div class="mt-5">
                    <div class="border">
                        <div id="lobbymessageBox" style={{cursor: "default", height: 150, overflow: "scroll"}}>
                            <p id="lobbymessages" style={{wordBreak: "break-all"}}></p>
                        </div>
                        <form onsubmit="typeMessage(this, 'lobby');return false">
                            <div class="input-group">
                                <input type="text" style={{borderRadius: 0}} name="message" class="border form-control" placeholder="Type message..." id="lobbymessagesInput" />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="submit" style={{borderRadius: 0}}>Send Message</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
    )
}

export default Lobby

// import React, { useState, useEffect } from 'react';
// import queryString from 'query-string';
// import io from 'socket.io-client';
// import { findSourceMap } from 'module';
// import {Link} from 'react-router-dom';

// let socket;

// const Lobby = ({ location }) => {
//     const [name, setName] = useState('');
//     const [password, setPassword] = useState('');
//     const ENDPOINT = 'localhost:3001'

//     useEffect(() => {
//         const { name, password } = queryString.parse(location.search)

//         socket = io(ENDPOINT)

//         setName(name)
//         setPassword(password)
//     }, [ENDPOINT, location.search])

//     let callServer = () => {
//         console.log(name, password)
//         socket.emit('find', ({name, password}))
//     }

//     return(
//         <div>
//             <button onClick={callServer}>Call Server</button>
//             <Link onClick={event => !name && event.preventDefault()} to={`./gamesearch`}>
//                 <button type="submit">TEST</button>
//             </Link>
//         </div>    
//     )   
// }

// export default Lobby