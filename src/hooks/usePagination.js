import { useSearchParams } from "react-router-dom"

/**
 * Lit `?page=N` depuis l'URL et fournit une fonction pour changer de page.
 * Retourne aussi `scrollToTop` appelé automatiquement à chaque changement.
 */
export default function usePagination() {
    const [searchParams, setSearchParams] = useSearchParams()
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))

    function goToPage(newPage) {
        setSearchParams({ page: newPage })
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return { page, goToPage }
}
