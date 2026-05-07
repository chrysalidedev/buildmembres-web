import client from "./client"

export async function getAnnonces(page = 1) {
    const response = await client.get(`/annonces?page=${page}`)
    return response.data
}

export async function createAnnonce(data) {
    const response = await client.post("/annonces", data)
    return response.data
}

export async function updateAnnonce(id, data) {
    const response = await client.put(`/annonces/${id}`, data)
    return response.data
}

export async function deleteAnnonce(id) {
    const response = await client.delete(`/annonces/${id}`)
    return response.data
}
