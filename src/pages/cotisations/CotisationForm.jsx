import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import { getCotisation, createCotisation, updateCotisation } from "../../api/cotisations"

const IconArrowLeft = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
)

const champsVides = {
    nom: "",
    montant: "",
    periodicite: "mensuel",
    date_debut: new Date().toISOString().split("T")[0],
    date_fin: "",
    description: ""
}

export default function CotisationForm() {
    const { id }    = useParams()
    const navigate  = useNavigate()
    const isEditing = Boolean(id)

    const [form, setForm]             = useState(champsVides)
    const [erreur, setErreur]         = useState(null)
    const [chargement, setChargement] = useState(false)

    useEffect(() => {
        if (!isEditing) return
        async function charger() {
            try {
                const data = await getCotisation(id)
                setForm(data.cotisation ?? data)
            } catch {
                setErreur("Impossible de charger les données.")
            }
        }
        charger()
    }, [id, isEditing])

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setErreur(null)
        setChargement(true)
        try {
            if (isEditing) {
                await updateCotisation(id, form)
            } else {
                await createCotisation(form)
            }
            navigate("/cotisations")
        } catch (err) {
            setErreur(err.response?.data?.message || "Une erreur est survenue.")
        } finally {
            setChargement(false)
        }
    }

    const inputClass = "border border-gray-200 rounded-xl p-2.5 outline-primary focus:border-primary text-sm bg-white"
    const labelClass = "text-sm font-medium text-dark"

    return (
        <DashboardLayout>
            <div className="flex items-center gap-3 mb-6">
                <Link to="/cotisations" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                    {IconArrowLeft}
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-dark">
                        {isEditing ? "Modifier la cotisation" : "Nouvelle cotisation"}
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {isEditing ? "Modifiez les informations ci-dessous" : "Définissez une nouvelle cotisation pour votre organisation"}
                    </p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Nom — pleine largeur */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className={labelClass}>Nom de la cotisation <span className="text-danger">*</span></label>
                        <input name="nom" value={form.nom} onChange={handleChange} type="text" placeholder="Social 2026" required className={inputClass} />
                    </div>

                    {/* Montant | Périodicité */}
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Montant (FCFA) <span className="text-danger">*</span></label>
                        <input name="montant" value={form.montant} onChange={handleChange} type="number" min="0" placeholder="500" required className={inputClass} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Périodicité <span className="text-danger">*</span></label>
                        <select name="periodicite" value={form.periodicite} onChange={handleChange} className={inputClass}>
                            <option value="mensuel">Mensuel</option>
                            <option value="trimestriel">Trimestriel</option>
                            <option value="semestriel">Semestriel</option>
                            <option value="annuel">Annuel</option>
                        </select>
                    </div>

                    {/* Date début | Date fin */}
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Date de début <span className="text-danger">*</span></label>
                        <input name="date_debut" value={form.date_debut} onChange={handleChange} type="date" required className={inputClass} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Date de fin <span className="text-gray-400 font-normal">(optionnel)</span></label>
                        <input name="date_fin" value={form.date_fin ?? ""} onChange={handleChange} type="date" className={inputClass} />
                    </div>

                    {/* Description — pleine largeur */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className={labelClass}>Description <span className="text-gray-400 font-normal">(optionnel)</span></label>
                        <textarea name="description" value={form.description ?? ""} onChange={handleChange} rows={3} placeholder="Informations complémentaires..." className={`${inputClass} resize-none`} />
                    </div>

                    {erreur && <p className="md:col-span-2 text-danger text-sm">{erreur}</p>}

                    <div className="md:col-span-2 flex gap-3 mt-2">
                        <Link to="/cotisations" className="flex-1 text-center border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors">
                            Annuler
                        </Link>
                        <button type="submit" disabled={chargement} className="flex-1 bg-primary text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-secondary transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                            {chargement ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer la cotisation"}
                        </button>
                    </div>

                </form>
            </div>
        </DashboardLayout>
    )
}
