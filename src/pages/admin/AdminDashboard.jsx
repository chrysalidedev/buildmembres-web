import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/AdminLayout"
import { getAdminStats, getAdminActivite } from "../../api/superadmin"

function StatCard({ label, value, sub, color, icon }) {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-400 text-xs font-medium">{label}</p>
                <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
                {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
            </div>
        </div>
    )
}

function BadgeType({ type }) {
    const map = {
        organisation: { bg: "bg-indigo-900/40 text-indigo-300", label: "Inscription" },
        paiement:     { bg: "bg-green-900/40 text-green-300",   label: "Paiement" },
    }
    const s = map[type] ?? { bg: "bg-gray-800 text-gray-400", label: type }
    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.bg}`}>{s.label}</span>
    )
}

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [stats, setStats]       = useState(null)
    const [activite, setActivite] = useState([])
    const [loading, setLoading]   = useState(true)
    const [erreur, setErreur]     = useState("")

    useEffect(() => {
        if (!sessionStorage.getItem("admin_key")) {
            navigate("/admin/login")
            return
        }
        Promise.all([getAdminStats(), getAdminActivite()])
            .then(([s, a]) => { setStats(s); setActivite(a) })
            .catch(() => setErreur("Erreur de chargement ou accès refusé."))
            .finally(() => setLoading(false))
    }, [navigate])

    if (loading) return (
        <AdminLayout>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 h-24 animate-pulse" />
                ))}
            </div>
        </AdminLayout>
    )

    if (erreur) return (
        <AdminLayout>
            <p className="text-red-400 bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3">{erreur}</p>
        </AdminLayout>
    )

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-white text-2xl font-bold">Vue globale</h1>
                <p className="text-gray-500 text-sm mt-1">Statistiques en temps réel du SaaS Build-Membres</p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Organisations"
                    value={stats.total_organisations}
                    color="bg-indigo-600/20"
                    icon={<svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                />
                <StatCard
                    label="Utilisateurs"
                    value={stats.total_utilisateurs}
                    color="bg-blue-600/20"
                    icon={<svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                />
                <StatCard
                    label="Membres"
                    value={stats.total_membres}
                    color="bg-violet-600/20"
                    icon={<svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                />
                <StatCard
                    label="Paiements"
                    value={stats.total_paiements.count}
                    sub={`${stats.total_paiements.montant.toLocaleString("fr-FR")} FCFA`}
                    color="bg-emerald-600/20"
                    icon={<svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
            </div>

            {/* Activité récente */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-800">
                    <h2 className="text-white font-semibold text-sm">Activité récente</h2>
                </div>

                {activite.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-10">Aucune activité enregistrée</p>
                ) : (
                    <ul className="divide-y divide-gray-800">
                        {activite.map((item, i) => (
                            <li key={i} className="px-5 py-3.5 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                        item.type === "paiement" ? "bg-emerald-900/40" : "bg-indigo-900/40"
                                    }`}>
                                        {item.type === "paiement"
                                            ? <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            : <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                        }
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">{item.label}</p>
                                        <p className="text-gray-500 text-xs">{item.detail}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <BadgeType type={item.type} />
                                    <span className="text-gray-600 text-xs">{item.date}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AdminLayout>
    )
}
