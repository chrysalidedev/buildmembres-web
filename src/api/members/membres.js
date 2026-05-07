import client from "../client"

export async function getMembres(page = 1) {
    const response = await client.get(`/members?page=${page}`)
    return response.data
}

export async function getMembre(id) {
    const response = await client.get(`/members/${id}`)
    return response.data
}

export async function createMembre(data) {
    const response = await client.post("/members", data)
    return response.data
}

export async function updateMembre(id, data) {
    const response = await client.put(`/members/${id}`, data)
    return response.data
}

export async function deleteMembre(id) {
    const response = await client.delete(`/members/${id}`)
    return response.data
}
