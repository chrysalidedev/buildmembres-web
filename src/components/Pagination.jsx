const IconChevronLeft = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
)
const IconChevronRight = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
)

function pages(current, last) {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)

    const result = []
    result.push(1)

    if (current > 3) result.push("…")

    const from = Math.max(2, current - 1)
    const to   = Math.min(last - 1, current + 1)
    for (let i = from; i <= to; i++) result.push(i)

    if (current < last - 2) result.push("…")

    result.push(last)
    return result
}

export default function Pagination({ pagination, onPageChange }) {
    if (!pagination || pagination.last_page <= 1) return null

    const { current_page, last_page, total, per_page } = pagination
    const debut = (current_page - 1) * per_page + 1
    const fin   = Math.min(current_page * per_page, total)

    const btnBase    = "w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors"
    const btnActif   = "bg-primary text-white"
    const btnNormal  = "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
    const btnDisable = "bg-white border border-gray-100 text-gray-300 cursor-not-allowed"

    return (
        <div className="flex flex-col items-center gap-3 mt-6">
            <p className="text-xs text-gray-400">
                {debut}–{fin} sur {total} résultat{total > 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-1">
                {/* Précédent */}
                <button
                    onClick={() => onPageChange(current_page - 1)}
                    disabled={current_page === 1}
                    className={`${btnBase} ${current_page === 1 ? btnDisable : btnNormal}`}
                >
                    <span className="w-4 h-4">{IconChevronLeft}</span>
                </button>

                {/* Pages */}
                {pages(current_page, last_page).map((p, i) =>
                    p === "…" ? (
                        <span key={`ellipsis-${i}`} className="w-9 text-center text-gray-400 text-sm">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`${btnBase} ${p === current_page ? btnActif : btnNormal}`}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Suivant */}
                <button
                    onClick={() => onPageChange(current_page + 1)}
                    disabled={current_page === last_page}
                    className={`${btnBase} ${current_page === last_page ? btnDisable : btnNormal}`}
                >
                    <span className="w-4 h-4">{IconChevronRight}</span>
                </button>
            </div>
        </div>
    )
}
