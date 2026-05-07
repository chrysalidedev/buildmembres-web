import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { adminLogin } from "../../api/superadmin"

export default function AdminLogin() {
    const navigate = useNavigate()
    const [key, setKey] = useState("")
    const [erreur, setErreur] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setErreur("")
        setLoading(true)
        try {
            await adminLogin(key.trim())
            sessionStorage.setItem("admin_key", key.trim())
            navigate("/admin/dashboard")
        } catch {
            setErreur("Clé incorrecte ou accès refusé.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-white text-xl font-bold">Espace Super Admin</h1>
                    <p className="text-gray-500 text-sm mt-1">Build-Membres · Accès restreint</p>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5">
                            Clé d'accès
                        </label>
                        <input
                            type="password"
                            value={key}
                            onChange={e => setKey(e.target.value)}
                            placeholder="••••••••••••••••"
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors placeholder-gray-600"
                            required
                        />
                    </div>

                    {erreur && (
                        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                            {erreur}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition-colors cursor-pointer"
                    >
                        {loading ? "Vérification…" : "Accéder"}
                    </button>
                </form>
            </div>
        </div>
    )
}
