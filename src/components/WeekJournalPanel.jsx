import { useEffect, useState } from 'react';

const MODE_OPTIONS = ['Reflection', 'Work', 'Health', 'Learning', 'Family', 'Rest', 'Other'];

function WeekJournalPanel({ selectedWeekIndex, entry, onSave, onClear }) {
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [mode, setMode] = useState('Reflection');
    const [tags, setTags] = useState('');

    useEffect(() => {
        setTitle(entry?.title ?? '');
        setNote(entry?.note ?? '');
        setMode(entry?.mode ?? 'Reflection');
        setTags(entry?.tags ?? '');
    }, [entry, selectedWeekIndex]);

    const handleSave = (event) => {
        event.preventDefault();

        onSave({
            title: title.trim(),
            note: note.trim(),
            mode,
            tags: tags.trim(),
        });
    };

    return (
        <section className="w-full max-w-3xl bg-white border border-gray-300 rounded p-4 mb-10">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Week {selectedWeekIndex + 1} Journal</h3>
            <form onSubmit={handleSave} className="space-y-3">
                <div>
                    <label htmlFor="journalTitle" className="block text-sm text-gray-700 mb-1">
                        Optional title
                    </label>
                    <input
                        id="journalTitle"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="w-full border border-gray-400 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        placeholder="Week highlight"
                    />
                </div>

                <div>
                    <label htmlFor="journalNote" className="block text-sm text-gray-700 mb-1">
                        Weekly reflection note
                    </label>
                    <textarea
                        id="journalNote"
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        rows={4}
                        className="w-full border border-gray-400 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        placeholder="What happened this week?"
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="journalMode" className="block text-sm text-gray-700 mb-1">
                            Mode
                        </label>
                        <select
                            id="journalMode"
                            value={mode}
                            onChange={(event) => setMode(event.target.value)}
                            className="w-full border border-gray-400 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            {MODE_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="journalTags" className="block text-sm text-gray-700 mb-1">
                            Tags (comma separated)
                        </label>
                        <input
                            id="journalTags"
                            type="text"
                            value={tags}
                            onChange={(event) => setTags(event.target.value)}
                            className="w-full border border-gray-400 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            placeholder="family, work, gratitude"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                    <button type="submit" className="bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-900 transition">
                        Save week
                    </button>
                    <button
                        type="button"
                        onClick={onClear}
                        className="border border-gray-400 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-100 transition"
                    >
                        Clear
                    </button>
                </div>
            </form>
        </section>
    );
}

export default WeekJournalPanel;
