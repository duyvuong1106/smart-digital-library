import axios from "axios"

export const endpoints = {
    'categories': '/categories/',
    'documents': '/documents/',
    'document-detail': (docId) => `/documents/${docId}/`,
    'document-reviews': (docId) => `/documents/${docId}/reviews/`,
    'add-review': (docId) => `/documents/${docId}/add_review/`,
    'borrow-document': (docId) => `/documents/${docId}/borrow/`,
    'compare': '/documents/compare/',
    'register': '/users/', 
    'login': '/o/token/', 
    'current-user': '/users/current-user/', 
    'history': '/users/history/',
    'payments': '/payments/',
    'statistics': '/statistics/stats/',
};

export const OAUTH2_CLIENT = {
    client_id: "9q2ApGFsFHBaGucEFVUT5PU61WvCKzbIcwDBe92I",
    client_secret: "p8BDS8cumv5lMN2n2gAUTz7nXqWipJgCdoleOwdP6C9xDja7WlI7CXlMO0PZqKHjFRmYIR1muTJAlA1YiGntiKPM9pWaeQhLCWk13JZaJ7sxW8nEPdYPSYX1GbPn1hZY",
    grant_type: "password"
};

export const authApis = (token) => {
    return axios.create({                                                       
        baseURL: 'http://192.168.1.6:8000/', 
        headers: { 
            Authorization: `Bearer ${token}`
        }
    });
};


export default axios.create({
    baseURL: 'http://192.168.1.6:8000/', 
})
