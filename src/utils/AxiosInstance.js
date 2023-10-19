import axios from "axios";

const AxiosInstance = ( ) => {
    return axios.create({
        withCredentials: true,
        // baseURL: "https://kashlog-backend.onrender.com"
    })
}

export default AxiosInstance;