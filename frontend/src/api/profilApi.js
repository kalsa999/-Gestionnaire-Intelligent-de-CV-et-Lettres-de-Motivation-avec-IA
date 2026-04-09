import http from './axiosClient'

export const getProfilsApi = () => http.get('/profils')
export const createProfilApi = (data) => http.post('/profils', data)
export const updateProfilApi = (id, data) => http.put(`/profils/${id}`, data)
export const deleteProfilApi = (id) => http.delete(`/profils/${id}`)
