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
    origin: "http://localhost:3001"
  },
})

//local files
const users = require('./routes/users')
const auth = require('./routes/auth')
const gameList = require('./routes/gameList')
const connect = require('./socket/socket')(io)

//server port
const port = 3000

//enable cors from front end
app.use(cors({origin: 'http://localhost:3001'}))

//Middleware for parssing req body
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//App will crash if no JWT private key is provided
if (!process.env.JWTPRIVATEKEY) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined.')
  process.exit(1);
}

//connect to mongodb locally
mongoose.connect('mongodb://localhost/cardGame')
  .then(() => console.log('connected to MongoDB...'))
  .catch(err => console.error('could not connect to MongoDB', err))

//route by request
app.use('/api/users', users) 
app.use('/api/auth', auth)
app.use('/api/gameList', gameList)

//run express server
http.listen(port, () => {
  console.log(`Cardgame app listening at http://localhost:${port}`)
})

module.exports.io = io