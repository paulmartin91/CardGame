import http from '../Services/httpService'
import { apiUrl } from "../config.json"

const apiEndPoint = apiUrl + "/gameList/create"

export function createGame({name, password, maxPlayers}, username) {
  //console.log(name, password, maxPlayers)
  return http.post(apiEndPoint, {name, password, maxPlayers, players: [username]})
}