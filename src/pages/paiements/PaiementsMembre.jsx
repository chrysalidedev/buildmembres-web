import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import Pagination from "../../components/Pagination"
import usePagination from "../../hooks/usePagination"
import { getPaiementsMembre } from "../../api/paiements"

const IconArrowLeft = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

function StatutBadge({ statut }) {
    const estAJour = statut === "à jour"
    return (
        <span className={`${estAJour ? "bg-success/10 text-success" : "bg-danger/10 text-danger"} text-sm font-semibold px-3 py-1 rounded-full`}>
            {estAJour ? "✓ À jour" : "⚠ En retard"}
        </span>
    )
}

function Skeleton() {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4 animate-pulse">
            <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
    )
}

export default function PaiementsMembre() {
    const { id } = useParams()
    const { page, goToPage } = usePagination()

    const [data, setData]             = useState(null)
    const [pagination, setPagination] = useState(null)
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur]         = useState(null)

    async function charger() {
        setChargement(true)
        setErreur(null)
        try {
            const res = await getPaiementsMembre(id, page)
            setData(res)
            setPagination(res.pagination ?? null)
        } catch {
            setErreur("Impossible de charger l'historique de ce membre.")
        } finally {
            setChargement(false)
        }
    }

    useEffect(() => { charger() }, [id, page])

    return (
        <DashboardLayout>

            {/* En-tête */}
            <div className="flex items-center gap-3 mb-6">
                <Link to="/membres" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                    {IconArrowLeft}
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold text-dark">
                            {chargement ? "Chargement..." : data?.member ?? "Membre"}
                        </h1>
                        {!chargement && data?.statut_cotisation && (
                            <StatutBadge statut={data.statut_cotisation} />
                        )}
                    </div>
                    <p className="text-gray-500 text-sm mt-0.5">Historique des paiements</p>
                </div>
            </div>

            {/* Chargement */}
            {chargement && (
                <div className="flex flex-col gap-2">
                    {[1, 2, 3].map((i) => <Skeleton key={i} />)}
                </div>
            )}

            {/* Erreur */}
            {!chargement && erreur && (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <p className="text-gray-500 font-medium">{erreur}</p>
                    <button onClick={charger} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors cursor-pointer">
                        <div className="w-4 h-4">{IconRefresh}</div>
                        Réessayer
                    </button>
                </div>
            )}

            {/* Liste des paiements */}
            {!chargement && !erreur && (
                <div className="flex flex-col gap-2">
                    {!data?.payements || data.payements.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <p className="font-medium">Aucun paiement enregistré pour ce membre.</p>
                            <Link
                                to="/paiements/nouveau"
                                className="inline-block mt-4 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-secondary transition-colors"
                            >
                                Enregistrer un paiement
                            </Link>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-gray-400 mb-2">
                                {pagination?.total ?? data.payements.length} paiement{(pagination?.total ?? data.payements.length) > 1 ? "s" : ""} au total
                            </p>
                            {data.payements.map((p) => (
                                <div key={p.id} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-gray-200 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold text-dark">{p.cotisation.nom}</p>
                                            <ModeBadge mode={p.mode_paiement} />
                                        </div>
                                        <p className="text-sm text-gray-400 mt-0.5">
                                            Période : {p.periode} · Payé le {p.date_paiement}
                                        </p>
                                        {p.note && (
                                            <p className="text-xs text-gray-400 mt-1 italic">{p.note}</p>
                                        )}
                                    </div>
                                    <p className="font-bold text-primary shrink-0">
                                        {parseFloat(p.montant).toLocaleString("fr-FR")} F
                                    </p>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}

            {!chargement && !erreur && (
                <Pagination pagination={pagination} onPageChange={goToPage} />
            )}

        </DashboardLayout>
    )
}
