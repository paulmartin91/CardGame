import React, { useState, useEffect} from 'react';

const GameSearch = ({socket, ENDPOINT, setPageDirect}) => {

    //States
    const [createGameName, setCreateGameName] = useState('');
    const [createGamePassword, setCreateGamePassword] = useState('');
    const [joinGamePassword, setJoinGamePassword] = useState('');
    const [gameList, setGameList] = useState([]);

    useEffect(() => {        

        //Load games
        socket.emit('request refresh games')

        socket.on('response refresh games', response => {
            setGameList(response)
            console.log(response)
        })

        socket.on('response create new game', response => {
            if (response.exists) {
                console.log(`response = ${response}`, 'exists')
            } else {
                console.log(response)
                socket.gameName = response.name
                socket.playerList = response.playerList
                setPageDirect('Lobby')
            }
        })

        //Join game response
        socket.on('join game response', response => {
            console.log(response)
            socket.gameName = response.name
            socket.playerList = response.playerList
            setPageDirect('Lobby')
        })

    }, [ENDPOINT])


    const handleSubmit = event => {

        //Create a game
        if (event.target.name === 'create-game') {
            socket.emit('request create new game', {
                name: createGameName,
                password: createGamePassword
            })
        } else {

        //Join a game 
            socket.emit('join game request', {
                name: event.target.name,
                password: event.target.childNodes.length === 1 ? false: event.target.password.value
            })
        }
        
        event.preventDefault();
    }

    return(
        <div className="p-3 border rounded container mt-5" style={{backgroundColor: "white", maxWidth: 1000}}>
            <div className="row">
                <div className="p-2 col-sm-4 card m-2" id="createGame">
                    <form onSubmit={handleSubmit} name="create-game" autoComplete="off">
                        <input autoComplete="false" type="text" style={{borderRadius: 0}} className="border form-control mt-2" placeholder="Name your game" onChange={event => setCreateGameName(event.target.value)} />
                        <input autoComplete="new-password" type="password" style={{borderRadius: 0}} className="border form-control mt-2" placeholder="Password 6-12" pattern=".{6,12}" onChange={event => setCreateGamePassword(event.target.value)} /> 
                        <small className="form-text text-muted">*password only required for private games</small>
                        <button type="submit" className="btn btn-primary mb-2 mt-2">Create Game</button>
                    </form>
                </div>
                <div className="col card m-2">
                    <button className="btn" style={{fontSize: "1.5em", width: 20, height: 20, left: -10, top: -12, position: "absolute", zIndex: 2}} onClick={() => socket.emit('request refresh games')}>⟳</button>
                    <ul id="activeGames" className="list-group mt-3 list-group-flush">
                        {Object.keys(gameList).map(game => 
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                <span> 
                                    {game}
                                    <span className="ml-3 badge badge-primary badge-pill">{gameList[game].currentPlayers}/{gameList[game].maxPlayers}</span>
                                </span> 
                                {!gameList[game].password ? 
                                    <form className="input-group" name={game} onSubmit={handleSubmit}>
                                        <button className="btn btn-primary" type="submit">Join</button>
                                    </form>
                                :
                                    <form className="input-group" name={game} onSubmit={handleSubmit}>
                                        <input name="password" type="password" className="form-control" placeholder="Password 6-12" pattern=".{6,12}" required />
                                        <div className="input-group-append">
                                            <button className="btn btn-primary" type="submit">Join</button>
                                        </div>
                                    </form>
                                }
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default GameSearch