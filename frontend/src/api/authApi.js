import http from './axiosClient'

export const registerApi = (data) => http.post('/auth/register', data)
export const loginApi = (data) => http.post('/auth/login', data)
export const getMeApi = () => http.get('/auth/me')
