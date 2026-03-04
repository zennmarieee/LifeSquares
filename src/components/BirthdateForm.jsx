function BirthdateForm({ value, onChange, onSubmit }) {
    return (
        <form onSubmit={onSubmit} className="flex flex-col md:flex-row items-center gap-4 mb-2">
            <label htmlFor="birthdate" className="sr-only">
                Birthdate
            </label>
            <input
                type="date"
                id="birthdate"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="border border-gray-400 rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <button
                type="submit"
                className="bg-gray-700 text-white px-6 py-2 rounded font-medium hover:bg-gray-900 transition"
            >
                View My Life Grid
            </button>
        </form>
    );
}

export default BirthdateForm;
