import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import Pagination from "../../components/Pagination"
import usePagination from "../../hooks/usePagination"
import { getAnnonces, deleteAnnonce } from "../../api/annonces"

// --- Icônes ---
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

// --- Config des types ---
const typeConfig = {
    information: { label: "Information",        style: "bg-primary/10 text-primary" },
    reunion:     { label: "Réunion",            style: "bg-purple-100 text-purple-600" },
    cotisation:  { label: "Rappel cotisation",  style: "bg-amber-100 text-amber-600" },
    autre:       { label: "Autre",              style: "bg-gray-100 text-gray-500" },
}

function TypeBadge({ type }) {
    const config = typeConfig[type] ?? typeConfig.autre
    return (
        <span className={`${config.style} text-xs font-semibold px-2.5 py-1 rounded-full`}>
            {config.label}
        </span>
    )
}

function Skeleton() {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 animate-pulse">
            <div className="flex items-center gap-2">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-5 bg-gray-100 rounded-full w-24" />
            </div>
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
    )
}

export default function AnnoncesListe() {
    const navigate = useNavigate()
    const { page, goToPage } = usePagination()

    const [annonces, setAnnonces]       = useState([])
    const [pagination, setPagination]   = useState(null)
    const [chargement, setChargement]   = useState(true)
    const [erreur, setErreur]           = useState(null)
    const [erreurSuppr, setErreurSuppr] = useState(null)
    const [supprimerId, setSupprimerId] = useState(null)

    async function chargerAnnonces() {
        setChargement(true)
        setErreur(null)
        try {
            const data = await getAnnonces(page)
            setAnnonces(data.annonces ?? [])
            setPagination(data.pagination ?? null)
        } catch {
            setErreur("Impossible de charger les annonces.")
        } finally {
            setChargement(false)
        }
    }

    useEffect(() => { chargerAnnonces() }, [page])

    async function confirmerSuppression(id) {
        setErreurSuppr(null)
        try {
            await deleteAnnonce(id)
            await chargerAnnonces()
        } catch {
            setErreurSuppr("Échec de la suppression.")
        } finally {
            setSupprimerId(null)
        }
    }

    return (
        <DashboardLayout>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Annonces</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {chargement ? "Chargement..." : `${pagination?.total ?? annonces.length} annonce${(pagination?.total ?? annonces.length) > 1 ? "s" : ""}`}
                    </p>
                </div>
                <Link
                    to="/annonces/nouvelle"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-secondary transition-colors"
                >
                    <div className="w-4 h-4">{IconPlus}</div>
                    Publier une annonce
                </Link>
            </div>

            {erreurSuppr && (
                <div className="bg-danger/10 text-danger text-sm px-4 py-3 rounded-xl mb-4">
                    {erreurSuppr}
                </div>
            )}

            {chargement && (
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} />)}
                </div>
            )}

            {!chargement && erreur && (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <p className="text-gray-500 font-medium">{erreur}</p>
                    <button
                        onClick={chargerAnnonces}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors cursor-pointer"
                    >
                        <div className="w-4 h-4">{IconRefresh}</div>
                        Réessayer
                    </button>
                </div>
            )}

            {!chargement && !erreur && (
                <div className="flex flex-col gap-3">
                    {annonces.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <p className="font-medium">Aucune annonce publiée.</p>
                            <Link
                                to="/annonces/nouvelle"
                                className="inline-block mt-4 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-secondary transition-colors"
                            >
                                Publier la première annonce
                            </Link>
                        </div>
                    ) : (
                        annonces.map((annonce) => (
                            <div
                                key={annonce.id}
                                className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors"
                            >
                                {/* En-tête : titre + badge + actions */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                                        <p className="font-semibold text-dark">{annonce.titre}</p>
                                        <TypeBadge type={annonce.type} />
                                    </div>

                                    {/* Actions */}
                                    {supprimerId === annonce.id ? (
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-sm text-gray-500">Supprimer ?</span>
                                            <button
                                                onClick={() => confirmerSuppression(annonce.id)}
                                                className="bg-danger text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-red-600 transition-colors"
                                            >
                                                Oui
                                            </button>
                                            <button
                                                onClick={() => setSupprimerId(null)}
                                                className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                                            >
                                                Non
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={() => navigate(`/annonces/${annonce.id}/modifier`)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                                                title="Modifier"
                                            >
                                                {IconEdit}
                                            </button>
                                            <button
                                                onClick={() => setSupprimerId(annonce.id)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                                                title="Supprimer"
                                            >
                                                {IconTrash}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Contenu */}
                                <p className="text-sm text-gray-500 mt-2 leading-relaxed whitespace-pre-line">
                                    {annonce.contenu}
                                </p>

                                {/* Date */}
                                <p className="text-xs text-gray-300 mt-3">
                                    Publié le {new Date(annonce.publiee_le).toLocaleDateString("fr-FR", {
                                        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                                    })}
                                </p>
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
