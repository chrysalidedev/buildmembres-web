import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import StatCard from "../components/StatCard"
import QuickActionButton from "../components/QuickActionButton"
import MemberList from "../components/MemberList"
import DashboardLayout from "../components/DashboardLayout"
import { getDashboard } from "../api/dashboard"

// --- Icônes ---
const IconMembers = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)
const IconCheck = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)
const IconWarning = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
)
const IconCalendar = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)
const IconUserPlus = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
)
const IconPayment = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
)
const IconPresence = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
)

const typeAnnonceStyle = {
    information: "bg-primary/10 text-primary",
    reunion:     "bg-purple-100 text-purple-600",
    cotisation:  "bg-amber-100 text-amber-600",
    autre:       "bg-gray-100 text-gray-500",
}
const typeAnnonceLabel = {
    information: "Info",
    reunion:     "Réunion",
    cotisation:  "Cotisation",
    autre:       "Autre",
}

function SkeletonStatCard() {
    return (
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
                <div className="h-7 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
        </div>
    )
}

export default function Dashboard() {
    const navigate = useNavigate()

    const [donnees, setDonnees]         = useState(null)
    const [chargement, setChargement]   = useState(true)
    const [erreur, setErreur]           = useState(null)

    useEffect(() => {
        async function charger() {
            try {
                const data = await getDashboard()
                setDonnees(data)
            } catch {
                setErreur("Impossible de charger le tableau de bord.")
            } finally {
                setChargement(false)
            }
        }
        charger()
    }, [])

    const stats             = donnees?.stats
    const user              = donnees?.user
    const membresEnRetard   = donnees?.membres_en_retard   ?? []
    const dernieresAnnonces = donnees?.dernieres_annonces  ?? []

    // Valeur affichée pour la prochaine réunion
    const prochaineReunionLabel = stats?.prochaine_reunion
        ? new Date(stats.prochaine_reunion.date_event).toLocaleDateString("fr-FR", {
            weekday: "short", day: "numeric", month: "short"
          })
        : "Aucune prévue"

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">

                {/* Salutation */}
                <div>
                    {chargement ? (
                        <div className="flex flex-col gap-2 animate-pulse">
                            <div className="h-7 bg-gray-200 rounded w-1/3" />
                            <div className="h-4 bg-gray-100 rounded w-1/2" />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-dark">
                                Bonjour, {user?.name?.split(" ")[0] ?? "—"} 👋
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Voici l'état de votre organisation aujourd'hui.
                            </p>
                        </>
                    )}
                </div>

                {/* Cartes statistiques */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {chargement ? (
                        [1, 2, 3, 4].map((i) => <SkeletonStatCard key={i} />)
                    ) : erreur ? (
                        <div className="col-span-4 text-center py-8 text-danger text-sm font-medium">
                            {erreur}
                        </div>
                    ) : (
                        <>
                            <StatCard
                                icon={IconMembers}
                                label="Membres au total"
                                value={stats?.total_membres ?? 0}
                                color="primary"
                            />
                            <StatCard
                                icon={IconCheck}
                                label="À jour ce mois"
                                value={stats?.a_jour ?? 0}
                                color="green"
                            />
                            <StatCard
                                icon={IconWarning}
                                label="En retard de cotisation"
                                value={stats?.en_retard ?? 0}
                                color="red"
                            />
                            <StatCard
                                icon={IconCalendar}
                                label="Prochaine réunion"
                                value={prochaineReunionLabel}
                                color="orange"
                            />
                        </>
                    )}
                </section>

                {/* Total paiements du mois */}
                {!chargement && !erreur && (
                    <div className="bg-primary text-white rounded-2xl px-6 py-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-75">Paiements encaissés ce mois</p>
                            <p className="text-3xl font-bold mt-0.5">
                                {(stats?.total_paiements_mois ?? 0).toLocaleString("fr-FR")}
                                <span className="text-lg font-medium opacity-75 ml-1">FCFA</span>
                            </p>
                        </div>
                        <Link
                            to="/paiements"
                            className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                        >
                            Voir tout
                        </Link>
                    </div>
                )}

                {/* Actions rapides */}
                <section>
                    <h2 className="text-base font-bold text-dark mb-3">Actions rapides</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <QuickActionButton
                            icon={IconUserPlus}
                            label="Ajouter un membre"
                            description="Nouveau membre"
                            onClick={() => navigate("/membres/nouveau")}
                            color="primary"
                        />
                        <QuickActionButton
                            icon={IconPayment}
                            label="Enregistrer un paiement"
                            description="Cotisation reçue"
                            onClick={() => navigate("/paiements/nouveau")}
                            color="green"
                        />
                        <QuickActionButton
                            icon={IconPresence}
                            label="Marquer présence"
                            description="Réunion du jour"
                            onClick={() => navigate("/evenements")}
                            color="orange"
                        />
                    </div>
                </section>

                {/* Membres en retard */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-bold text-dark">
                            Membres en retard
                            {!chargement && membresEnRetard.length > 0 && (
                                <span className="ml-2 text-sm font-normal text-danger">
                                    ({membresEnRetard.length})
                                </span>
                            )}
                        </h2>
                        {!chargement && membresEnRetard.length > 0 && (
                            <Link to="/membres" className="text-sm text-primary font-medium hover:underline">
                                Voir tous les membres
                            </Link>
                        )}
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        {chargement ? (
                            <div className="flex flex-col gap-2 animate-pulse">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3 px-2 py-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                                        <div className="flex-1 h-4 bg-gray-200 rounded w-1/3" />
                                        <div className="w-20 h-7 bg-gray-100 rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <MemberList members={membresEnRetard} />
                        )}
                    </div>
                </section>

                {/* Dernières annonces */}
                {!chargement && dernieresAnnonces.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-bold text-dark">Dernières annonces</h2>
                            <Link to="/annonces" className="text-sm text-primary font-medium hover:underline">
                                Voir toutes
                            </Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            {dernieresAnnonces.map((a) => (
                                <div key={a.id} className="bg-white border border-gray-100 rounded-2xl px-4 py-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-semibold text-dark text-sm">{a.titre}</p>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeAnnonceStyle[a.type] ?? "bg-gray-100 text-gray-500"}`}>
                                            {typeAnnonceLabel[a.type] ?? a.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2">{a.contenu}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </div>
        </DashboardLayout>
    )
}
