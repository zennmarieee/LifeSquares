import { useEffect, useState } from 'react';
import { snapToWeekStart, formatWeekRange, getWeekNumber } from '../utils/weekUtils';

const MODE_OPTIONS = ['Reflection', 'Work', 'Health', 'Learning', 'Family', 'Rest', 'Other'];

const MOODS = [
    { value: '😀', label: 'Great' },
    { value: '🙂', label: 'Good' },
    { value: '😐', label: 'Neutral' },
    { value: '😕', label: 'Hard' },
    { value: '😞', label: 'Tough' },
];

function WeekBadge({ weekNumber, weekRange }) {
    return (
        <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 mb-4">
            <div className="flex items-center justify-between">
                {weekNumber !== null && (
                    <span className="text-xs font-semibold text-gray-700">
                        Week #{weekNumber.toLocaleString()}
                    </span>
                )}
                <span className="text-xs text-gray-400">{weekRange}</span>
            </div>
        </div>
    );
}

function WriteTab({ selectedDate, entry, onDateChange, onSave, onClear, birthdate }) {
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

    // Snap to Monday on date change
    const handleDateChange = (val) => {
        onDateChange(snapToWeekStart(val));
    };

    const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
    const removeTag = (tag) => {
        setTags(tags.split(',').map((t) => t.trim()).filter((t) => t !== tag).join(', '));
    };

    const weekNumber = getWeekNumber(selectedDate, birthdate);
    const weekRange  = formatWeekRange(selectedDate);

    return (
        <form onSubmit={handleSave} className="space-y-4">
            {/* Week badge */}
            <WeekBadge weekNumber={weekNumber} weekRange={weekRange} />

            {/* Hidden date picker — triggered via a button */}
            <div>
                <label htmlFor="journalDate" className="block text-xs font-medium text-gray-500 mb-1.5">
                    Jump to week
                </label>
                <input
                    id="journalDate"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
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

            {/* Mode + Tags */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label htmlFor="journalMode" className="block text-xs font-medium text-gray-500 mb-1.5">Mode</label>
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
                    <label htmlFor="journalTags" className="block text-xs font-medium text-gray-500 mb-1.5">Tags</label>
                    <input
                        id="journalTags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        placeholder="life, work..."
                    />
                </div>
            </div>

            {/* Tag chips */}
            {tagList.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {tagList.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-gray-600 leading-none">×</button>
                        </span>
                    ))}
                </div>
            )}

            {/* Mood */}
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
                                mood === value ? 'bg-gray-900 scale-105 shadow-sm' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
                <button type="submit" className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium">
                    Save entry
                </button>
                <button type="button" onClick={onClear} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                    Clear
                </button>
                <span className={`text-xs ml-auto transition-opacity duration-300 ${saved ? 'text-emerald-500 opacity-100' : 'text-gray-400 opacity-60'}`}>
                    {saved ? '✓ Saved' : 'Autosaved locally'}
                </span>
            </div>
        </form>
    );
}

function HistoryTab({ journalEntries, onSelect, selectedDate, birthdate }) {
    const entries = Object.entries(journalEntries).sort(([a], [b]) => b.localeCompare(a));

    if (entries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-2xl mb-2">📓</p>
                <p className="text-sm font-medium text-gray-700">No entries yet</p>
                <p className="text-xs text-gray-400 mt-1">Your saved reflections will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {entries.map(([date, e]) => {
                const weekNum   = getWeekNumber(date, birthdate);
                const weekRange = formatWeekRange(date);
                return (
                    <button
                        key={date}
                        type="button"
                        onClick={() => onSelect(date)}
                        className={`w-full text-left rounded-xl px-4 py-3 border transition-colors ${
                            selectedDate === date ? 'border-gray-400 bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                    >
                        {/* Week label */}
                        <div className="flex items-center justify-between mb-1">
                            {weekNum && (
                                <span className="text-xs font-semibold text-gray-500">Week #{weekNum.toLocaleString()}</span>
                            )}
                            <span className="text-xs text-gray-400">{weekRange}</span>
                        </div>
                        {/* Entry title */}
                        <p className="text-sm font-medium text-gray-800 truncate">
                            {e.title || 'Untitled'}
                        </p>
                        {e.note && <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{e.note}</p>}
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-sm">{e.mood}</span>
                            {e.mode && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{e.mode}</span>}
                            {e.tags && (
                                <span className="text-xs text-gray-400 truncate">
                                    {e.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => `#${t}`).join(' ')}
                                </span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

function WeekJournalPanel({ selectedDate, entry, onSave, onClear, onDateChange, journalEntries, onSelectEntry, birthdate }) {
    const [tab, setTab] = useState('write');
    const entryCount = Object.keys(journalEntries).length;

    const handleSelectEntry = (date) => {
        onSelectEntry(date);
        setTab('write');
    };

    return (
        <section className="w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-4 pb-0">
                <div className="mb-3">
                    <h3 className="text-base font-semibold text-gray-900">Weekly Reflection</h3>
                    <p className="text-xs text-gray-400">
                        Saved locally · {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
                    </p>
                </div>

                {/* Write / History tabs */}
                <div className="flex border-b border-gray-100">
                    {[
                        { id: 'write',   label: 'Write' },
                        { id: 'history', label: `History${entryCount > 0 ? ` (${entryCount})` : ''}` },
                    ].map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setTab(id)}
                            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                tab === id
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
            <div className="px-5 py-4">
                {tab === 'write' ? (
                    <WriteTab
                        selectedDate={selectedDate}
                        entry={entry}
                        onDateChange={onDateChange}
                        onSave={onSave}
                        onClear={onClear}
                        birthdate={birthdate}
                    />
                ) : (
                    <HistoryTab
                        journalEntries={journalEntries}
                        onSelect={handleSelectEntry}
                        selectedDate={selectedDate}
                        birthdate={birthdate}
                    />
                )}
            </div>
        </section>
    );
}

export default WeekJournalPanel;