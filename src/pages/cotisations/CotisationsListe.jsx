import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import Pagination from "../../components/Pagination"
import usePagination from "../../hooks/usePagination"
import { getCotisations, deleteCotisation } from "../../api/cotisations"

const IconPlus = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
)
const IconEdit = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
)
const IconTrash = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
)
const IconRefresh = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
)

const periodiciteLabel = {
    mensuel:      { label: "Mensuel",      style: "bg-primary/10 text-primary" },
    trimestriel:  { label: "Trimestriel",  style: "bg-amber-50 text-amber-600" },
    semestriel:   { label: "Semestriel",   style: "bg-purple-50 text-purple-600" },
    annuel:       { label: "Annuel",       style: "bg-success/10 text-success" },
}

function PeriodiciteBadge({ periodicite }) {
    const config = periodiciteLabel[periodicite] ?? { label: periodicite, style: "bg-gray-100 text-gray-500" }
    return (
        <span className={`${config.style} text-xs font-semibold px-2.5 py-1 rounded-full`}>
            {config.label}
        </span>
    )
}

function Skeleton() {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4 animate-pulse">
            <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                <div className="w-8 h-8 bg-gray-100 rounded-lg" />
            </div>
        </div>
    )
}

export default function CotisationsListe() {
    const navigate = useNavigate()
    const { page, goToPage } = usePagination()

    const [cotisations, setCotisations] = useState([])
    const [pagination, setPagination]   = useState(null)
    const [chargement, setChargement]   = useState(true)
    const [erreur, setErreur]           = useState(null)
    const [erreurSuppr, setErreurSuppr] = useState(null)
    const [supprimerId, setSupprimerId] = useState(null)

    async function chargerCotisations() {
        setChargement(true)
        setErreur(null)
        try {
            const data = await getCotisations(page)
            setCotisations(data.cotisations ?? [])
            setPagination(data.pagination ?? null)
        } catch {
            setErreur("Impossible de charger les cotisations.")
        } finally {
            setChargement(false)
        }
    }

    useEffect(() => { chargerCotisations() }, [page])

    async function confirmerSuppression(id) {
        setErreurSuppr(null)
        try {
            await deleteCotisation(id)
            await chargerCotisations()
        } catch {
            setErreurSuppr("Échec de la suppression. Veuillez réessayer.")
        } finally {
            setSupprimerId(null)
        }
    }

    return (
        <DashboardLayout>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Cotisations</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {chargement ? "Chargement..." : `${pagination?.total ?? cotisations.length} cotisation${(pagination?.total ?? cotisations.length) > 1 ? "s" : ""}`}
                    </p>
                </div>
                <Link
                    to="/cotisations/nouveau"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-secondary transition-colors"
                >
                    <div className="w-4 h-4">{IconPlus}</div>
                    Nouvelle cotisation
                </Link>
            </div>

            {erreurSuppr && (
                <div className="bg-danger/10 text-danger text-sm px-4 py-3 rounded-xl mb-4">
                    {erreurSuppr}
                </div>
            )}

            {chargement && (
                <div className="flex flex-col gap-2">
                    {[1, 2, 3].map((i) => <Skeleton key={i} />)}
                </div>
            )}

            {!chargement && erreur && (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <p className="text-gray-500 font-medium">{erreur}</p>
                    <button onClick={chargerCotisations} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors cursor-pointer">
                        <div className="w-4 h-4">{IconRefresh}</div>
                        Réessayer
                    </button>
                </div>
            )}

            {!chargement && !erreur && (
                <div className="flex flex-col gap-2">
                    {cotisations.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <p className="font-medium">Aucune cotisation créée.</p>
                            <Link to="/cotisations/nouveau" className="inline-block mt-4 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-secondary transition-colors">
                                Créer la première cotisation
                            </Link>
                        </div>
                    ) : (
                        cotisations.map((cotisation) => (
                            <div key={cotisation.id} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-gray-200 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-semibold text-dark">{cotisation.nom}</p>
                                        <PeriodiciteBadge periodicite={cotisation.periodicite} />
                                    </div>
                                    <p className="text-sm text-gray-400 mt-0.5">
                                        {parseFloat(cotisation.montant).toLocaleString("fr-FR")} FCFA · Depuis le {cotisation.date_debut}
                                    </p>
                                </div>

                                <p className="text-lg font-bold text-primary shrink-0">
                                    {parseFloat(cotisation.montant).toLocaleString("fr-FR")} F
                                </p>

                                {supprimerId === cotisation.id ? (
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-sm text-gray-500">Supprimer ?</span>
                                        <button onClick={() => confirmerSuppression(cotisation.id)} className="bg-danger text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-red-600 transition-colors">Oui</button>
                                        <button onClick={() => setSupprimerId(null)} className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">Non</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button onClick={() => navigate(`/cotisations/${cotisation.id}/modifier`)} className="w-8 h-8 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors cursor-pointer" title="Modifier">{IconEdit}</button>
                                        <button onClick={() => setSupprimerId(cotisation.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-danger hover:bg-danger/10 transition-colors cursor-pointer" title="Supprimer">{IconTrash}</button>
                                    </div>
                                )}
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
