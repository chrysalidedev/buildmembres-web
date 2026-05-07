import client from "./client"

export async function getPresencesEvenement(evenementId) {
    const response = await client.get(`/evenements/${evenementId}/presences`)
    return response.data
}

export async function marquerPresences(evenementId, presences) {
    const response = await client.post(`/evenements/${evenementId}/presences`, { presences })
    return response.data
}

export async function getPresencesMembre(membreId) {
    const response = await client.get(`/presences/membre/${membreId}`)
    return response.data
}
