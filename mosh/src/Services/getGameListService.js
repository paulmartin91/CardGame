import http from '../Services/httpService'
import { apiUrl } from "../config.json"
import {getJwt} from './authservice'

const apiEndPoint = apiUrl + "/gameList"

//set JWT in case of page redirect to gameSearch
http.setJwt(getJwt())

const getGameList = async () => {
  const result = await http.get(apiEndPoint)
  return result.data
}

export {
  getGameList
}