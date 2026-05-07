import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/AdminLayout"
import { getAdminOrganisations } from "../../api/superadmin"

const TYPE_LABELS = {
    association: { label: "Association", color: "bg-blue-900/40 text-blue-300" },
    ong:         { label: "ONG",         color: "bg-violet-900/40 text-violet-300" },
    eglise:      { label: "Église",      color: "bg-amber-900/40 text-amber-300" },
    autres:      { label: "Autre",       color: "bg-gray-800 text-gray-400" },
}

function BadgeType({ type }) {
    const s = TYPE_LABELS[type] ?? TYPE_LABELS.autres
    return (
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
    )
}

export default function AdminOrganisations() {
    const navigate = useNavigate()
    const [orgs, setOrgs]       = useState([])
    const [search, setSearch]   = useState("")
    const [loading, setLoading] = useState(true)
    const [erreur, setErreur]   = useState("")

    useEffect(() => {
        if (!sessionStorage.getItem("admin_key")) {
            navigate("/admin/login")
            return
        }
        getAdminOrganisations()
            .then(setOrgs)
            .catch(() => setErreur("Erreur de chargement ou accès refusé."))
            .finally(() => setLoading(false))
    }, [navigate])

    const filtrées = orgs.filter(o =>
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        (o.ville ?? "").toLowerCase().includes(search.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-white text-2xl font-bold">Organisations</h1>
                    <p className="text-gray-500 text-sm mt-1">{orgs.length} organisation{orgs.length !== 1 ? "s" : ""} inscrite{orgs.length !== 1 ? "s" : ""}</p>
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher…"
                    className="bg-gray-900 border border-gray-800 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-colors placeholder-gray-600 w-56"
                />
            </div>

            {erreur && (
                <p className="text-red-400 bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3 mb-4">{erreur}</p>
            )}

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                {/* En-tête tableau */}
                <div className="grid grid-cols-12 px-5 py-3 border-b border-gray-800 text-gray-500 text-xs font-medium uppercase tracking-wide">
                    <div className="col-span-5">Organisation</div>
                    <div className="col-span-2 text-center">Type</div>
                    <div className="col-span-2 text-center">Membres</div>
                    <div className="col-span-1 text-center">Users</div>
                    <div className="col-span-2 text-right">Inscrite le</div>
                </div>

                {loading ? (
                    <div className="divide-y divide-gray-800">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="px-5 py-4 animate-pulse">
                                <div className="h-4 bg-gray-800 rounded w-1/3" />
                            </div>
                        ))}
                    </div>
                ) : filtrées.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-12">
                        {search ? "Aucune organisation trouvée." : "Aucune organisation enregistrée."}
                    </p>
                ) : (
                    <ul className="divide-y divide-gray-800">
                        {filtrées.map((org) => (
                            <li key={org.id} className="grid grid-cols-12 items-center px-5 py-4 hover:bg-gray-800/40 transition-colors">
                                {/* Nom + ville */}
                                <div className="col-span-5 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-600/20 flex items-center justify-center shrink-0">
                                        <span className="text-indigo-400 font-bold text-sm">
                                            {org.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">{org.name}</p>
                                        {org.ville && <p className="text-gray-500 text-xs">{org.ville}</p>}
                                    </div>
                                </div>

                                {/* Type */}
                                <div className="col-span-2 flex justify-center">
                                    <BadgeType type={org.type} />
                                </div>

                                {/* Membres */}
                                <div className="col-span-2 text-center">
                                    <span className="text-white text-sm font-semibold">{org.members_count}</span>
                                    <span className="text-gray-600 text-xs ml-1">mbr</span>
                                </div>

                                {/* Users */}
                                <div className="col-span-1 text-center">
                                    <span className="text-gray-400 text-sm">{org.users_count}</span>
                                </div>

                                {/* Date */}
                                <div className="col-span-2 text-right">
                                    <span className="text-gray-500 text-xs">{org.created_at}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AdminLayout>
    )
}
