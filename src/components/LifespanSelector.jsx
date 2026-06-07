function LifespanSelector({ lifespanOption, customYears, onOptionChange, onCustomYearsChange, dark = false }) {
    const inputCls = `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
        dark
            ? 'bg-slate-700 border-slate-600 text-slate-100 focus:ring-slate-500'
            : 'bg-white border-gray-200 text-gray-900 focus:ring-gray-200'
    }`;
    const labelCls = `block text-xs font-medium mb-1.5 ${dark ? 'text-slate-400' : 'text-gray-500'}`;
    const scheme   = { colorScheme: dark ? 'dark' : 'light' };

    return (
        <div className="flex gap-2.5 items-end">
            <div className="flex-1">
                <label htmlFor="lifespanOption" className={labelCls}>Lifespan target</label>
                <select
                    id="lifespanOption"
                    value={lifespanOption}
                    onChange={(e) => onOptionChange(e.target.value)}
                    className={inputCls}
                    style={scheme}
                >
                    <option value="75">75 years</option>
                    <option value="80">80 years</option>
                    <option value="90">90 years</option>
                    <option value="custom">Custom…</option>
                </select>
            </div>

            {lifespanOption === 'custom' && (
                <div className="w-28 shrink-0">
                    <label htmlFor="customLifespan" className={labelCls}>Years</label>
                    <input
                        id="customLifespan"
                        type="number"
                        min="1"
                        max="130"
                        value={customYears}
                        onChange={(e) => onCustomYearsChange(e.target.value)}
                        className={inputCls}
                        style={scheme}
                    />
                </div>
            )}
        </div>
    );
}

export default LifespanSelector;