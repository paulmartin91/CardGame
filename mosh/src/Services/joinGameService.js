
import http from '../Services/httpService'
import { apiUrl } from "../config.json"

const apiEndPoint = apiUrl + "/gameList/join"

export function joinGame(name, password, user) {
  return http.post(apiEndPoint, {name, password, user})
}
