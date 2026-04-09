import http from './axiosClient'

export const getLettresApi = () => http.get('/lettres')
export const getLettreApi = (id) => http.get(`/lettres/${id}`)
export const createLettreApi = (data) => http.post('/lettres', data)
export const updateLettreApi = (id, data) => http.put(`/lettres/${id}`, data)
export const deleteLettreApi = (id) => http.delete(`/lettres/${id}`)
export const regenerateLettreApi = (id) => http.post(`/lettres/${id}/regenerate`)
