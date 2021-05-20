const { GameList } = require('../models/gameList')

module.exports = async function deleteGames() {
  await GameList.deleteMany({})
  console.log('all games deleted')
} 