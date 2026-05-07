import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import { createEvenement, updateEvenement, getEvenement } from "../../api/evenements"

const IconArrowLeft = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
)

const champsVides = {
    titre:       "",
    description: "",
    date_event:  "",
    lieu:        "",
}

export default function EvenementForm() {
    const navigate      = useNavigate()
    const { id }        = useParams()
    const modeEdition   = Boolean(id)

    const [form, setForm]               = useState(champsVides)
    const [erreur, setErreur]           = useState(null)
    const [chargement, setChargement]   = useState(false)
    const [chargementInit, setChargementInit] = useState(modeEdition)

    useEffect(() => {
        if (!modeEdition) return
        async function charger() {
            try {
                const data = await getEvenement(id)
                const ev   = data.evenement
                setForm({
                    titre:       ev.titre       ?? "",
                    description: ev.description ?? "",
                    // L'API retourne "2026-05-06 10:00" → on reformate pour <input type="datetime-local">
                    date_event:  ev.date_event?.replace(" ", "T").slice(0, 16) ?? "",
                    lieu:        ev.lieu        ?? "",
                })
            } catch {
                setErreur("Impossible de charger la réunion.")
            } finally {
                setChargementInit(false)
            }
        }
        charger()
    }, [id, modeEdition])

    function handleChange(e) {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setErreur(null)
        setChargement(true)
        try {
            if (modeEdition) {
                await updateEvenement(id, form)
            } else {
                await createEvenement(form)
            }
            navigate("/evenements")
        } catch (err) {
            setErreur(err.response?.data?.message || "Une erreur est survenue.")
        } finally {
            setChargement(false)
        }
    }

    const inputClass  = "border border-gray-200 rounded-xl p-2.5 outline-primary focus:border-primary text-sm bg-white"
    const labelClass  = "text-sm font-medium text-dark"

    if (chargementInit) {
        return (
            <DashboardLayout>
                <div className="flex flex-col gap-4 animate-pulse max-w-2xl mx-auto pt-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3" />
                    <div className="h-64 bg-gray-100 rounded-2xl" />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="flex items-center gap-3 mb-6">
                <Link
                    to="/evenements"
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    {IconArrowLeft}
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-dark">
                        {modeEdition ? "Modifier la réunion" : "Nouvelle réunion"}
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {modeEdition ? "Modifiez les informations de la réunion" : "Planifiez une réunion pour votre organisation"}
                    </p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Titre <span className="text-danger">*</span></label>
                        <input
                            name="titre"
                            value={form.titre}
                            onChange={handleChange}
                            type="text"
                            placeholder="Ex : Réunion mensuelle de Mai"
                            required
                            className={inputClass}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Date et heure <span className="text-danger">*</span></label>
                            <input
                                name="date_event"
                                value={form.date_event}
                                onChange={handleChange}
                                type="datetime-local"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Lieu <span className="text-gray-400 font-normal">(optionnel)</span></label>
                            <input
                                name="lieu"
                                value={form.lieu}
                                onChange={handleChange}
                                type="text"
                                placeholder="Ex : Salle paroissiale"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Description <span className="text-gray-400 font-normal">(optionnel)</span></label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ordre du jour, informations supplémentaires..."
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    {erreur && (
                        <p className="text-danger text-sm bg-danger/5 px-4 py-2 rounded-xl">{erreur}</p>
                    )}

                    <div className="flex gap-3 mt-2">
                        <Link
                            to="/evenements"
                            className="flex-1 text-center border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </Link>
                        <button
                            type="submit"
                            disabled={chargement}
                            className="flex-1 bg-primary text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-secondary transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {chargement
                                ? (modeEdition ? "Enregistrement..." : "Création...")
                                : (modeEdition ? "Enregistrer les modifications" : "Créer la réunion")
                            }
                        </button>
                    </div>

                </form>
            </div>
        </DashboardLayout>
    )
}
