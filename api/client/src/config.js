import axios from "axios"

export const axiosInstance = axios.create({
    baseURL : process.env.NODE_ENV === "development"
      ? "http://localhost:8800/api"
      : "https://paether-wishlistapp.herokuapp.com/api"
})