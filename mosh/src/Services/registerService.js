import http from '../Services/httpService'
import { apiUrl } from "../config.json"

const apiEndPoint = apiUrl + "/users"

export function register(username, password, email) {
  return http.post(apiEndPoint, {username, password, email})
}