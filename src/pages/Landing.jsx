import { Link } from "react-router-dom"
import logoprimary from "../assets/logoprimary.png"
import screenshot1 from "../assets/tableaubord.png"
import screenshot2 from "../assets/membrestatut.png"
import screenshot3 from "../assets/registerpaiement.png"
import screenshot4 from "../assets/registermembre.png"
import screenshot5 from "../assets/presencereunion.png"

/* ─── Placeholder screenshot ──────────────────────────── */
function Screenshot({ label, tall = false, photo = '' }) {
    return (
        photo == '' ? <div
            className={`w-full ${tall ? "aspect-16/10" : "aspect-video"} rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-3 select-none`}
        >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            </div>
            <div className="text-center px-4">
                <p className="text-primary/60 text-sm font-semibold">{label}</p>
                <p className="text-primary/30 text-xs mt-0.5">Remplacer par une vraie capture</p>
            </div>
        </div>
            : <img src={photo} alt={label} className={`w-full ${tall ? "aspect-16/10" : "aspect-video"} object-cover`} />
    )
}

/* ─── Feature card ────────────────────────────────────── */
function Feature({ icon, title, desc }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-dark font-bold text-base mb-1.5">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        </div>
    )
}

/* ─── Step ────────────────────────────────────────────── */
function Step({ num, title, desc }) {
    return (
        <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                {num}
            </div>
            <div>
                <h4 className="text-dark font-bold text-base">{title}</h4>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}

/* ─── Page principale ─────────────────────────────────── */
export default function Landing() {
    return (
        <div className="min-h-screen bg-surface font-body">

            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <img src={logoprimary} className="h-7" alt="Build-Membres" />
                        <span className="font-bold text-primary text-lg hidden sm:block">Build-Membres</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="text-gray-600 hover:text-primary text-sm font-medium transition-colors"
                        >
                            Se connecter
                        </Link>
                        <Link
                            to="/register"
                            className="bg-primary hover:bg-secondary text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                        >
                            Commencer gratuitement
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
                    MVP — Version bêta
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark leading-tight max-w-3xl mx-auto">
                    Gérez vos membres et cotisations{" "}
                    <span className="text-primary">sans effort</span>
                </h1>
                <p className="text-gray-500 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
                    Build-Membres est la plateforme tout-en-un pour les associations, ONG et églises qui veulent digitaliser leur gestion des membres, cotisations, réunions et annonces.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
                    <Link
                        to="/register"
                        className="bg-primary hover:bg-secondary text-white font-bold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-primary/20"
                    >
                        Créer mon espace gratuitement
                    </Link>
                    <Link
                        to="/login"
                        className="bg-white border border-gray-200 hover:border-primary/40 text-dark font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
                    >
                        J'ai déjà un compte
                    </Link>
                </div>

                {/* Screenshot Hero */}
                <div className="mt-14 max-w-4xl mx-auto shadow-2xl shadow-primary/10 rounded-3xl overflow-hidden border border-gray-200">
                    <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-1.5 border-b border-gray-200">
                        <span className="w-3 h-3 rounded-full bg-red-400" />
                        <span className="w-3 h-3 rounded-full bg-amber-400" />
                        <span className="w-3 h-3 rounded-full bg-green-400" />
                        <span className="ml-4 flex-1 bg-white rounded text-xs text-gray-400 px-3 py-1 text-center">
                            app.build-membres.com/dashboard
                        </span>
                    </div>
                    <Screenshot label="Tableau de bord principal" tall photo={screenshot1} />
                </div>
            </section>

            {/* ── Fonctionnalités ── */}
            <section className="bg-white py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-dark">Tout ce dont vous avez besoin</h2>
                        <p className="text-gray-500 mt-3 text-base max-w-xl mx-auto">
                            Une seule plateforme pour gérer l'ensemble de la vie de votre organisation.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <Feature
                            title="Gestion des membres"
                            desc="Ajoutez, modifiez et suivez vos membres. Consultez leur statut de cotisation en temps réel."
                            icon={<svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        />
                        <Feature
                            title="Cotisations flexibles"
                            desc="Définissez des cotisations mensuelles, trimestrielles, annuelles ou ponctuelles selon vos règles."
                            icon={<svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>}
                        />
                        <Feature
                            title="Suivi des paiements"
                            desc="Enregistrez chaque paiement et visualisez l'historique complet par membre ou par période."
                            icon={<svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        />
                        <Feature
                            title="Gestion des réunions"
                            desc="Planifiez vos événements et marquez les présences de chaque membre en quelques clics."
                            icon={<svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        />
                        <Feature
                            title="Annonces internes"
                            desc="Diffusez des informations, convocations et rappels à l'ensemble de votre organisation."
                            icon={<svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>}
                        />
                        <Feature
                            title="Tableau de bord"
                            desc="Visualisez les KPIs essentiels de votre organisation sur un seul écran clair et synthétique."
                            icon={<svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                        />
                    </div>
                </div>
            </section>

            {/* ── Screenshots ── */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-dark">Une interface pensée pour vous</h2>
                    <p className="text-gray-500 mt-3 text-base max-w-xl mx-auto">
                        Simple, rapide et accessible sur tous vos appareils.
                    </p>
                </div>

                {/* Screenshot 1 — pleine largeur */}
                <div className="mb-8 shadow-xl shadow-gray-200 rounded-2xl overflow-hidden border border-gray-200">
                    <Screenshot label="Liste des membres avec statut de cotisation" photo={screenshot2} />
                </div>

                {/* Screenshots 2 + 3 — côte à côte */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="shadow-lg shadow-gray-200 rounded-2xl overflow-hidden border border-gray-200">
                        <Screenshot label="Enregistrement d'un paiement" photo={screenshot3} />
                    </div>
                    <div className="shadow-lg shadow-gray-200 rounded-2xl overflow-hidden border border-gray-200">
                        <Screenshot label="Présences à une réunion" photo={screenshot5} />
                    </div>
                </div>
            </section>

            {/* ── Comment ça marche ── */}
            <section className="bg-white py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-10">
                                Opérationnel en 3 minutes
                            </h2>
                            <div className="flex flex-col gap-8">
                                <Step
                                    num="1"
                                    title="Créez votre espace"
                                    desc="Inscrivez votre organisation en 30 secondes : nom, type et ville. Aucune carte bancaire requise."
                                />
                                <Step
                                    num="2"
                                    title="Ajoutez vos membres"
                                    desc="Importez ou saisissez vos membres manuellement. Définissez les cotisations adaptées à vos règles."
                                />
                                <Step
                                    num="3"
                                    title="Suivez en temps réel"
                                    desc="Le tableau de bord vous donne une vue claire de qui a payé, qui est en retard et l'activité récente."
                                />
                            </div>
                            <Link
                                to="/register"
                                className="inline-block mt-10 bg-primary hover:bg-secondary text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
                            >
                                Commencer maintenant
                            </Link>
                        </div>
                        <div className="shadow-xl shadow-gray-200 rounded-2xl overflow-hidden border border-gray-200">
                            <Screenshot label="Formulaire d'inscription d'un membre" tall photo={screenshot4} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA final ── */}
            <section className="bg-primary py-20">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Prêt à digitaliser votre organisation ?
                    </h2>
                    <p className="text-white/70 text-base mb-10 leading-relaxed">
                        Rejoignez les premières organisations qui testent Build-Membres. Gratuit pendant la bêta, vos retours nous aident à construire le bon produit.
                    </p>
                    <Link
                        to="/register"
                        className="inline-block bg-white text-primary font-bold px-10 py-4 rounded-xl text-base hover:bg-surface transition-colors shadow-lg"
                    >
                        Créer mon espace gratuitement
                    </Link>
                    <p className="text-white/40 text-xs mt-5">Aucune carte bancaire · Accès immédiat · Données sécurisées</p>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-dark py-10">
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <img src={logoprimary} className="h-6 invert opacity-70" alt="Build-Membres" />
                        <span className="text-gray-500 text-sm font-medium">Build-Membres</span>
                    </div>
                    <p className="text-gray-600 text-sm">© 2026 Build-Membres · Version MVP bêta</p>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-500 hover:text-white text-sm transition-colors">Connexion</Link>
                        <Link to="/register" className="text-gray-500 hover:text-white text-sm transition-colors">Inscription</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
