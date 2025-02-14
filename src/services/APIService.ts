import axios from "axios";
import _auth from "./AuthService";
import { AuthError, InvalidError, NetworkError } from "../utils/AppError";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
    }
});

instance.interceptors.request.use(config => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
})

instance.interceptors.response.use(response => {
    return response;
}, error => {
    if(!navigator.onLine){
        throw new NetworkError("Network Error")
    }
    else if(error.status && (error.status === 400 || error.data.status === 400)){
        throw new InvalidError("Bad Request")
    }
    else if(error.status && (error.status === 404 || error.data.status === 404)){
        throw new InvalidError("Not Found")
    }
    else{
        _auth.logout();
        throw new AuthError("Unauthorized")
    }
})

export default instance;