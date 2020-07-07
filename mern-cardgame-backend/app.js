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
    socket.on('request refresh games', ()=>{
        socket.emit('response refresh games', gameList)
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
                playerList: [socket.username]
            }

            socket.gameName = request.name
            socket.join(request.name);

            io.sockets.adapter.rooms[request.name].players = [socket.username]
            io.sockets.adapter.rooms[request.name].playersIds = {[socket.username]: socket.id}
            io.sockets.adapter.rooms[request.name].deckInPlay = shuffle(Array.from(cards.Deck))
            io.sockets.adapter.rooms[request.name].readyPlayers = 0
            io.sockets.adapter.rooms[request.name].chat = []

            socket.emit('response create new game', {
                exists: false,
                name: request.name
            })

            setTimeout(()=>{
                io.to(request.name).emit('new user joined game', {
                    username: socket.username,
                    users: io.sockets.adapter.rooms[request.name].players,
                });
            }, 200)

        }
    })

    //Join a Game
    //join a game
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
                    await gameList[request.name].playerList.push(socket.username)
                    await socket.join(request.name);
                    await io.sockets.adapter.rooms[request.name].players.push(socket.username)
                    io.sockets.adapter.rooms[request.name].playersIds[socket.username] = socket.id
                    setTimeout(()=> {
                        io.to(request.name).emit('new user joined game', {
                            username: socket.username,
                            users: io.sockets.adapter.rooms[request.name].players,
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
                await gameList[request.name].playerList.push(socket.username)
                await socket.join(request.name);
                await io.sockets.adapter.rooms[request.name].players.push(socket.username)
                io.sockets.adapter.rooms[request.name].playersIds[socket.username] = socket.id
                setTimeout(()=> {
                    console.log(`players = ${io.sockets.adapter.rooms[request.name].players}`)
                    console.log(`playerList = ${gameList[request.name].playerList}`)
                    io.to(request.name).emit('new user joined game', {
                        username: socket.username,
                        users: io.sockets.adapter.rooms[request.name].players,
                    });
                }, 200)
                socket.emit('join game response', {
                    success: true,
                    name: request.name
                })
            }
        }
    })

    
    socket.on('disconnect', async () => {
        if (socket.isLoggedIn == true){
            Users.findOneAndUpdate({"username" : socket.username}, {$set: {loggedIn: false}}, {returnNewDocument:true}).then(res => console.log(`${socket.username} disconnected`))
        }
    });

})

server.listen(PORT, ()=> console.log(`server has started on port ${PORT}`))