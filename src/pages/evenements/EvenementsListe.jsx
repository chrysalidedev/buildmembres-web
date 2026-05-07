import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import Pagination from "../../components/Pagination"
import usePagination from "../../hooks/usePagination"
import { getEvenements, deleteEvenement } from "../../api/evenements"

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
const IconUsers = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)
const IconRefresh = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
)
const IconCalendar = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)
const IconPin = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)

function Skeleton() {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded w-2/5" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
            <div className="flex gap-2 shrink-0">
                <div className="h-7 w-16 bg-gray-100 rounded-lg" />
                <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                <div className="w-8 h-8 bg-gray-100 rounded-lg" />
            </div>
        </div>
    )
}

function DateBadge({ dateEvent }) {
    const d = new Date(dateEvent)
    const jour = d.toLocaleDateString("fr-FR", { day: "2-digit" })
    const mois = d.toLocaleDateString("fr-FR", { month: "short" })
    return (
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
            <span className="text-primary font-bold text-base leading-none">{jour}</span>
            <span className="text-primary text-xs font-medium uppercase">{mois}</span>
        </div>
    )
}

export default function EvenementsListe() {
    const navigate = useNavigate()
    const { page, goToPage } = usePagination()

    const [evenements, setEvenements]   = useState([])
    const [pagination, setPagination]   = useState(null)
    const [chargement, setChargement]   = useState(true)
    const [erreur, setErreur]           = useState(null)
    const [erreurSuppr, setErreurSuppr] = useState(null)
    const [supprimerId, setSupprimerId] = useState(null)

    async function chargerEvenements() {
        setChargement(true)
        setErreur(null)
        try {
            const data = await getEvenements(page)
            setEvenements(data.evenements ?? [])
            setPagination(data.pagination ?? null)
        } catch {
            setErreur("Impossible de charger les réunions.")
        } finally {
            setChargement(false)
        }
    }

    useEffect(() => { chargerEvenements() }, [page])

    async function confirmerSuppression(id) {
        setErreurSuppr(null)
        try {
            await deleteEvenement(id)
            await chargerEvenements()
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
                    <h1 className="text-2xl font-bold text-dark">Réunions</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {chargement ? "Chargement..." : `${pagination?.total ?? evenements.length} réunion${(pagination?.total ?? evenements.length) > 1 ? "s" : ""}`}
                    </p>
                </div>
                <Link
                    to="/evenements/nouveau"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-secondary transition-colors"
                >
                    <div className="w-4 h-4">{IconPlus}</div>
                    Nouvelle réunion
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
                    <button
                        onClick={chargerEvenements}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors cursor-pointer"
                    >
                        <div className="w-4 h-4">{IconRefresh}</div>
                        Réessayer
                    </button>
                </div>
            )}

            {!chargement && !erreur && (
                <div className="flex flex-col gap-2">
                    {evenements.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <p className="font-medium">Aucune réunion enregistrée.</p>
                            <Link
                                to="/evenements/nouveau"
                                className="inline-block mt-4 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-secondary transition-colors"
                            >
                                Créer la première réunion
                            </Link>
                        </div>
                    ) : (
                        evenements.map((ev) => (
                            <div
                                key={ev.id}
                                className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-4 hover:border-gray-200 transition-colors"
                            >
                                <DateBadge dateEvent={ev.date_event} />

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-dark truncate">{ev.titre}</p>
                                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                        {ev.lieu && (
                                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                                <span className="w-3.5 h-3.5">{IconPin}</span>
                                                {ev.lieu}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 text-xs text-success font-medium">
                                            <span className="w-3.5 h-3.5">{IconUsers}</span>
                                            {ev.presents_count ?? 0} présents
                                        </span>
                                        {(ev.absents_count ?? 0) > 0 && (
                                            <span className="text-xs text-danger font-medium">
                                                {ev.absents_count} absents
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {supprimerId === ev.id ? (
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-sm text-gray-500">Supprimer ?</span>
                                        <button
                                            onClick={() => confirmerSuppression(ev.id)}
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
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => navigate(`/evenements/${ev.id}/presences`)}
                                            className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors"
                                            title="Marquer les présences"
                                        >
                                            <span className="w-3.5 h-3.5">{IconUsers}</span>
                                            Présences
                                        </button>
                                        <button
                                            onClick={() => navigate(`/evenements/${ev.id}/modifier`)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                                            title="Modifier"
                                        >
                                            {IconEdit}
                                        </button>
                                        <button
                                            onClick={() => setSupprimerId(ev.id)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                                            title="Supprimer"
                                        >
                                            {IconTrash}
                                        </button>
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
