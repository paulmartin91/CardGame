import React, { useState, useEffect} from 'react';
import Joi from 'joi-browser'

import CreateNewGame from '../Components/GameSearch/CreateNewGame'
import ListOfGames from '../Components/GameSearch/ListOfGames'
import { getGameList } from '../Services/getGameListService'
import { createGame } from '../Services/createGameSerice'
import { logout, getCurrentUser } from '../Services/authservice'
import { joinGame } from '../Services/joinGameService'
import socket, { connectSocket } from '../Services/Socket/socket'

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

const GameSearch = ({history, setPlayerList, username, gameName, setGameName}) => {

    //FOR DEV
    const [createGameData, setCreateGameData] = useState({name: "paulsgame", maxPlayers: 2});
    //const [createGameData, setCreateGameData] = useState({maxPlayers: 2});
    const [errors, setErrors] = useState({}) 
    const [gameList, setGameList] = useState([]);
    const [user, setUser] = useState({})

    useEffect(() => {
        connectSocket()
        //(!socket.connected && socket.connect())
        //refresh game list
        gameRefresh()
        //get username from JWT
        setUser(getCurrentUser() || {})

        //join game error
        socket.on("join error", (err) => console.log(err.message));
        //create game error
        socket.on("create error", (err) => console.log(err.message));
        //join game success
        socket.on("server response join game", (game) => {
            setPlayerList(game.players)
            setGameName(game.name)
            history.push("/gameLobby")
        });
        //create game success
        socket.on("server response create game", (game) => {
            setPlayerList(game.players)
            setGameName(game.name)
            history.push("/gameLobby")
        });

    }, [])

    //schema for create game validation
    const createGameSchema = {
        name: Joi.string().required().label('Name'),
        password: Joi.string().optional(),
        maxPlayers: Joi.number().required().max(6).min(2)
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
            console.log('here')
            socket.emit('client request join game', {name, user, password})
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
                const {name, password, maxPlayers} = createGameData
                socket.emit('client request create game', {name, password, maxPlayers, user})
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
ListOfGames                    createGameData = {createGameData}
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