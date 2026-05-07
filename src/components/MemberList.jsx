import { useNavigate } from "react-router-dom"

function InitialeAvatar({ prenom, nom }) {
    const initiale = (prenom || nom || "?").charAt(0).toUpperCase()
    return (
        <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center text-danger font-bold text-sm shrink-0">
            {initiale}
        </div>
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <p className="font-semibold text-gray-600">Tout le monde est à jour !</p>
                <p className="text-sm text-gray-400 mt-0.5">Aucun membre en retard de cotisation.</p>
            </div>
        </div>
    )
}

export default function MemberList({ members }) {
    const navigate = useNavigate()

    if (!members || members.length === 0) return <EmptyState />

    return (
        <div className="flex flex-col gap-2">
            {members.map((member) => (
                <div
                    key={member.id}
                    className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-gray-200 transition-colors"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <InitialeAvatar prenom={member.prenom} nom={member.nom} />
                        <div className="min-w-0">
                            <p className="font-medium text-dark truncate">
                                {member.prenom} {member.nom}
                            </p>
                            <p className="text-xs text-danger mt-0.5">En retard de cotisation</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/paiements/nouveau`)}
                        className="shrink-0 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer ml-3"
                    >
                        Enregistrer
                    </button>
                </div>
            ))}
        </div>
    )
}
