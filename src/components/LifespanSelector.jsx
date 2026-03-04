function LifespanSelector({ lifespanOption, customYears, onOptionChange, onCustomYearsChange }) {
    return (
        <div className="w-full max-w-2xl mb-6 flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1">
                <label htmlFor="lifespanOption" className="block text-sm text-gray-700 mb-1">
                    Lifespan target
                </label>
                <select
                    id="lifespanOption"
                    value={lifespanOption}
                    onChange={(event) => onOptionChange(event.target.value)}
                    className="w-full border border-gray-400 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                    <option value="75">75 years</option>
                    <option value="80">80 years</option>
                    <option value="90">90 years</option>
                    <option value="custom">Custom lifespan</option>
                </select>
            </div>

            {lifespanOption === 'custom' && (
                <div className="w-full md:w-44">
                    <label htmlFor="customLifespan" className="block text-sm text-gray-700 mb-1">
                        Custom years
                    </label>
                    <input
                        id="customLifespan"
                        type="number"
                        min="1"
                        max="130"
                        value={customYears}
                        onChange={(event) => onCustomYearsChange(event.target.value)}
                        className="w-full border border-gray-400 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                </div>
            )}
        </div>
    );
}

export default LifespanSelector;
