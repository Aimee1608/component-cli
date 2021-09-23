import axios from "axios";
const instance = axios.create({
    timeout: 10000,
    withCredentials: true,
    headers: {
			'content-type': 'application/json'
    }
})

instance.interceptors.request.use(config=>{
    return config
}, error => {
    return Promise.reject(error)
})

instance.interceptors.response.use(response=>{
    return response.data
}, error => {
    return Promise.reject(error)
})

export default instance
