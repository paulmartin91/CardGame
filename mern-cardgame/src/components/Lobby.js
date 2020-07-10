import React, { useState, useEffect} from 'react';


const Lobby = ({socket, ENDPOINT}) => {

    //States
    const [playerList, setPlayerList] = useState(socket.playerList)
    const [isReady, setIsReady] = useState(false)
    const [messages, setMessages] = useState([])
    
    useEffect(()=>{

        socket.on('other player ready status changed', ready => {
            console.log(ready.ready)
            ready.ready ? document.getElementById(ready.username).style = "background-color: #B7E2C0; transition: 0.5s" : document.getElementById(ready.username).style = "background-color:; transition: 0.5s"
        })

        socket.on('player ready status changed', isReady => {
            setIsReady(isReady)
            isReady ? document.getElementById(socket.username).style = "background-color: #B7E2C0; transition: 0.5s" : document.getElementById(socket.username).style = "background-color:; transition: 0.5s"
        })
  
        socket.on('new user joined game', response => {
            setMessages(messages => [...messages, {
                time: response.time,
                username: 'Server',
                message: `${response.username} has joined the lobby, currently ${Object.keys(playerList).length == 1 ? ' 1 player' : `${Object.keys(playerList).length} players`} in the lobby`
            }])
            document.getElementById(`messageBox`).scrollTop = document.getElementById(`messageBox`).scrollHeight
            setPlayerList(response.playerList)
            // document.getElementById("lobbymessages").innerHTML += `${user.username} has joined the lobby, currently ${user.users.length == 1 ? ' 1 player' : `${user.users.length} players`} in lobby <br>`
        })

        socket.on('recieve message', async message => {
            setMessages(messages => [...messages, message])
            document.getElementById(`messageBox`).scrollTop = document.getElementById(`messageBox`).scrollHeight
            document.getElementById(`messagesInput`).value = ''
            console.log(messages)
        })

        /*
        socket.on('starting game', (startObj) => {
            if (!startObj.start) document.getElementById("lobbymessages").innerHTML += `Game starting in ${startObj.count}...<br>`
            document.getElementById("lobbymessageBox").scrollTop = document.getElementById("lobbymessageBox").scrollHeight
            if (startObj.start) {
                document.getElementById("lobbyPage").style.display = 'none'
                document.getElementById("gamePage").style.display = ''
        
                //fill messages
                startObj.chat.forEach((x, y)=>{
                    console.log(`y = ${y} and len = ${startObj.chat.length}`)
                    document.getElementById(`gamemessages`).innerHTML += `<span class="text-muted small">[${x.time}]</span> ${x.username}: ${x.message}<br>`
                    if (y == startObj.chat.length-1) {
                        document.getElementById(`gamemessageBox`).scrollTop = document.getElementById(`gamemessageBox`).scrollHeight
                    }
                })
        
                console.log(`startObj = ${startObj}`)
        
                startObj.users.forEach(x=>{
                    console.log(startObj.users)
                    console.log(x)
                    if (x !== socket.username) {
                        document.getElementById('otherPlayers').innerHTML += `
                        <div id="${x}blindcards" class="player" style="display: flex; justify-content: flex-end; color: black; border: dashed 1px; height: 150px; max-width: 700px;"></div>`    
                    }
                    //deal form controles
                    document.getElementById('dealSelect').innerHTML += `
                    <li>
                        <input type="submit" onclick="setDealOption(this)" class="form-control btn" name="submit" value="${x}" style="width: 100%">
                    </li>`
                })
            }
        })
        */

    }, [ENDPOINT])

    const handleSubmit = event => {

        if (event.target.message.value.length > 0) {
            socket.emit(`send message`, {
                message: event.target.message.value,
                username: socket.username,
                location: 'Lobby',
            })
        }

        event.preventDefault();
    }

    const handleClick = (event) => {
        if (event.target.name === "ready-button") {
            socket.emit('ready', isReady);
        }
    }

    return (
        <div class="lobbyBody p-3 border rounded container mt-5">
            <h4 class="mb-5" style={{textAlign: "center"}}>Welcome to {socket.gameName}</h4>
            <h3><small>Players currently in the lobby...</small></h3>
                <ul class="list-group mb-1" style={{transition: "1s"}}>
                    {/* Player List */}
                    {Object.keys(playerList).map(x=> <li class="list-group-item d-flex justify-content-between align-items-center" id={x}>{x}</li>)}
                </ul>
                {/* Ready Button */}
                <button class={isReady ? "ready mb-5 btn btn-warning" : "not-ready mb-5 btn btn-success"} name="ready-button" onClick={handleClick}>{isReady ? "unready" : "ready up"}</button>
                <div class="mt-5">
                    <div class="border">
                        <div id="messageBox" style={{cursor: "default", height: 150, overflow: "scroll"}}>
                            <p id="messages" style={{wordBreak: "break-all"}}>
                                { messages.map( x => <p1><span class="text-muted small">[{x.time}]</span>{x.username}: {x.message}<br /></p1>) }
                            </p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div class="input-group">
                                <input type="text" style={{borderRadius: 0}} name="message" class="border form-control" placeholder="Type message..." id="messagesInput" />
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