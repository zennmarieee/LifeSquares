function LifeSummary({ weeksLived, weeksRemaining, totalWeeks, lifespanYears, birthdate }) {
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
                    className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm"
                >
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="text-xl font-semibold text-gray-900 leading-tight">{value}</p>
                    {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
                </div>
            ))}
        </div>
    );
}

export default LifeSummary;