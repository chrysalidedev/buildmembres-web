import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logoprimary from "../assets/logoprimary.png"
import loginImage from "../assets/image-login-bm.jpg"
import { register } from "../api/auth/auth"

export default function Register() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        organization: {
            name: "",
            type: "",
            ville: ""
        },
        user: {
            name: "",
            email: "",
            password: "",
            password_confirmation: ""
        }
    })

    const [erreur, setErreur] = useState(null)
    const [chargement, setChargement] = useState(false)
    const [succes, setSucces] = useState(null)

    // section = "organization" ou "user"
    function handleChange(section, e) {
        setForm({
            ...form,
            [section]: {
                ...form[section],
                [e.target.name]: e.target.value
            }
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setErreur(null)

        if (form.user.password !== form.user.password_confirmation) {
            setErreur("Les mots de passe ne correspondent pas.")
            return
        }

        setChargement(true)
        try {
            const data = await register(form)
            setSucces(data)
            setTimeout(() => navigate("/login"), 3000)
        } catch (err) {
            setErreur(err.response?.data?.message || "Une erreur est survenue.")
        } finally {
            setChargement(false)
        }
    }

    const inputClass = "border border-gray-300 rounded-md p-2 outline-primary focus:border-primary"
    const labelClass = "text-sm font-medium text-dark"

    return (
        <div className="w-screen h-screen flex">

            {/* Côté gauche — image + branding */}
            <div className="hidden md:flex w-1/2 relative">
                <img src={loginImage} className="w-full h-full object-cover" alt="illustration" />
                <div className="absolute inset-0 bg-primary/80 flex flex-col justify-center items-center text-white p-10">
                    <img src={logoprimary} className="w-28 mb-6 invert" alt="logo" />
                    <h1 className="text-3xl font-bold text-center">Bienvenue sur BuildMembres</h1>
                    <p className="text-center mt-3 opacity-75">Gérez vos membres et cotisations facilement.</p>
                </div>
            </div>

            {/* Côté droit — formulaire (défilable) */}
            <div className="flex-1 bg-surface flex justify-center items-start overflow-y-auto p-8">
                <div className="w-full max-w-md py-8">

                    {/* Écran de succès */}
                    {succes ? (
                        <div className="flex flex-col items-center gap-4 text-center py-10">
                            <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center">
                                <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-primary">{succes.message}</h2>
                            <p className="text-gray-500 text-sm">
                                Bienvenue <span className="font-semibold text-dark">{succes.user.name}</span> !<br />
                                Votre organisation <span className="font-semibold text-dark">{succes.organization.name}</span> a bien été créée.
                            </p>
                            <p className="text-xs text-gray-400">Redirection vers la connexion dans 3 secondes...</p>
                            <Link to="/login" className="text-primary text-sm font-semibold hover:underline">
                                Se connecter maintenant
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold text-primary mb-1">Créer un compte</h2>
                            <p className="text-gray-500 mb-8 text-sm">Remplissez les informations ci-dessous</p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                                {/* Section Organisation */}
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-2 rounded-md">
                                        Organisation
                                    </h3>

                                    <div className="flex flex-col gap-1">
                                        <label className={labelClass}>Nom de l'organisation</label>
                                        <input
                                            name="name"
                                            value={form.organization.name}
                                            onChange={(e) => handleChange("organization", e)}
                                            type="text"
                                            placeholder="Providence Asso"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex flex-col gap-1 flex-1">
                                            <label className={labelClass}>Type</label>
                                            <select
                                                name="type"
                                                value={form.organization.type}
                                                onChange={(e) => handleChange("organization", e)}
                                                className={inputClass}
                                            >
                                                <option value="">-- Choisir --</option>
                                                <option value="ong">ONG</option>
                                                <option value="association">Association</option>
                                                <option value="cooperative">Coopérative</option>
                                                <option value="fondation">Fondation</option>
                                            </select>
                                        </div>

                                        <div className="flex flex-col gap-1 flex-1">
                                            <label className={labelClass}>Ville</label>
                                            <input
                                                name="ville"
                                                value={form.organization.ville}
                                                onChange={(e) => handleChange("organization", e)}
                                                type="text"
                                                placeholder="Abidjan"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section Administrateur */}
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-2 rounded-md">
                                        Administrateur
                                    </h3>

                                    <div className="flex flex-col gap-1">
                                        <label className={labelClass}>Nom complet</label>
                                        <input
                                            name="name"
                                            value={form.user.name}
                                            onChange={(e) => handleChange("user", e)}
                                            type="text"
                                            placeholder="Essis Cedric"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className={labelClass}>Email</label>
                                        <input
                                            name="email"
                                            value={form.user.email}
                                            onChange={(e) => handleChange("user", e)}
                                            type="email"
                                            placeholder="cedric@gmail.com"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className={labelClass}>Mot de passe</label>
                                        <input
                                            name="password"
                                            value={form.user.password}
                                            onChange={(e) => handleChange("user", e)}
                                            type="password"
                                            placeholder="••••••••"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className={labelClass}>Confirmer le mot de passe</label>
                                        <input
                                            name="password_confirmation"
                                            value={form.user.password_confirmation}
                                            onChange={(e) => handleChange("user", e)}
                                            type="password"
                                            placeholder="••••••••"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                {/* Message d'erreur */}
                                {erreur && (
                                    <p className="text-danger text-sm text-center">{erreur}</p>
                                )}

                                {/* Bouton */}
                                <button
                                    type="submit"
                                    disabled={chargement}
                                    className="bg-primary text-white rounded-md p-2 font-semibold hover:bg-secondary transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {chargement ? "Inscription en cours..." : "S'inscrire"}
                                </button>

                                {/* Lien vers login */}
                                <p className="text-center text-sm text-gray-500">
                                    Déjà un compte ?{" "}
                                    <Link to="/login" className="text-primary font-semibold hover:underline">
                                        Se connecter
                                    </Link>
                                </p>

                            </form>
                        </>
                    )}

                </div>
            </div>

        </div>
    )
}
