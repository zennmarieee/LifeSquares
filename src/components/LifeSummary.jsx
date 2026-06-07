function LifeSummary({ weeksLived, weeksRemaining, totalWeeks, lifespanYears, birthdate, dark = false }) {
    const pctLived = totalWeeks > 0 ? ((weeksLived / totalWeeks) * 100).toFixed(1) : '0.0';
    const pctRemaining = totalWeeks > 0 ? ((weeksRemaining / totalWeeks) * 100).toFixed(1) : '0.0';

    const stats = [
        {
            label: 'Born on',
            value: birthdate
                ? birthdate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
                : '—',
            sub: birthdate ? (() => {
                const years = Math.floor(weeksLived / 52);
                const months = Math.floor((weeksLived % 52) / 4.33);
                return `${years} years, ${months} months old`;
            })() : null,
        },
        {
            label: 'Weeks lived',
            value: weeksLived.toLocaleString(),
            sub: `${pctLived}% of life`,
        },
        {
            label: 'Weeks remaining',
            value: weeksRemaining.toLocaleString(),
            sub: `${pctRemaining}% of life`,
        },
        {
            label: 'Life expectancy',
            value: `${lifespanYears} years`,
            sub: `${totalWeeks.toLocaleString()} weeks total`,
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {stats.map(({ label, value, sub }) => (
                <div
                    key={label}
                    className={`border rounded-xl px-4 py-3 shadow-sm ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}
                >
                    <p className={`text-xs mb-1 ${dark ? "text-slate-400" : "text-gray-400"}`}>{label}</p>
                    <p className={`text-xl font-semibold leading-tight ${dark ? "text-slate-100" : "text-gray-900"}`}>{value}</p>
                    {sub && <p className={`text-xs mt-0.5 ${dark ? "text-slate-400" : "text-gray-400"}`}>{sub}</p>}
                </div>
            ))}
        </div>
    );
}

export default LifeSummary;