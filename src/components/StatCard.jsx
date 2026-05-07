const styles = {
    green:   { card: "bg-success/10 border border-success/20",  iconBg: "bg-success/20",  text: "text-success" },
    orange:  { card: "bg-amber-50 border border-amber-200",      iconBg: "bg-amber-100",   text: "text-amber-500" },
    red:     { card: "bg-danger/10 border border-danger/20",     iconBg: "bg-danger/20",   text: "text-danger" },
    primary: { card: "bg-primary/10 border border-primary/20",   iconBg: "bg-primary/20",  text: "text-primary" },
}

export default function StatCard({ icon, label, value, color = "primary" }) {
    const s = styles[color]
    return (
        <div className={`${s.card} rounded-2xl p-5 flex items-center gap-4`}>
            <div className={`${s.iconBg} p-3 rounded-xl shrink-0`}>
                <div className={`w-6 h-6 ${s.text}`}>{icon}</div>
            </div>
            <div>
                <p className="text-3xl font-bold text-dark">{value}</p>
                <p className="text-sm text-gray-500 leading-snug mt-0.5">{label}</p>
            </div>
        </div>
    )
}
