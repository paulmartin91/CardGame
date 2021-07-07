import http from '../Services/httpService'
import { apiUrl } from "../config.json"
import {getJwt} from './authservice'
import axios from 'axios'

const apiEndPoint = apiUrl + "/gameList"

//set JWT in case of page redirect to gameSearch
http.setJwt(getJwt())

const getGameList = async () => {
  console.log('hre')
  const result = await http.get(apiEndPoint, {})
  // const result = await axios.get(apiEndPoint)
  // console.log(result.data)
  // //return result.data
  // return result.data
  return result.data
}

export {
  getGameList
}