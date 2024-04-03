import axios from "axios";

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000' ,
  withCredentials: true,
})

axiosClient.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
})

export {axiosClient}
