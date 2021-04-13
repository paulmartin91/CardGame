import React, { useState, useEffect} from 'react';
import Joi from 'joi-browser'

import CreateNewGame from '../Components/GameSearch/CreateNewGame'
import ListOfGames from '../Components/GameSearch/ListOfGames'
import { getGameList } from '../Services/getGameListService'
import { createGame } from '../Services/createGameSerice'
import { logout, getCurrentUser } from '../Services/authservice'
import { joinGame } from '../Services/joinGameService'

import socket from '../Services/Socket/socket'

// const DEVgameList = [
//     {
//         'maxPlayers': 5,
//         'currentPlayers': 3,
//         "password": false,
//         'name': 'a',
//         'key': 1
//     },
//     {
//         'maxPlayers': 5,
//         'currentPlayers': 1,
//         "password": true,
//         'name': 'b game',
//         'key': 2
//     },
//     {
//         'maxPlayers': 5,
//         'currentPlayers': 2,
//         "password": false,
//         'name': 'c game',
//         'key': 3
//     },
//     {
//         'maxPlayers': 5,
//         'currentPlayers': 1,
//         "password": false,
//         'name': 'd game',
//         'key': 4
//     },
//     {
//         'maxPlayers': 5,
//         'currentPlayers': 4,
//         "password": false,
//         'name': 'e game',
//         'key': 5
//     },
//     {
//         'maxPlayers': 5,
//         'currentPlayers': 1,
//         "password": true,
//         'name': 'g game',
//         'key': 6
//     },
//     {
//         'maxPlayers': 5,
//         'currentPlayers': 5,
//         "password": false,
//         'name': 'a game',
//         'key': 7
//     },
//     {
//         'maxPlayers': 5,
//         'currentPlayers': 5,
//         "password": false,
//         'name': 'd game',
//         'key': 8
//     },
//     {
//         'maxPlayers': 5,
//         'currentPlayers': 5,
//         "password": false,
//         'name': 'f game',
//         'key': 9
//     },
//     {
//         'maxPlayers': 5,
//         'currentPlayers': 2,
//         "password": true,
//         'name': 'u game',
//         'key': 10
//     },
//     {
//         'maxPlayers': 5,
//         'currentPlayers': 3,
//         "password": false,
//         'name': 'c game',
//         'key': 11
//     },
//     {
//         'maxPlayers': 5,
//         'currentPlayers': 2,
//         "password": false,
//         'name': 'pauls game',
//         'key': 12
//     }
    
// ]

const GameSearch = ({history, username, gameName, setGameName}) => {

    //States
    const [createGameData, setCreateGameData] = useState({maxPlayers: 2});
    const [errors, setErrors] = useState({}) 
    const [gameList, setGameList] = useState([]);
    const [user, setUser] = useState({})

    useEffect(() => {

        //connect to web socket
        socket.connect();
        //refresh game list
        gameRefresh()
        //get username from JWT
        setUser(getCurrentUser() || {})

        // (async () => {
        //     const tempGameList = await getGameList()
        //     setGameList(tempGameList)
        // })()

        // //Load games
        // socket.emit('request refresh games')

        // socket.on('response refresh games', response => {
        //     setGameList(response)
        //     console.log(response)
        // })

        // socket.on('response create new game', response => {
        //     if (response.exists) {
        //         console.log(`response = ${response}`, 'exists')
        //     } else {
        //         console.log(response)
        //         socket.gameName = response.name
        //         socket.playerList = response.playerList
        //         setPageDirect('Lobby')
        //     }
        // })

        // //Join game response
        // socket.on('join game response', response => {
        //     console.log(response)
        //     socket.gameName = response.name
        //     socket.playerList = response.playerList
        //     setPageDirect('Lobby')
        // })

    }, [])

    //schema for create game validation
    const createGameSchema = {
        name: Joi.string().required(),
        password: Joi.string().optional(),
        maxPlayers: Joi.number().required()
    }

    //create game validation
    const validate = () => {
        const { error } = Joi.validate(createGameData, createGameSchema)
        if (!error) return null
        const tempErrors = {}
        error.details.forEach(item => tempErrors[item.path[0]] = item.message)
        return tempErrors
    }

    //refresh game list
    const gameRefresh = async () => {
        const tempGameList = await getGameList()
        setGameList(tempGameList)
    }

    const handleSubmit = async (event, name) => {
        event.preventDefault();
        //save pw or mark as false
        const password = event.target.password ? event.target.password.value : false
        // if joined game...
        if (name) {
            //check with server
            const joinedGame = await joinGame(name, password, user.username)
            //if server permits
            if (joinedGame) {//history.push("/gameLobby")
                //send request to join game with name
                socket.emit('client request join game', {name, user})
            }
            else console.log("Something went wrong!")
        //if creating a game...
        } else {
            //validate credentials
            const err = validate()
            //catch client side validation errors
            if (err) {
                console.error(err)
                setErrors(err)
                return
            }
            try {
                //if all is well, create a new game
                const newGame = await createGame(createGameData, user.username)
                //join game
                //socket.emit('client request join game', {name, user})
            } catch (ex) {
                if (ex.response && ex.response.status === 400) {
                    const tempErrors = {...errors}
                    tempErrors.name = ex.response.data
                    setErrors(tempErrors)
                }
            }
        }
    }

    return(
        <div className="p-3 container mt-5" style={{backgroundColor: "white"}}>
            <div className="d-flex justify-content-between">
                <h1>{user.username && `${user.username}'s game search page`}</h1>
                <div>
                    <button className="btn-danger rounded" onClick={logout}>Logout</button>
                </div>
            </div>
            <div className="row">
                <CreateNewGame 
                    handleSubmit = {handleSubmit}
                    createGameData = {createGameData}
                    setCreateGameData = {setCreateGameData}
                    errors = {errors}
                    setErrors = {setErrors}
                />
                <ListOfGames 
                    gameList = {gameList}
                    handleSubmit = {handleSubmit}
                    gameRefresh = {gameRefresh}
                />
            </div>
        </div>
    )
}

export default GameSearch