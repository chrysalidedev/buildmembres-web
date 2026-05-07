import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import logoprimary from "../assets/logoprimary.png"

// TODO: remplacer par les vraies données du token JWT
const mockOrg = { name: "Providence Asso" }

const IconLogout = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
)

const navLinks = [
    { to: "/dashboard",   label: "Tableau de bord" },
    { to: "/membres",     label: "Membres" },
    { to: "/cotisations", label: "Cotisations" },
    { to: "/paiements",   label: "Paiements" },
    { to: "/evenements",  label: "Réunions" },
    { to: "/annonces",    label: "Annonces" },
]

function ModalDeconnexion({ onConfirmer, onAnnuler }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
                onClick={onAnnuler}
            />

            {/* Carte */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
                {/* Icône */}
                <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mx-auto">
                    <div className="w-6 h-6 text-danger">{IconLogout}</div>
                </div>

                {/* Texte */}
                <div className="text-center">
                    <h2 className="text-lg font-bold text-dark">Déconnexion</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Êtes-vous sûr de vouloir vous déconnecter ?
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-1">
                    <button
                        onClick={onAnnuler}
                        className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirmer}
                        className="flex-1 bg-danger text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-red-600 transition-colors cursor-pointer"
                    >
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function DashboardLayout({ children }) {
    const navigate  = useNavigate()
    const location  = useLocation()
    const [showModal, setShowModal] = useState(false)

    const today = new Date().toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long"
    })

    function confirmerDeconnexion() {
        localStorage.removeItem("token")
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-primary text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={logoprimary} className="w-8 invert" alt="logo" />
                    <div>
                        <p className="font-bold text-base leading-tight">{mockOrg.name}</p>
                        <p className="text-xs opacity-60 capitalize">{today}</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const actif = location.pathname === link.to
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    actif
                                        ? "bg-white/20 text-white"
                                        : "text-white/70 hover:text-white hover:bg-white/10"
                                }`}
                            >
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 text-sm opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                >
                    <div className="w-5 h-5">{IconLogout}</div>
                    <span className="hidden sm:inline">Déconnexion</span>
                </button>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {children}
            </main>

            {showModal && (
                <ModalDeconnexion
                    onConfirmer={confirmerDeconnexion}
                    onAnnuler={() => setShowModal(false)}
                />
            )}
        </div>
    )
}
