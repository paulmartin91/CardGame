import axios from "axios";

axios.interceptors.response.use(null, error => {
  const expectedError = 
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500

    if (!expectedError) {
      console.log("Logging the error", error)
      alert("Cannot connect to the server right now")
    }

    return Promise.reject(error)
})

//set JWT for default axios headers
const setJwt = jwt => {
  axios.defaults.headers.common['x-auth-token'] = jwt;
}

//set JWT for default axios headers
const removeJwt = () => axios.defaults.headers.common['x-auth-token'] = null;

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
  removeJwt
}