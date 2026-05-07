import { Link, useLocation, useNavigate } from "react-router-dom"

const navLinks = [
    { to: "/admin/dashboard",      label: "Vue globale" },
    { to: "/admin/organisations",  label: "Organisations" },
]

export default function AdminLayout({ children }) {
    const location = useLocation()
    const navigate = useNavigate()

    function deconnexion() {
        sessionStorage.removeItem("admin_key")
        navigate("/admin/login")
    }

    return (
        <div className="min-h-screen bg-gray-950">
            <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm leading-tight">Build-Membres</p>
                        <p className="text-indigo-400 text-xs font-medium">Super Admin</p>
                    </div>
                </div>

                <nav className="flex items-center gap-1">
                    {navLinks.map((link) => {
                        const actif = location.pathname === link.to
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    actif
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                                }`}
                            >
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>

                <button
                    onClick={deconnexion}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Quitter
                </button>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}
