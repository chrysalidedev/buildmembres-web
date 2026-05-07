import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import Pagination from "../../components/Pagination"
import usePagination from "../../hooks/usePagination"
import { getMembres, deleteMembre } from "../../api/members/membres"

// --- Icônes ---
const IconPlus = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
)
const IconSearch = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
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
const IconHistory = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
)

// --- Sous-composants ---
function StatutBadge({ statut }) {
    const classes = statut === "actif"
        ? "bg-success/10 text-success"
        : "bg-gray-100 text-gray-400"
    return (
        <span className={`${classes} text-xs font-semibold px-2.5 py-1 rounded-full`}>
            {statut === "actif" ? "Actif" : "Inactif"}
        </span>
    )
}

function InitialeAvatar({ nom, prenom }) {
    return (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {(prenom || nom).charAt(0).toUpperCase()}
        </div>
    )
}

// Skeleton animé affiché pendant le chargement
function MembreSkeleton() {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
            <div className="flex gap-2 shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                <div className="w-8 h-8 bg-gray-100 rounded-lg" />
            </div>
        </div>
    )
}

// --- Page principale ---
export default function MembresListe() {
    const navigate = useNavigate()
    const { page, goToPage } = usePagination()

    const [membres, setMembres]         = useState([])
    const [pagination, setPagination]   = useState(null)
    const [chargement, setChargement]   = useState(true)
    const [erreur, setErreur]           = useState(null)
    const [erreurSuppr, setErreurSuppr] = useState(null)
    const [recherche, setRecherche]     = useState("")
    const [supprimerId, setSupprimerId] = useState(null)

    async function chargerMembres() {
        setChargement(true)
        setErreur(null)
        try {
            const data = await getMembres(page)
            setMembres(data.members ?? [])
            setPagination(data.pagination ?? null)
        } catch {
            setErreur("Impossible de charger la liste des membres.")
        } finally {
            setChargement(false)
        }
    }

    useEffect(() => {
        chargerMembres()
    }, [page])

    async function confirmerSuppression(id) {
        setErreurSuppr(null)
        try {
            await deleteMembre(id)
            await chargerMembres()
        } catch {
            setErreurSuppr("Échec de la suppression. Veuillez réessayer.")
        } finally {
            setSupprimerId(null)
        }
    }

    const membresFiltres = membres.filter((m) => {
        const nomComplet = `${m.prenom} ${m.nom}`.toLowerCase()
        return nomComplet.includes(recherche.toLowerCase())
    })

    return (
        <DashboardLayout>

            {/* En-tête de page */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Membres</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {chargement ? "Chargement..." : `${pagination?.total ?? membres.length} membre${(pagination?.total ?? membres.length) > 1 ? "s" : ""} au total`}
                    </p>
                </div>
                <Link
                    to="/membres/nouveau"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-secondary transition-colors"
                >
                    <div className="w-4 h-4">{IconPlus}</div>
                    Ajouter un membre
                </Link>
            </div>

            {/* Erreur de suppression */}
            {erreurSuppr && (
                <div className="bg-danger/10 text-danger text-sm px-4 py-3 rounded-xl mb-4">
                    {erreurSuppr}
                </div>
            )}

            {/* Barre de recherche */}
            <div className="relative mb-4">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                    {IconSearch}
                </div>
                <input
                    type="text"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    placeholder="Rechercher un membre..."
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-primary bg-white"
                    disabled={chargement}
                />
            </div>

            {/* État : chargement */}
            {chargement && (
                <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4].map((i) => <MembreSkeleton key={i} />)}
                </div>
            )}

            {/* État : erreur de chargement */}
            {!chargement && erreur && (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <p className="text-gray-500 font-medium">{erreur}</p>
                    <button
                        onClick={chargerMembres}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors cursor-pointer"
                    >
                        <div className="w-4 h-4">{IconRefresh}</div>
                        Réessayer
                    </button>
                </div>
            )}

            {/* État : liste */}
            {!chargement && !erreur && (
                <div className="flex flex-col gap-2">
                    {membresFiltres.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <p className="font-medium">
                                {recherche ? "Aucun membre trouvé pour cette recherche." : "Aucun membre enregistré."}
                            </p>
                            {!recherche && (
                                <Link
                                    to="/membres/nouveau"
                                    className="inline-block mt-4 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-secondary transition-colors"
                                >
                                    Ajouter le premier membre
                                </Link>
                            )}
                        </div>
                    ) : (
                        membresFiltres.map((membre) => (
                            <div
                                key={membre.id}
                                className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-4 hover:border-gray-200 transition-colors"
                            >
                                <InitialeAvatar nom={membre.nom} prenom={membre.prenom} />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-semibold text-dark">{membre.prenom} {membre.nom}</p>
                                        <StatutBadge statut={membre.statut} />
                                    </div>
                                    <p className="text-sm text-gray-400 truncate mt-0.5">
                                        {membre.email}{membre.telephone ? ` · ${membre.telephone}` : ""}
                                    </p>
                                </div>

                                {/* Confirmation suppression inline */}
                                {supprimerId === membre.id ? (
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-sm text-gray-500">Supprimer ?</span>
                                        <button
                                            onClick={() => confirmerSuppression(membre.id)}
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
                                            onClick={() => navigate(`/membres/${membre.id}/paiements`)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
                                            title="Voir les paiements"
                                        >
                                            {IconHistory}
                                        </button>
                                        <button
                                            onClick={() => navigate(`/membres/${membre.id}/modifier`)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                                            title="Modifier"
                                        >
                                            {IconEdit}
                                        </button>
                                        <button
                                            onClick={() => setSupprimerId(membre.id)}
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
