import client from "./client"

export async function getCotisations(page = 1) {
    const response = await client.get(`/cotisations?page=${page}`)
    return response.data
}

export async function getCotisation(id) {
    const response = await client.get(`/cotisations/${id}`)
    return response.data
}

export async function createCotisation(data) {
    const response = await client.post("/cotisations", data)
    return response.data
}

export async function updateCotisation(id, data) {
    const response = await client.put(`/cotisations/${id}`, data)
    return response.data
}

export async function deleteCotisation(id) {
    const response = await client.delete(`/cotisations/${id}`)
    return response.data
}
