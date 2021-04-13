//dependencies
const mongoose = require('mongoose')
const express = require('express')
//const config = require('config')
const config = require("dotenv").config();
const cors = require('cors')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3001",
  },
})

//local files
const users = require('./routes/users')
const auth = require('./routes/auth')
const gameList = require('./routes/gameList')
const connect = require('./socket/socket')(io)
//const getGameList = require('./routes/getGameList')

//express app
const port = 3000

//allow requests from front end
app.use(cors({origin: 'http://localhost:3001'}))

//Need this to parse req body
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

if (!process.env.JWTPRIVATEKEY) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined.')
  process.exit(1);
}

//for websocket connections < -- NOT WORKING!
// const server = http.createServer(app);
// const io = socketio(server);
// server.listen()

//connect to mongodb locally
mongoose.connect('mongodb://localhost/cardGame')
  .then(() => console.log('connected to MongoDB...'))
  .catch(err => console.error('could not connect to MongoDB', err))

//route by request
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/gameList', gameList)

// app.use('')

//run express server
http.listen(port, () => {
  console.log(`Cardgame app listening at http://localhost:${port}`)
})

module.exports.io = io