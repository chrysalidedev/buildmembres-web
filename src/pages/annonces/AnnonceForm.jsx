import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import { getAnnonces, createAnnonce, updateAnnonce } from "../../api/annonces"

const IconArrowLeft = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
)

const types = [
    { value: "information", label: "Information générale" },
    { value: "reunion",     label: "Réunion" },
    { value: "cotisation",  label: "Rappel de cotisation" },
    { value: "autre",       label: "Autre" },
]

const champsVides = { titre: "", contenu: "", type: "information" }

export default function AnnonceForm() {
    const navigate    = useNavigate()
    const { id }      = useParams()
    const modeEdition = Boolean(id)

    const [form, setForm]                     = useState(champsVides)
    const [erreur, setErreur]                 = useState(null)
    const [chargement, setChargement]         = useState(false)
    const [chargementInit, setChargementInit] = useState(modeEdition)

    useEffect(() => {
        if (!modeEdition) return
        async function charger() {
            try {
                // On récupère la liste et on filtre par id (pas de route show pour les annonces)
                const data     = await getAnnonces()
                const annonce  = (data.annonces ?? []).find((a) => a.id === parseInt(id))
                if (!annonce) { setErreur("Annonce introuvable."); return }
                setForm({ titre: annonce.titre, contenu: annonce.contenu, type: annonce.type })
            } catch {
                setErreur("Impossible de charger l'annonce.")
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
                await updateAnnonce(id, form)
            } else {
                await createAnnonce(form)
            }
            navigate("/annonces")
        } catch (err) {
            setErreur(err.response?.data?.message || "Une erreur est survenue.")
        } finally {
            setChargement(false)
        }
    }

    const inputClass = "border border-gray-200 rounded-xl p-2.5 outline-primary focus:border-primary text-sm bg-white"
    const labelClass = "text-sm font-medium text-dark"

    if (chargementInit) {
        return (
            <DashboardLayout>
                <div className="flex flex-col gap-4 animate-pulse max-w-2xl mx-auto pt-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3" />
                    <div className="h-48 bg-gray-100 rounded-2xl" />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="flex items-center gap-3 mb-6">
                <Link
                    to="/annonces"
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    {IconArrowLeft}
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-dark">
                        {modeEdition ? "Modifier l'annonce" : "Publier une annonce"}
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {modeEdition ? "Modifiez le contenu de l'annonce" : "Rédigez et publiez une information pour votre organisation"}
                    </p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Type d'annonce <span className="text-danger">*</span></label>
                        <div className="grid grid-cols-2 gap-2">
                            {types.map((t) => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setForm((prev) => ({ ...prev, type: t.value }))}
                                    className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors cursor-pointer text-left ${
                                        form.type === t.value
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Titre <span className="text-danger">*</span></label>
                        <input
                            name="titre"
                            value={form.titre}
                            onChange={handleChange}
                            type="text"
                            placeholder="Ex : Rappel — cotisation du mois de Mai"
                            required
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Contenu <span className="text-danger">*</span></label>
                        <textarea
                            name="contenu"
                            value={form.contenu}
                            onChange={handleChange}
                            rows={6}
                            placeholder="Rédigez le contenu de votre annonce..."
                            required
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    {erreur && (
                        <p className="text-danger text-sm bg-danger/5 px-4 py-2 rounded-xl">{erreur}</p>
                    )}

                    <div className="flex gap-3 mt-2">
                        <Link
                            to="/annonces"
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
                                ? "Publication..."
                                : modeEdition ? "Enregistrer les modifications" : "Publier l'annonce"
                            }
                        </button>
                    </div>

                </form>
            </div>
        </DashboardLayout>
    )
}
