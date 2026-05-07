import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import { createPaiement } from "../../api/paiements"
import { getMembres } from "../../api/members/membres"
import { getCotisations } from "../../api/cotisations"

const IconArrowLeft = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
)

const champsVides = {
    member_id: "",
    cotisation_id: "",
    montant: "",
    date_paiement: new Date().toISOString().split("T")[0],
    periode: new Date().toISOString().slice(0, 7),
    mode_paiement: "mobile_money",
    note: ""
}

export default function PaiementForm() {
    const navigate = useNavigate()

    const [form, setForm]             = useState(champsVides)
    const [membres, setMembres]       = useState([])
    const [cotisations, setCotisations] = useState([])
    const [erreur, setErreur]         = useState(null)
    const [chargement, setChargement] = useState(false)

    // Charger membres et cotisations au montage
    useEffect(() => {
        async function chargerOptions() {
            try {
                const [dataMembres, dataCotisations] = await Promise.all([
                    getMembres(),
                    getCotisations()
                ])
                setMembres(dataMembres.members ?? [])
                setCotisations(dataCotisations.cotisations ?? [])
            } catch {
                setErreur("Impossible de charger les données.")
            }
        }
        chargerOptions()
    }, [])

    function handleChange(e) {
        const { name, value } = e.target
        let updates = { [name]: value }

        // Auto-remplir le montant quand on choisit une cotisation
        if (name === "cotisation_id") {
            const cotisation = cotisations.find((c) => c.id === parseInt(value))
            if (cotisation) updates.montant = cotisation.montant
        }

        // Auto-générer la période depuis la date ("2026-05-06" → "2026-05")
        if (name === "date_paiement" && value) {
            updates.periode = value.slice(0, 7)
        }

        setForm({ ...form, ...updates })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setErreur(null)
        setChargement(true)
        try {
            await createPaiement(form)
            navigate("/paiements")
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
                <Link to="/paiements" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                    {IconArrowLeft}
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-dark">Enregistrer un paiement</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Remplissez les informations du paiement</p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Membre — pleine largeur */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className={labelClass}>Membre <span className="text-danger">*</span></label>
                        <select name="member_id" value={form.member_id} onChange={handleChange} required className={inputClass}>
                            <option value="">-- Sélectionner un membre --</option>
                            {membres.map((m) => (
                                <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>
                            ))}
                        </select>
                    </div>

                    {/* Cotisation — pleine largeur */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className={labelClass}>Cotisation <span className="text-danger">*</span></label>
                        <select name="cotisation_id" value={form.cotisation_id} onChange={handleChange} required className={inputClass}>
                            <option value="">-- Sélectionner une cotisation --</option>
                            {cotisations.map((c) => (
                                <option key={c.id} value={c.id}>{c.nom} — {parseFloat(c.montant).toLocaleString("fr-FR")} FCFA</option>
                            ))}
                        </select>
                    </div>

                    {/* Montant | Mode de paiement */}
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Montant (FCFA) <span className="text-danger">*</span></label>
                        <input name="montant" value={form.montant} onChange={handleChange} type="number" min="0" placeholder="500" required className={inputClass} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Mode de paiement <span className="text-danger">*</span></label>
                        <select name="mode_paiement" value={form.mode_paiement} onChange={handleChange} required className={inputClass}>
                            <option value="mobile_money">Mobile Money</option>
                            <option value="especes">Espèces</option>
                            <option value="virement">Virement</option>
                            <option value="cheque">Chèque</option>
                        </select>
                    </div>

                    {/* Date de paiement | Période */}
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Date du paiement <span className="text-danger">*</span></label>
                        <input name="date_paiement" value={form.date_paiement} onChange={handleChange} type="date" required className={inputClass} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Période couverte</label>
                        <input name="periode" value={form.periode} onChange={handleChange} type="month" className={inputClass} />
                        <p className="text-xs text-gray-400 mt-1">Auto-rempli depuis la date</p>
                    </div>

                    {/* Note — pleine largeur */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className={labelClass}>Note <span className="text-gray-400 font-normal">(optionnel)</span></label>
                        <textarea name="note" value={form.note} onChange={handleChange} rows={2} placeholder="Remarque sur ce paiement..." className={`${inputClass} resize-none`} />
                    </div>

                    {erreur && <p className="md:col-span-2 text-danger text-sm">{erreur}</p>}

                    <div className="md:col-span-2 flex gap-3 mt-2">
                        <Link to="/paiements" className="flex-1 text-center border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors">
                            Annuler
                        </Link>
                        <button type="submit" disabled={chargement} className="flex-1 bg-primary text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-secondary transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                            {chargement ? "Enregistrement..." : "Enregistrer le paiement"}
                        </button>
                    </div>

                </form>
            </div>
        </DashboardLayout>
    )
}
