import axios  from "axios";

const BASE_URL=import.meta.env.VITE_BACKEND_URL

const apiClient=axios.create({
    baseURL:BASE_URL,
    timeout: 100000, // 10 seconds
    headers:{
        'Content-Type':'application/json'
    }
})

const _get=(url,config={})=>{
    return apiClient.get(url,config)
}

const _delete=(url,config = {})=>{
    return apiClient.delete(url,config)
}

const _post=(url,config={})=>{
    return apiClient.post(url,config)
}

const _put=(url,config={})=>{
    return apiClient.put(url,config)
}

export {_get,_post,_put,_delete,apiClient}

