import axios from "axios"

export const axiosInstance = axios.create({
    baseURL : "https://paether-wishlistapp.herokuapp.com/api/"
})