const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(8000, function () {
    console.log('Your app is listening on port ' + server.address().port);
  });

app.use(express.static('public'))

//import card object
var cards = require('./cards.js');

//import deck object, deal and shuffle functions
let deck = cards.Deck //deck of cards in order
let shuffle = cards.Shuffle //function to shuffle deck
let deal = cards.Deal //function to deal

//websocket
var socket = require('socket.io')

var users = {};

//randomised deck of cards
let deckInPlay = shuffle(deck)

//on connection
io.sockets.on('connection', (socket) => {
    //log user connected on server
    console.log("a user connected")

    //test
    socket.on('gameroom', room => {
        console.log(room)
        socket.join(room)
        setTimeout(()=>console.log(io.sockets.adapter.rooms), 2000)
    })

    //add a user
    socket.on('add user',  (username) => {
        socket.username = username;
        users[username] = {
            "name": username,
            "ready": false
        }
        //console.log(`${socket.username} `)
        socket.joined = true
        socket.emit('user joined', {
            username: socket.username,
            users: users,
        });
    });

    //handle ready requests from lobby
    socket.on('ready', async (username) => {
        users[username].ready = await !users[username].ready
        users[username].ready == true ? socket.join('ready') : socket.leave('ready')
        // console.log(`${username} ready = ${users[username].ready}`)
        setTimeout(()=>io.to('ready').emit(`joined`, username), 1000);
        socket.emit('ready status changed', users[username].ready)
        //io.sockets.adapter.rooms['ready'].length <--- get number of people in ready
    })


    //test getting random card
    socket.on('deal cards', (msg) => {
        console.log(`request to deal from ${socket.username}`)
        socket.hand = deal(deckInPlay, 5)
        socket.emit('hand delt', {
            hand: socket.hand,
            cardsLeft: deckInPlay.length
        });
    });

    socket.on('disconnect', () => {
        console.log(`${socket.username} disconnected`);
      });
})