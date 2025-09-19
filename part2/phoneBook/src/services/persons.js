import axios from "axios"

const baseUrl = "/api/persons"

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = (newInfo) => {
    const request = axios.post(baseUrl, newInfo)
    return request.then(response => response.data)
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
}

const update = (changedPerson, id) => {
    const request = axios.put(`${baseUrl}/${id}`, changedPerson)
    return request.then(response => response.data)
}

export default { getAll, create, deletePerson, update }