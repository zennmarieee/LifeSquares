function BirthdateForm({ value, onChange, onSubmit, dark = false }) {
    const inputCls = `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
        dark
            ? 'bg-slate-700 border-slate-600 text-slate-100 focus:ring-slate-500'
            : 'bg-white border-gray-200 text-gray-900 focus:ring-gray-200'
    }`;

    return (
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row items-start sm:items-end gap-2.5">
            <div className="flex-1 w-full">
                <label htmlFor="birthdate" className={`block text-xs font-medium mb-1.5 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                    Date of birth
                </label>
                <input
                    type="date"
                    id="birthdate"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={inputCls}
                    style={{ colorScheme: dark ? 'dark' : 'light' }}
                />
            </div>
            <button
                type="submit"
                className={`shrink-0 text-sm px-5 py-2 rounded-lg font-medium transition-colors ${
                    dark ? 'bg-slate-100 text-slate-900 hover:bg-white' : 'bg-gray-900 text-white hover:bg-gray-700'
                }`}
            >
                View My Life Grid
            </button>
        </form>
    );
}

export default BirthdateForm;