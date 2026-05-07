import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logoprimary from "../assets/logoprimary.png"
import loginImage from "../assets/image-login-bm.jpg"
import { login } from "../api/auth/auth"

export default function Login() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const [erreur, setErreur] = useState(null)
    const [chargement, setChargement] = useState(false)

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setErreur(null)
        setChargement(true)
        try {
            const data = await login(form)
            localStorage.setItem("token", data.token)
            navigate("/dashboard")
        } catch (err) {
            setErreur(err.response?.data?.message || "Email ou mot de passe incorrect.")
        } finally {
            setChargement(false)
        }
    }

    return (
        <div className="w-screen h-screen flex">

            {/* Côté gauche — image + branding */}
            <div className="hidden md:flex w-1/2 relative">
                <img src={loginImage} className="w-full h-full object-cover" alt="illustration" />
                <div className="absolute inset-0 bg-primary/80 flex flex-col justify-center items-center text-white p-10">
                    <img src={logoprimary} className="w-70 mb-6 invert" alt="logo" />
                    <h1 className="text-3xl font-bold text-center">Bienvenue sur BuildMembres</h1>
                    <p className="text-center mt-3 opacity-75">Gérez vos membres et cotisations facilement.</p>
                </div>
            </div>

            {/* Côté droit — formulaire */}
            <div className="flex-1 bg-surface flex justify-center items-center p-8">
                <div className="w-full max-w-md">

                    {/* Logo visible uniquement sur mobile */}
                    <div className="flex flex-col items-center mb-8 md:hidden">
                        <img src={logoprimary} className="w-50 mb-3" alt="logo" />
                        <h1 className="text-xl font-bold text-primary">BuildMembres</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Gérez vos membres et cotisations</p>
                    </div>

                    <h2 className="text-3xl font-bold text-primary mb-1">Se connecter</h2>
                    <p className="text-gray-500 mb-8 text-sm">Entrez vos identifiants pour accéder à votre espace</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-dark">Email</label>
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                type="email"
                                placeholder="jean@example.com"
                                className="border border-gray-300 rounded-md p-2 outline-primary focus:border-primary"
                            />
                        </div>

                        {/* Mot de passe */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-dark">Mot de passe</label>
                            <input
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                type="password"
                                placeholder="••••••••"
                                className="border border-gray-300 rounded-md p-2 outline-primary focus:border-primary"
                            />
                            <a href="#" className="text-xs text-primary hover:underline self-end mt-1">
                                Mot de passe oublié ?
                            </a>
                        </div>

                        {/* Message d'erreur */}
                        {erreur && (
                            <p className="text-danger text-sm text-center">{erreur}</p>
                        )}

                        {/* Bouton */}
                        <button
                            type="submit"
                            disabled={chargement}
                            className="bg-primary text-white rounded-md p-2 font-semibold mt-2 hover:bg-secondary transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {chargement ? "Connexion en cours..." : "Se connecter"}
                        </button>

                        {/* Lien vers register */}
                        <p className="text-center text-sm text-gray-500">
                            Pas encore de compte ?{" "}
                            <Link to="/register" className="text-primary font-semibold hover:underline">
                                S'inscrire
                            </Link>
                        </p>

                    </form>
                </div>
            </div>

        </div>
    )
}
