import { useEffect, useState } from 'react';

const MODE_OPTIONS = ['Reflection', 'Work', 'Health', 'Learning', 'Family', 'Rest', 'Other'];

const MOODS = [
    { value: '😀', label: 'Great' },
    { value: '🙂', label: 'Good' },
    { value: '😐', label: 'Neutral' },
    { value: '😕', label: 'Hard' },
    { value: '😞', label: 'Tough' },
];

function WeekJournalPanel({ selectedDate, entry, onSave, onClear, onDateChange }) {
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [mode, setMode] = useState('Reflection');
    const [tags, setTags] = useState('');
    const [mood, setMood] = useState('🙂');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setTitle(entry?.title ?? '');
        setNote(entry?.note ?? '');
        setMode(entry?.mode ?? 'Reflection');
        setTags(entry?.tags ?? '');
        setMood(entry?.mood ?? '🙂');
        setSaved(false);
    }, [entry, selectedDate]);

    const handleSave = (e) => {
        e.preventDefault();
        onSave({ date: selectedDate, title: title.trim(), note: note.trim(), mode, tags: tags.trim(), mood });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

    const removeTag = (tag) => {
        setTags(tags.split(',').map((t) => t.trim()).filter((t) => t !== tag).join(', '));
    };

    return (
        <section className="w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">Daily Journal</h3>
                <p className="text-xs text-gray-400 mt-0.5">Saved to local storage for each day.</p>
            </div>

            <form onSubmit={handleSave} className="px-5 py-4 space-y-4">
                {/* Date */}
                <div>
                    <label htmlFor="journalDate" className="block text-xs font-medium text-gray-500 mb-1.5">
                        Entry date
                    </label>
                    <input
                        id="journalDate"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                </div>

                {/* Title */}
                <div>
                    <label htmlFor="journalTitle" className="block text-xs font-medium text-gray-500 mb-1.5">
                        Title
                    </label>
                    <input
                        id="journalTitle"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        placeholder="Week highlight..."
                    />
                </div>

                {/* Reflection */}
                <div>
                    <label htmlFor="journalNote" className="block text-xs font-medium text-gray-500 mb-1.5">
                        Reflection
                    </label>
                    <textarea
                        id="journalNote"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={5}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                        placeholder="How was your week?"
                    />
                </div>

                {/* Mode + Tags row */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="journalMode" className="block text-xs font-medium text-gray-500 mb-1.5">
                            Mode
                        </label>
                        <select
                            id="journalMode"
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            {MODE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="journalTags" className="block text-xs font-medium text-gray-500 mb-1.5">
                            Tags
                        </label>
                        <input
                            id="journalTags"
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            placeholder="life, work, health"
                        />
                    </div>
                </div>

                {/* Tag chips */}
                {tagList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {tagList.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="text-gray-400 hover:text-gray-600 leading-none"
                                    aria-label={`Remove tag ${tag}`}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Mood picker */}
                <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Mood</p>
                    <div className="flex gap-2">
                        {MOODS.map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                title={label}
                                onClick={() => setMood(value)}
                                className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                                    mood === value
                                        ? 'bg-gray-900 shadow-sm scale-105'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1">
                    <button
                        type="submit"
                        className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                        Save entry
                    </button>
                    <button
                        type="button"
                        onClick={onClear}
                        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Clear day
                    </button>
                    <span className={`text-xs ml-auto transition-opacity duration-300 ${saved ? 'text-emerald-500 opacity-100' : 'text-gray-400 opacity-60'}`}>
                        {saved ? '✓ Saved' : 'Autosaved locally'}
                    </span>
                </div>
            </form>
        </section>
    );
}

export default WeekJournalPanel;