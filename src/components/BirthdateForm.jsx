function BirthdateForm({ value, onChange, onSubmit }) {
    return (
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row items-start sm:items-end gap-2.5">
            <div className="flex-1 w-full">
                <label htmlFor="birthdate" className="block text-xs font-medium text-gray-500 mb-1.5">
                    Date of birth
                </label>
                <input
                    type="date"
                    id="birthdate"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
            </div>
            <button
                type="submit"
                className="shrink-0 bg-gray-900 text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
                View My Life Grid
            </button>
        </form>
    );
}

export default BirthdateForm;