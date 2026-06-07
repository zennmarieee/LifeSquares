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

function input(dark) {
    return `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
        dark
            ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-slate-500'
            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-gray-200'
    }`;
}

function label(dark) {
    return `block text-xs font-medium mb-1.5 ${dark ? 'text-slate-400' : 'text-gray-500'}`;
}

function WeekBadge({ weekNumber, weekRange, dark }) {
    return (
        <div className={`rounded-lg px-3 py-2 mb-4 border ${dark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-100'}`}>
            <div className="flex items-center justify-between">
                {weekNumber !== null && (
                    <span className={`text-xs font-semibold ${dark ? 'text-slate-200' : 'text-gray-700'}`}>
                        Week #{weekNumber.toLocaleString()}
                    </span>
                )}
                <span className={`text-xs ${dark ? 'text-slate-400' : 'text-gray-400'}`}>{weekRange}</span>
            </div>
        </div>
    );
}

function WriteTab({ selectedDate, entry, onDateChange, onSave, onClear, birthdate, dark }) {
    const [title, setTitle] = useState('');
    const [note, setNote]   = useState('');
    const [mode, setMode]   = useState('Reflection');
    const [tags, setTags]   = useState('');
    const [mood, setMood]   = useState('🙂');
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

    const handleDateChange = (val) => onDateChange(snapToWeekStart(val));

    const tagList  = tags.split(',').map((t) => t.trim()).filter(Boolean);
    const removeTag = (tag) => setTags(tags.split(',').map((t) => t.trim()).filter((t) => t !== tag).join(', '));

    const weekNumber = getWeekNumber(selectedDate, birthdate);
    const weekRange  = formatWeekRange(selectedDate);

    return (
        <form onSubmit={handleSave} className="space-y-4">
            <WeekBadge weekNumber={weekNumber} weekRange={weekRange} dark={dark} />

            <div>
                <label htmlFor="journalDate" className={label(dark)}>Jump to week</label>
                <input id="journalDate" type="date" value={selectedDate} onChange={(e) => handleDateChange(e.target.value)} className={input(dark)} />
            </div>

            <div>
                <label htmlFor="journalTitle" className={label(dark)}>Title</label>
                <input id="journalTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={input(dark)} placeholder="Week highlight..." />
            </div>

            <div>
                <label htmlFor="journalNote" className={label(dark)}>Reflection</label>
                <textarea id="journalNote" value={note} onChange={(e) => setNote(e.target.value)} rows={5}
                    className={`${input(dark)} resize-none`} placeholder="How was your week?" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label htmlFor="journalMode" className={label(dark)}>Mode</label>
                    <select id="journalMode" value={mode} onChange={(e) => setMode(e.target.value)} className={input(dark)}>
                        {MODE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="journalTags" className={label(dark)}>Tags</label>
                    <input id="journalTags" type="text" value={tags} onChange={(e) => setTags(e.target.value)} className={input(dark)} placeholder="life, work..." />
                </div>
            </div>

            {tagList.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {tagList.map((tag) => (
                        <span key={tag} className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${dark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className={`leading-none ${dark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}>×</button>
                        </span>
                    ))}
                </div>
            )}

            <div>
                <p className={`text-xs font-medium mb-2 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Mood</p>
                <div className="flex gap-2">
                    {MOODS.map(({ value, label: lbl }) => (
                        <button key={value} type="button" title={lbl} onClick={() => setMood(value)}
                            className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                                mood === value
                                    ? dark ? 'bg-slate-200 scale-105 shadow-sm' : 'bg-gray-900 scale-105 shadow-sm'
                                    : dark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                            }`}>
                            {value}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
                <button type="submit" className={`text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium ${dark ? 'bg-slate-100 text-slate-900' : 'bg-gray-900 text-white'}`}>
                    Save entry
                </button>
                <button type="button" onClick={onClear} className={`text-sm transition-colors ${dark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}>
                    Clear
                </button>
                <span className={`text-xs ml-auto transition-opacity duration-300 ${saved ? 'text-emerald-500 opacity-100' : `opacity-60 ${dark ? 'text-slate-500' : 'text-gray-400'}`}`}>
                    {saved ? '✓ Saved' : 'Autosaved locally'}
                </span>
            </div>
        </form>
    );
}

function HistoryTab({ journalEntries, onSelect, selectedDate, birthdate, dark }) {
    const entries = Object.entries(journalEntries).sort(([a], [b]) => b.localeCompare(a));

    if (entries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-2xl mb-2">📓</p>
                <p className={`text-sm font-medium ${dark ? 'text-slate-300' : 'text-gray-700'}`}>No entries yet</p>
                <p className={`text-xs mt-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>Your saved reflections will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {entries.map(([date, e]) => {
                const weekNum   = getWeekNumber(date, birthdate);
                const weekRange = formatWeekRange(date);
                const active    = selectedDate === date;
                return (
                    <button key={date} type="button" onClick={() => onSelect(date)}
                        className={`w-full text-left rounded-xl px-4 py-3 border transition-colors ${
                            active
                                ? dark ? 'border-slate-500 bg-slate-700' : 'border-gray-400 bg-gray-50'
                                : dark ? 'border-slate-700 bg-slate-800 hover:border-slate-600' : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}>
                        <div className="flex items-center justify-between mb-1">
                            {weekNum && <span className={`text-xs font-semibold ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Week #{weekNum.toLocaleString()}</span>}
                            <span className={`text-xs ${dark ? 'text-slate-500' : 'text-gray-400'}`}>{weekRange}</span>
                        </div>
                        <p className={`text-sm font-medium truncate ${dark ? 'text-slate-200' : 'text-gray-800'}`}>{e.title || 'Untitled'}</p>
                        {e.note && <p className={`text-xs line-clamp-1 mt-0.5 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>{e.note}</p>}
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-sm">{e.mood}</span>
                            {e.mode && <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>{e.mode}</span>}
                            {e.tags && <span className={`text-xs truncate ${dark ? 'text-slate-500' : 'text-gray-400'}`}>{e.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => `#${t}`).join(' ')}</span>}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

function WeekJournalPanel({ selectedDate, entry, onSave, onClear, onDateChange, journalEntries, onSelectEntry, birthdate, dark = false }) {
    const [tab, setTab]     = useState('write');
    const entryCount        = Object.keys(journalEntries).length;

    const handleSelectEntry = (date) => { onSelectEntry(date); setTab('write'); };

    return (
        <section className={`w-full border rounded-xl shadow-sm overflow-hidden transition-colors duration-200 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
            <div className={`px-5 pt-4 pb-0 border-b ${dark ? 'border-slate-700' : 'border-gray-100'}`}>
                <div className="mb-3">
                    <h3 className={`text-base font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>Weekly Reflection</h3>
                    <p className={`text-xs ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                        Saved locally · {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
                    </p>
                </div>
                <div className="flex">
                    {[
                        { id: 'write',   label: 'Write' },
                        { id: 'history', label: `History${entryCount > 0 ? ` (${entryCount})` : ''}` },
                    ].map(({ id, label: lbl }) => (
                        <button key={id} type="button" onClick={() => setTab(id)}
                            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                tab === id
                                    ? dark ? 'border-slate-300 text-slate-100' : 'border-gray-900 text-gray-900'
                                    : dark ? 'border-transparent text-slate-500 hover:text-slate-300' : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}>
                            {lbl}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-5 py-4">
                {tab === 'write' ? (
                    <WriteTab
                        selectedDate={selectedDate} entry={entry}
                        onDateChange={onDateChange} onSave={onSave}
                        onClear={onClear} birthdate={birthdate} dark={dark}
                    />
                ) : (
                    <HistoryTab
                        journalEntries={journalEntries} onSelect={handleSelectEntry}
                        selectedDate={selectedDate} birthdate={birthdate} dark={dark}
                    />
                )}
            </div>
        </section>
    );
}

export default WeekJournalPanel;