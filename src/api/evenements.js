import client from "./client"

export async function getEvenements(page = 1) {
    const response = await client.get(`/evenements?page=${page}`)
    return response.data
}

export async function getEvenement(id) {
    const response = await client.get(`/evenements/${id}`)
    return response.data
}

export async function createEvenement(data) {
    const response = await client.post("/evenements", data)
    return response.data
}

export async function updateEvenement(id, data) {
    const response = await client.put(`/evenements/${id}`, data)
    return response.data
}

export async function deleteEvenement(id) {
    const response = await client.delete(`/evenements/${id}`)
    return response.data
}
