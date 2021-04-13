import http from '../Services/httpService'
import { apiUrl } from "../config.json"
import jwtDecode from 'jwt-decode'

const apiEndPoint = apiUrl + "/auth"

export const getJwt = () => localStorage.getItem('token')

export async function login(username, password) {
  const { data: jwt } = await http.post(apiEndPoint, {username, password})
  localStorage.setItem('token', jwt)
  http.setJwt(getJwt());
}

export const logout = () => {
  localStorage.removeItem("token")
  window.location = "/"
  http.removeJwt()
}

export const getCurrentUser = () => {
  try {
    const jwt = localStorage.getItem('token')
    return jwtDecode(jwt)
  } catch (error) {
    return null
  }
}