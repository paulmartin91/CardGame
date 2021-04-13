//dependencies
const mongoose = require('mongoose')

//gameList db schema
const gameListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
    unique: true
  },
  players: {
    type: [String],
    // maxLength: this.maxPlayers.max
  },
  maxPlayers: {
    type: Number,
    min: 2,
    max: 6
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024
  }
})

//init schema class
const GameList = mongoose.model('GameList', gameListSchema);

//export funcs
exports.GameList = GameList