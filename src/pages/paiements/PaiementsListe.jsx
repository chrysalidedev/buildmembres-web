import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import Pagination from "../../components/Pagination"
import usePagination from "../../hooks/usePagination"
import { getPaiements } from "../../api/paiements"

const IconPlus = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
)
const IconRefresh = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
)

const modeLabel = {
    mobile_money: { label: "Mobile Money", style: "bg-amber-50 text-amber-600" },
    especes:      { label: "Espèces",       style: "bg-success/10 text-success" },
    virement:     { label: "Virement",      style: "bg-primary/10 text-primary" },
    cheque:       { label: "Chèque",        style: "bg-gray-100 text-gray-500" },
}

function ModeBadge({ mode }) {
    const config = modeLabel[mode] ?? { label: mode, style: "bg-gray-100 text-gray-500" }
    return <span className={`${config.style} text-xs font-semibold px-2.5 py-1 rounded-full`}>{config.label}</span>
}

function InitialeAvatar({ nom, prenom }) {
    return (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {(prenom || nom).charAt(0).toUpperCase()}
        </div>
    )
}

function Skeleton() {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
    )
}

export default function PaiementsListe() {
    const { page, goToPage } = usePagination()

    const [paiements, setPaiements]   = useState([])
    const [pagination, setPagination] = useState(null)
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur]         = useState(null)

    async function chargerPaiements() {
        setChargement(true)
        setErreur(null)
        try {
            const data = await getPaiements(page)
            setPaiements(data.payements ?? [])
            setPagination(data.pagination ?? null)
        } catch {
            setErreur("Impossible de charger les paiements.")
        } finally {
            setChargement(false)
        }
    }

    useEffect(() => { chargerPaiements() }, [page])

    return (
        <DashboardLayout>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Paiements</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {chargement ? "Chargement..." : `${pagination?.total ?? paiements.length} paiement${(pagination?.total ?? paiements.length) > 1 ? "s" : ""} enregistré${(pagination?.total ?? paiements.length) > 1 ? "s" : ""}`}
                    </p>
                </div>
                <Link to="/paiements/nouveau" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-secondary transition-colors">
                    <div className="w-4 h-4">{IconPlus}</div>
                    Enregistrer un paiement
                </Link>
            </div>

            {chargement && (
                <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4].map((i) => <Skeleton key={i} />)}
                </div>
            )}

            {!chargement && erreur && (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <p className="text-gray-500 font-medium">{erreur}</p>
                    <button onClick={chargerPaiements} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors cursor-pointer">
                        <div className="w-4 h-4">{IconRefresh}</div>
                        Réessayer
                    </button>
                </div>
            )}

            {!chargement && !erreur && (
                <div className="flex flex-col gap-2">
                    {paiements.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <p className="font-medium">Aucun paiement enregistré.</p>
                            <Link to="/paiements/nouveau" className="inline-block mt-4 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-secondary transition-colors">
                                Enregistrer le premier paiement
                            </Link>
                        </div>
                    ) : (
                        paiements.map((p) => (
                            <div key={p.id} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-gray-200 transition-colors">
                                <InitialeAvatar nom={p.member.nom} prenom={p.member.prenom} />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-semibold text-dark">{p.member.prenom} {p.member.nom}</p>
                                        <ModeBadge mode={p.mode_paiement} />
                                    </div>
                                    <p className="text-sm text-gray-400 truncate mt-0.5">
                                        {p.cotisation.nom} · Période : {p.periode}
                                    </p>
                                </div>

                                <div className="text-right shrink-0">
                                    <p className="font-bold text-primary">{parseFloat(p.montant).toLocaleString("fr-FR")} F</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{p.date_paiement}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {!chargement && !erreur && (
                <Pagination pagination={pagination} onPageChange={goToPage} />
            )}

        </DashboardLayout>
    )
}
