const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3001

const app = express();
const server = http.createServer(app);
const io = socketio(server);


//mongoose init
//process.env.MONGO_URI = PUT MONGO URI HERE;
process.env.MONGO_URI = 'mongodb://localhost:27017'

mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client)=>{
    if (err){console.log(err)} else {console.log('mongo db connected')}
    return;
  });

//mongodb schemas
//user schema
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    loggedIn: Boolean
});

var Users = mongoose.model("users", userSchema);

//Log out all users on app start
Users.updateMany({}, {$set: {loggedIn: false}}, {returnNewDocument:true}).then(res => console.log(`logged out all users`))

//info on server that depreciates on server reset
var gameList = {
    paul: {
        maxPlayers: 6,
        password: "false",//request.password == '' ? false : request.password,
        currentPlayers: 1,
        name: "Paul",//request.name,
        playerList: ["paul"]//[socket.username]
    },
    paul2: {
        maxPlayers: 6,
        password: false,//request.password == '' ? false : request.password,
        currentPlayers: 1,
        name: "Paul",//request.name,
        playerList: ["paul"]//[socket.username]
    }
};

//Get the time
const getTime = () => {
    let unix_timestamp = Math.round((new Date()).getTime() / 1000);
    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2)// + ':' + seconds.substr(-2);
    return formattedTime
}

//Create a safe gamelist to send
const CreateExternalGameList = () => {
    let externalGameList = {}
    Object.keys(gameList).forEach( x=> {
        externalGameList[x] = {
            maxPlayers: gameList[x].maxPlayers,
            currentPlayers: gameList[x].currentPlayers,
            password: gameList[x].password == false ? false : '******',
            name: gameList[x].name,
            playerList: gameList[x].playerList,
        }
    })
    return externalGameList;
}

//import card object
var cards = require('./cards.js');

//import deck object, deal and shuffle functions
let deck = cards.Deck //deck of cards in order
let shuffle = cards.Shuffle //function to shuffle deck
let deal = cards.Deal //function to deal


//Socket Conection Start
io.on('connection', socket => {
    
    //Confirm Connection
    console.log(`we have a new connection!`)

    
    //LOGIN PAGE

    //request to log in
    socket.on('login attempt',  user => {
        Users.findOne({username: user.username}, (err, instance) => {
            if (err) console.log(err)
            //doesn't exist
            if (instance === null) {
                console.log('here')
                socket.emit('log in attempt response', {
                    exists: false,
                    password: null,
                    alreadyLoggedIn: null
                })
            } else {
                //all valid
                if (instance.password == user.password && !instance.loggedIn) {
                    //set db loggedin to true
                    Users.findOneAndUpdate({"username" : user.username}, {$set: {loggedIn: true}}, {returnNewDocument:true}).then(res => console.log(res))
                    socket.isLoggedIn = true //Can I get rid of this?
                    socket.username = user.username
                    socket.emit('log in attempt response', {
                        success: true,
                        username: socket.username,
                        gameList: gameList
                    })
                } else {
                    socket.emit('log in attempt response', {
                        exists: true,
                        password: instance.password == user.password,
                        alreadyLoggedIn: instance.loggedIn
                    })
                }
            }
        })
    });

    //Create New User Request
    socket.on('new user request', async (user) => {
        //check if username exists
        const checkExistingUser = await Users.find({username: user.username}, async (err, response) => {
            if (err) console.log(err)
            //if it doesn't...
            if (response.length === 0) {
                //check if email exists
                const checkExistingEmail = await Users.find({email: user.email}, async (err, response) => {
                    if (err) console.log(err)
                    //if it doesn't...
                    if (response.length === 0) {
                        //create new user
                        const createNewUser = await Users.create({
                            username: user.username,
                            password: user.password,
                            email: user.email,
                            loggedIn: false
                        }, (err, instance) => {
                            if (err) console.log(err)
                            socket.emit('new user response', {
                                success: true,
                                username: user.username
                            })
                        })
                    } else {
                        socket.emit('new user response', {
                            success: false,
                            reason: 'Email address already exists'
                        })
                    }
                })
            } else {
                socket.emit('new user response', {
                    success: false,
                    reason: 'Username already exists'
                })
            }
        })
    })


    //GAMESEARCH PAGE

    //Refresh Game List
    socket.on('request refresh games', async ()=>{
        socket.emit('response refresh games', CreateExternalGameList())
    })

    //Create a Game
    socket.on('request create new game', request => {
        //Name Taken
        if (request.name in gameList) {
            socket.emit('response create new game', {
                exists: true,
                name: request.name
            })
            //Create New Game
        } else {
            gameList[request.name] = {
                maxPlayers: 6,
                password: request.password == '' ? false : request.password,
                currentPlayers: 1,
                name: request.name,
                playerList: {
                    [socket.username]: false
                }
            }

            socket.gameName = request.name
            socket.join(request.name);

            io.sockets.adapter.rooms[request.name].players = {[socket.username]: false}
            io.sockets.adapter.rooms[request.name].playersIds = {[socket.username]: socket.id}
            io.sockets.adapter.rooms[request.name].deckInPlay = shuffle(Array.from(cards.Deck))
            io.sockets.adapter.rooms[request.name].readyPlayers = 0
            io.sockets.adapter.rooms[request.name].chat = []

            socket.emit('response create new game', {
                exists: false,
                name: request.name,
                playerList: io.sockets.adapter.rooms[request.name].players
            })

            // setTimeout(()=>{
            //     io.to(request.name).emit('new user joined game', {
            //         username: socket.username,
            //         users: io.sockets.adapter.rooms[request.name].players,
            //     });
            // }, 200)

        }
    })

    //Join a Game
    socket.on('join game request', async request => {
        console.log(request)
        if (!request.name in gameList) {
            console.log('game doesnt exist')
        } else if (gameList[request.name].currentPlayers >= gameList[request.name].maxPlayers) {
            console.log('game is full')
        } else {
            if (gameList[request.name].password) {
                if (request.password == gameList[request.name].password) {
                    //join successful
                    socket.gameName = request.name
                     gameList[request.name].playerList[socket.username] = false
                    await socket.join(request.name);
                    io.sockets.adapter.rooms[request.name].players[socket.username] = false
                    io.sockets.adapter.rooms[request.name].playersIds[socket.username] = socket.id
                    setTimeout(()=> {
                        io.to(request.name).emit('new user joined game', {
                            username: socket.username,
                            playerList: io.sockets.adapter.rooms[request.name].players,
                        });
                    }, 200)
                    socket.emit('join game response', {
                        success: true,
                        name: request.name
                    })
                } else {
                    console.log('password incorrect')
                    console.log(request.password)
                }
            } else {
            console.log('game has no password')
                //join successful
                socket.gameName = request.name
                gameList[request.name].playerList[socket.username] = false
                await socket.join(request.name);
                io.sockets.adapter.rooms[request.name].players[socket.username] = false
                io.sockets.adapter.rooms[request.name].playersIds[socket.username] = socket.id
                setTimeout(()=> {
                    console.log(`players = ${io.sockets.adapter.rooms[request.name].players}`)
                    console.log(`playerList = ${gameList[request.name].playerList}`)
                    io.to(request.name).emit('new user joined game', {
                        username: socket.username,
                        playerList: io.sockets.adapter.rooms[request.name].players,
                        time: getTime()
                    });
                }, 200)
                socket.emit('join game response', {
                    success: true,
                    name: request.name,
                    playerList: io.sockets.adapter.rooms[request.name].players
                })
            }
        }
    })


    //LOBBY

    //handle ready requests from lobby
    socket.on('ready', async isReady => {
        console.log(!isReady)
        //toggle user ready
        io.sockets.adapter.rooms[socket.gameName].players[socket.username] = !isReady
        //add or subtract from readyplayers
        !isReady ? io.sockets.adapter.rooms[socket.gameName].readyPlayers++ : io.sockets.adapter.rooms[socket.gameName].readyPlayers--
        //add or remove from 'ready' room
        // userList[username].ready == true ? socket.join('ready') : socket.leave('ready')
        // console.log(`${username} ready = ${users[username].ready}`)

        console.log(socket.username)
        console.log(socket.gameName)

        socket.to(socket.gameName).emit('other player ready status changed', {
            username: socket.username,
            ready: !isReady,
        });

        socket.emit('player ready status changed', !isReady)

        console.log(`number of ready players = ${io.sockets.adapter.rooms[socket.gameName].readyPlayers}`)
        console.log(`number of players = ${io.sockets.adapter.rooms[socket.gameName].length}`)

        //if all players are ready and there is more than one player
        if (io.sockets.adapter.rooms[socket.gameName].readyPlayers == io.sockets.adapter.rooms[socket.gameName].length){// to test with one user --> && Object.keys(users).length > 1) {
            console.log('starting game')
            let countDown = 5 //<-- 1 for dev stage, 5 in production
            const count = setInterval( () => {
                console.log(io.sockets.adapter.rooms[socket.gameName].players)
                //if a player unreadys, stop the countdown
                if (io.sockets.adapter.rooms[socket.gameName].length !== io.sockets.adapter.rooms[socket.gameName].readyPlayers) {
                    clearInterval(count)
                } else {
                    io.to(socket.gameName).emit('starting game', {
                        count: countDown,
                        start: countDown == 0,
                        users: io.sockets.adapter.rooms[socket.gameName].players,
                        chat: io.sockets.adapter.rooms[socket.gameName].chat
                    })
                }
                countDown--
                if (countDown < 0) clearInterval(count)
            }, 1000)
        }
    })

    //Messages
    socket.on('send message', async message => {

        await io.sockets.adapter.rooms[socket.gameName].chat.push({
            message: message.message,
            location: message.location,
            username: message.username,
            time: getTime()
        })

        console.log('here')

        io.emit('recieve message', {
            message: message.message,
            location: message.location,
            username: message.username,
            time: getTime()
        })

    })

    
    socket.on('disconnect', async () => {
        if (socket.isLoggedIn == true){
            Users.findOneAndUpdate({"username" : socket.username}, {$set: {loggedIn: false}}, {returnNewDocument:true}).then(res => console.log(`${socket.username} disconnected`))
        }
    });

})

server.listen(PORT, ()=> console.log(`server has started on port ${PORT}`))