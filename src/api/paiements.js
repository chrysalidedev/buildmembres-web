import client from "./client"

export async function getPaiements(page = 1) {
    const response = await client.get(`/paiements?page=${page}`)
    return response.data
}

export async function getPaiementsMembre(membreId, page = 1) {
    const response = await client.get(`/paiements/membre/${membreId}?page=${page}`)
    return response.data
}

export async function createPaiement(data) {
    const response = await client.post("/paiements", data)
    return response.data
}
