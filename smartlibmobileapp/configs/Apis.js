import axios from "axios"

export const endpoints = {
    'categories': '/categories/',
    'documents': '/documents/',
    'register': '/users/', 
    'login': 'o/application/', 
    'current-user': '/users/current-user/', 
    

};

export const authApis = (token) => {
    return axios.create({
        baseURL: 'http://192.168.1.7:8000/', 
        headers: { 
            Authorization: `Bearer ${token}`
        }
    });
};


export default axios.create({
    baseURL: 'http://192.168.1.7:8000/', 
})
