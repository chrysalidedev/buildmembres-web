import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import { getEvenement } from "../../api/evenements"
import { getPresencesEvenement, marquerPresences } from "../../api/presences"
import { getMembres } from "../../api/members/membres"

const IconArrowLeft = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
const IconCheck = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)
const IconX = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
)
const IconSave = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
    </svg>
)

function SkeletonMembre() {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 h-4 bg-gray-200 rounded w-1/3" />
            <div className="flex gap-2 shrink-0">
                <div className="w-24 h-9 bg-gray-100 rounded-xl" />
                <div className="w-24 h-9 bg-gray-100 rounded-xl" />
            </div>
        </div>
    )
}

function InitialeAvatar({ nom, prenom }) {
    return (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {(prenom || nom).charAt(0).toUpperCase()}
        </div>
    )
}

export default function EvenementPresences() {
    const { id } = useParams()

    const [evenement, setEvenement]     = useState(null)
    const [membres, setMembres]         = useState([])
    // statuts : { [member_id]: "present" | "absent" }
    const [statuts, setStatuts]         = useState({})
    const [chargement, setChargement]   = useState(true)
    const [enregistrement, setEnregistrement] = useState(false)
    const [erreur, setErreur]           = useState(null)
    const [succes, setSucces]           = useState(false)

    useEffect(() => {
        async function charger() {
            setChargement(true)
            setErreur(null)
            try {
                const [dataEv, dataMembres, dataPresences] = await Promise.all([
                    getEvenement(id),
                    getMembres(),
                    getPresencesEvenement(id),
                ])

                setEvenement(dataEv.evenement)
                const listeMembres = dataMembres.members ?? []
                setMembres(listeMembres)

                // Pré-remplir les statuts existants, défaut "absent" pour tous
                const statutsInitiaux = {}
                listeMembres.forEach((m) => { statutsInitiaux[m.id] = "absent" })
                ;(dataPresences.presences ?? []).forEach((p) => {
                    if (p.member?.id) statutsInitiaux[p.member.id] = p.statut
                })
                setStatuts(statutsInitiaux)
            } catch {
                setErreur("Impossible de charger les données.")
            } finally {
                setChargement(false)
            }
        }
        charger()
    }, [id])

    function toggleStatut(membreId, statut) {
        setStatuts((prev) => ({ ...prev, [membreId]: statut }))
        setSucces(false)
    }

    async function handleEnregistrer() {
        setEnregistrement(true)
        setErreur(null)
        setSucces(false)
        try {
            const presences = Object.entries(statuts).map(([member_id, statut]) => ({
                member_id: parseInt(member_id),
                statut,
            }))
            await marquerPresences(id, presences)
            setSucces(true)
        } catch (err) {
            setErreur(err.response?.data?.message || "Erreur lors de l'enregistrement.")
        } finally {
            setEnregistrement(false)
        }
    }

    const presents = Object.values(statuts).filter((s) => s === "present").length
    const absents  = Object.values(statuts).filter((s) => s === "absent").length

    const dateFormatee = evenement?.date_event
        ? new Date(evenement.date_event).toLocaleDateString("fr-FR", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
          })
        : ""
    const heureFormatee = evenement?.date_event
        ? new Date(evenement.date_event).toLocaleTimeString("fr-FR", {
            hour: "2-digit", minute: "2-digit"
          })
        : ""

    return (
        <DashboardLayout>

            {/* En-tête */}
            <div className="flex items-start gap-3 mb-6">
                <Link
                    to="/evenements"
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors shrink-0 mt-0.5"
                >
                    {IconArrowLeft}
                </Link>
                <div className="flex-1 min-w-0">
                    {chargement ? (
                        <div className="flex flex-col gap-2 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-1/2" />
                            <div className="h-4 bg-gray-100 rounded w-1/3" />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-dark truncate">
                                {evenement?.titre}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <span className="w-4 h-4">{IconCalendar}</span>
                                    <span className="capitalize">{dateFormatee}</span>
                                    {heureFormatee && <span>· {heureFormatee}</span>}
                                </span>
                                {evenement?.lieu && (
                                    <span className="flex items-center gap-1 text-sm text-gray-400">
                                        <span className="w-4 h-4">{IconPin}</span>
                                        {evenement.lieu}
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Compteurs présents / absents */}
            {!chargement && (
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-success/10 rounded-2xl px-4 py-3 text-center">
                        <p className="text-2xl font-bold text-success">{presents}</p>
                        <p className="text-sm text-success/80 font-medium">Présent{presents > 1 ? "s" : ""}</p>
                    </div>
                    <div className="bg-danger/10 rounded-2xl px-4 py-3 text-center">
                        <p className="text-2xl font-bold text-danger">{absents}</p>
                        <p className="text-sm text-danger/80 font-medium">Absent{absents > 1 ? "s" : ""}</p>
                    </div>
                </div>
            )}

            {/* Messages */}
            {erreur && (
                <div className="bg-danger/10 text-danger text-sm px-4 py-3 rounded-xl mb-4">
                    {erreur}
                </div>
            )}
            {succes && (
                <div className="bg-success/10 text-success text-sm px-4 py-3 rounded-xl mb-4 font-medium">
                    ✓ Présences enregistrées avec succès
                </div>
            )}

            {/* Liste des membres */}
            {chargement ? (
                <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4, 5].map((i) => <SkeletonMembre key={i} />)}
                </div>
            ) : membres.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p className="font-medium">Aucun membre dans cette organisation.</p>
                    <Link to="/membres/nouveau" className="inline-block mt-4 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-secondary transition-colors">
                        Ajouter un membre
                    </Link>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-2 mb-6">
                        {membres.map((membre) => {
                            const statut  = statuts[membre.id]
                            const present = statut === "present"
                            const absent  = statut === "absent"

                            return (
                                <div
                                    key={membre.id}
                                    className={`bg-white border rounded-2xl px-4 py-3 flex items-center gap-3 transition-colors ${
                                        present ? "border-success/40 bg-success/5"
                                        : absent  ? "border-gray-100"
                                        : "border-gray-100"
                                    }`}
                                >
                                    <InitialeAvatar nom={membre.nom} prenom={membre.prenom} />

                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-dark truncate">
                                            {membre.prenom} {membre.nom}
                                        </p>
                                        {membre.telephone && (
                                            <p className="text-xs text-gray-400">{membre.telephone}</p>
                                        )}
                                    </div>

                                    {/* Boutons Présent / Absent */}
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => toggleStatut(membre.id, "present")}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                                                present
                                                    ? "bg-success text-white"
                                                    : "bg-gray-100 text-gray-400 hover:bg-success/10 hover:text-success"
                                            }`}
                                        >
                                            <span className="w-3.5 h-3.5">{IconCheck}</span>
                                            Présent
                                        </button>
                                        <button
                                            onClick={() => toggleStatut(membre.id, "absent")}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                                                absent
                                                    ? "bg-danger text-white"
                                                    : "bg-gray-100 text-gray-400 hover:bg-danger/10 hover:text-danger"
                                            }`}
                                        >
                                            <span className="w-3.5 h-3.5">{IconX}</span>
                                            Absent
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Bouton d'enregistrement sticky */}
                    <div className="sticky bottom-4">
                        <button
                            onClick={handleEnregistrer}
                            disabled={enregistrement || membres.length === 0}
                            className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-2xl py-3.5 text-sm font-semibold shadow-lg shadow-primary/30 hover:bg-secondary transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <span className="w-5 h-5">{IconSave}</span>
                            {enregistrement
                                ? "Enregistrement..."
                                : `Enregistrer les présences (${presents} présent${presents > 1 ? "s" : ""})`
                            }
                        </button>
                    </div>
                </>
            )}

        </DashboardLayout>
    )
}
