import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import { createMembre, updateMembre, getMembre } from "../../api/members/membres"

const IconArrowLeft = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
)

const champsVides = {
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    date_naissance: "",
    sexe: "M",
    adresse: "",
    statut: "actif"
}

export default function MembreForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditing = Boolean(id)

    const [form, setForm] = useState(champsVides)
    const [erreur, setErreur] = useState(null)
    const [chargement, setChargement] = useState(false)

    // Si on est en mode édition, on charge les données du membre
    useEffect(() => {
        if (!isEditing) return

        async function chargerMembre() {
            try {
                const data = await getMembre(id)
                setForm(data.member ?? data)
            } catch {
                setErreur("Impossible de charger les données du membre.")
            }
        }
        chargerMembre()
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
                await updateMembre(id, form)
            } else {
                await createMembre(form)
            }
            navigate("/membres")
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
            {/* En-tête de page */}
            <div className="flex items-center gap-3 mb-6">
                <Link
                    to="/membres"
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    {IconArrowLeft}
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-dark">
                        {isEditing ? "Modifier le membre" : "Ajouter un membre"}
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {isEditing ? "Modifiez les informations ci-dessous" : "Remplissez les informations du nouveau membre"}
                    </p>
                </div>
            </div>

            {/* Formulaire */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Nom | Prénom */}
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Nom <span className="text-danger">*</span></label>
                        <input
                            name="nom"
                            value={form.nom}
                            onChange={handleChange}
                            type="text"
                            placeholder="AKA"
                            required
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Prénom <span className="text-danger">*</span></label>
                        <input
                            name="prenom"
                            value={form.prenom}
                            onChange={handleChange}
                            type="text"
                            placeholder="Jean Jacques"
                            required
                            className={inputClass}
                        />
                    </div>

                    {/* Email | Téléphone */}
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Email</label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="jean@example.com"
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Téléphone <span className="text-danger">*</span></label>
                        <input
                            name="telephone"
                            value={form.telephone}
                            onChange={handleChange}
                            type="tel"
                            placeholder="05 05 20 66 04"
                            className={inputClass}
                            required
                        />
                    </div>

                    {/* Date de naissance | Sexe */}
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Date de naissance <span className="text-danger">*</span></label>
                        <input
                            name="date_naissance"
                            value={form.date_naissance}
                            onChange={handleChange}
                            type="date"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Sexe <span className="text-danger">*</span></label>
                        <select
                            name="sexe"
                            value={form.sexe}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        >
                            <option value="M">Masculin</option>
                            <option value="F">Féminin</option>
                        </select>
                    </div>

                    {/* Adresse — pleine largeur */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className={labelClass}>Adresse <span className="text-danger">*</span></label>
                        <input
                            name="adresse"
                            value={form.adresse}
                            onChange={handleChange}
                            type="text"
                            placeholder="Abidjan, Cocody"
                            className={inputClass}
                            required
                        />
                    </div>

                    {/* Statut */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className={labelClass}>Statut</label>
                        <div className="flex gap-3">
                            {["actif", "inactif"].map((val) => (
                                <label
                                    key={val}
                                    className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-2.5 text-sm font-medium cursor-pointer transition-colors ${form.statut === val
                                        ? val === "actif"
                                            ? "bg-success/10 border-success text-success"
                                            : "bg-gray-100 border-gray-300 text-gray-500"
                                        : "border-gray-200 text-gray-400 hover:bg-gray-50"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="statut"
                                        value={val}
                                        checked={form.statut === val}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    {val === "actif" ? "✓ Actif" : "Inactif"}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Message d'erreur — pleine largeur */}
                    {erreur && (
                        <p className="md:col-span-2 text-danger text-sm">{erreur}</p>
                    )}

                    {/* Boutons — pleine largeur */}
                    <div className="md:col-span-2 flex gap-3 mt-2">
                        <Link
                            to="/membres"
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
                                ? "Enregistrement..."
                                : isEditing ? "Enregistrer les modifications" : "Ajouter le membre"
                            }
                        </button>
                    </div>

                </form>
            </div>
        </DashboardLayout>
    )
}
