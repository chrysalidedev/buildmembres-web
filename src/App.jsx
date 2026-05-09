import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import WhatsAppButton from "./components/WhatsAppButton"
import Landing from "./pages/Landing"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminOrganisations from "./pages/admin/AdminOrganisations"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import MembresListe from "./pages/membres/MembresListe"
import MembreForm from "./pages/membres/MembreForm"
import CotisationsListe from "./pages/cotisations/CotisationsListe"
import CotisationForm from "./pages/cotisations/CotisationForm"
import PaiementsListe from "./pages/paiements/PaiementsListe"
import PaiementForm from "./pages/paiements/PaiementForm"
import PaiementsMembre from "./pages/paiements/PaiementsMembre"
import EvenementsListe from "./pages/evenements/EvenementsListe"
import EvenementForm from "./pages/evenements/EvenementForm"
import EvenementPresences from "./pages/evenements/EvenementPresences"
import AnnoncesListe from "./pages/annonces/AnnoncesListe"
import AnnonceForm from "./pages/annonces/AnnonceForm"

// Redirige vers /dashboard si déjà connecté, sinon affiche la page publique
function PublicRoute({ children }) {
    const token = localStorage.getItem("token")
    return token ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
    return (
        <BrowserRouter>
            <WhatsAppButton />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/membres" element={<MembresListe />} />
                <Route path="/membres/nouveau" element={<MembreForm />} />
                <Route path="/membres/:id/modifier" element={<MembreForm />} />
                <Route path="/membres/:id/paiements" element={<PaiementsMembre />} />
                <Route path="/cotisations" element={<CotisationsListe />} />
                <Route path="/cotisations/nouveau" element={<CotisationForm />} />
                <Route path="/cotisations/:id/modifier" element={<CotisationForm />} />
                <Route path="/paiements" element={<PaiementsListe />} />
                <Route path="/paiements/nouveau" element={<PaiementForm />} />
                <Route path="/evenements" element={<EvenementsListe />} />
                <Route path="/evenements/nouveau" element={<EvenementForm />} />
                <Route path="/evenements/:id/modifier" element={<EvenementForm />} />
                <Route path="/evenements/:id/presences" element={<EvenementPresences />} />
                <Route path="/annonces" element={<AnnoncesListe />} />
                <Route path="/annonces/nouvelle" element={<AnnonceForm />} />
                <Route path="/annonces/:id/modifier" element={<AnnonceForm />} />

                {/* Super Admin */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/organisations" element={<AdminOrganisations />} />
                <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
