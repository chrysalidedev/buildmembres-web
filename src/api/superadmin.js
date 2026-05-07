import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1"

function adminClient() {
    const key = sessionStorage.getItem("admin_key")
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            "X-Admin-Key": key ?? "",
            "Accept": "application/json",
        },
    })
}

export async function adminLogin(key) {
    const res = await axios.get(`${BASE_URL}/admin/stats`, {
        headers: { "X-Admin-Key": key, "Accept": "application/json" },
    })
    return res.data
}

export async function getAdminStats() {
    const res = await adminClient().get("/admin/stats")
    return res.data
}

export async function getAdminOrganisations() {
    const res = await adminClient().get("/admin/organisations")
    return res.data
}

export async function getAdminActivite() {
    const res = await adminClient().get("/admin/activite")
    return res.data
}
