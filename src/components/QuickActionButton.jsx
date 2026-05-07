const styles = {
    primary: "bg-primary hover:bg-secondary text-white",
    green:   "bg-success hover:bg-green-600 text-white",
    orange:  "bg-amber-500 hover:bg-amber-600 text-white",
}

export default function QuickActionButton({ icon, label, description, onClick, color = "primary" }) {
    return (
        <button
            onClick={onClick}
            className={`${styles[color]} flex flex-col items-center gap-3 p-6 rounded-2xl transition-colors cursor-pointer w-full`}
        >
            <div className="w-10 h-10">{icon}</div>
            <div className="text-center">
                <p className="font-bold text-base">{label}</p>
                {description && (
                    <p className="text-xs opacity-75 mt-0.5">{description}</p>
                )}
            </div>
        </button>
    )
}
