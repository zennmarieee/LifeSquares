function LifespanSelector({ lifespanOption, customYears, onOptionChange, onCustomYearsChange }) {
    return (
        <div className="flex gap-2.5 items-end">
            <div className="flex-1">
                <label htmlFor="lifespanOption" className="block text-xs font-medium text-gray-500 mb-1.5">
                    Lifespan target
                </label>
                <select
                    id="lifespanOption"
                    value={lifespanOption}
                    onChange={(e) => onOptionChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                    <option value="75">75 years</option>
                    <option value="80">80 years</option>
                    <option value="90">90 years</option>
                    <option value="custom">Custom…</option>
                </select>
            </div>

            {lifespanOption === 'custom' && (
                <div className="w-28 shrink-0">
                    <label htmlFor="customLifespan" className="block text-xs font-medium text-gray-500 mb-1.5">
                        Years
                    </label>
                    <input
                        id="customLifespan"
                        type="number"
                        min="1"
                        max="130"
                        value={customYears}
                        onChange={(e) => onCustomYearsChange(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                </div>
            )}
        </div>
    );
}

export default LifespanSelector;