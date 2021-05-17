import http from '../Services/httpService'
import { apiUrl } from "../config.json"
import jwtDecode from 'jwt-decode'
import disconnect from './Socket/disconnect'
import { connectSocket } from './Socket/socket'

const apiEndPoint = apiUrl + "/auth"

export const getJwt = () => localStorage.getItem('token')

export async function login(username, password) {
  const { data: jwt } = await http.post(apiEndPoint, {username, password})
  localStorage.setItem('token', jwt)
  http.setJwt(getJwt());
  connectSocket()
}

export const logout = () => {
  disconnect()
  localStorage.removeItem("token")
  window.location = "/"
  http.removeJwt()
  console.log('this place')
}

export const getCurrentUser = () => {
  try {
    const jwt = localStorage.getItem('token')
    return jwtDecode(jwt)
  } catch (error) {
    return null
  }
}