import { useMemo, useState } from 'react';
import BirthdateForm from '../components/BirthdateForm';
import GridLegend from '../components/GridLegend';
import LifespanSelector from '../components/LifespanSelector';
import LifeGrid from '../components/LifeGrid';
import LifeSummary from '../components/LifeSummary';
import WeekJournalPanel from '../components/WeekJournalPanel';
import {
    calculateTotalWeeks,
    calculateWeeksLived,
    DEFAULT_LIFESPAN_YEARS,
    parseBirthdate,
} from '../utils/lifeMath';
import { loadJournalEntries, saveJournalEntries } from '../utils/storage';

function toDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function LifeSquaresPage() {
    const [birthdateInput, setBirthdateInput] = useState('');
    const [selectedBirthdate, setSelectedBirthdate] = useState(null);
    const [error, setError] = useState('');
    const [showAveragePhases, setShowAveragePhases] = useState(false);
    const [lifespanOption, setLifespanOption] = useState('80');
    const [customLifespanYears, setCustomLifespanYears] = useState('85');
    const [journalEntries, setJournalEntries] = useState(() => loadJournalEntries());
    const [selectedJournalDate, setSelectedJournalDate] = useState(() => toDateInputValue(new Date()));

    const lifespanYears = useMemo(() => {
        if (lifespanOption === 'custom') {
            const v = Number(customLifespanYears);
            return Number.isFinite(v) && v > 0 ? v : DEFAULT_LIFESPAN_YEARS;
        }
        return Number(lifespanOption);
    }, [lifespanOption, customLifespanYears]);

    const totalWeeks = useMemo(() => calculateTotalWeeks(lifespanYears), [lifespanYears]);
    const rawWeeksLived = useMemo(() => calculateWeeksLived(selectedBirthdate), [selectedBirthdate]);
    const weeksLived = Math.min(rawWeeksLived, totalWeeks);
    const weeksRemaining = Math.max(totalWeeks - weeksLived, 0);

    const selectedJournalEntry = journalEntries[selectedJournalDate] ?? {
        title: '', note: '', mode: 'Reflection', tags: '', mood: '🙂',
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const parsed = parseBirthdate(birthdateInput);
        if (!parsed) { setError('Please enter a valid birthdate (mm/dd/yyyy).'); return; }
        if (parsed.getTime() > Date.now()) { setError('Birthdate cannot be in the future.'); return; }
        setError('');
        setSelectedBirthdate(parsed);
    };

    const handleSaveJournalEntry = (entry) => {
        const next = {
            ...journalEntries,
            [selectedJournalDate]: {
                title: entry.title ?? '',
                note: entry.note ?? '',
                mode: entry.mode ?? 'Reflection',
                tags: entry.tags ?? '',
                mood: entry.mood ?? '🙂',
                updatedAt: new Date().toISOString(),
            },
        };
        setJournalEntries(next);
        saveJournalEntries(next);
    };

    const handleClearJournalEntry = () => {
        const next = { ...journalEntries };
        delete next[selectedJournalDate];
        setJournalEntries(next);
        saveJournalEntries(next);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">

            {/* LEFT SIDEBAR */}
            <aside className="hidden xl:flex flex-col fixed left-0 top-0 h-full w-52 z-10">
                <div className="bg-white border-r border-gray-100 h-full flex flex-col justify-between py-5 px-4">
                    <div>
                        {/* Logo */}
                        <div className="flex items-center gap-2.5 mb-7 px-1">
                            <div className="w-7 h-7 bg-gray-900 text-white rounded-md flex items-center justify-center text-sm">▦</div>
                            <span className="text-sm font-semibold tracking-tight text-gray-900">LifeSquares</span>
                        </div>

                        {/* Nav */}
                        <nav className="space-y-0.5">
                            {[
                                { href: '#life-grid', icon: '▦', label: 'Life Grid', active: true },
                                { href: '#journal',   icon: '📓', label: 'Journal',   active: false },
                                { href: '#stats',     icon: '📊', label: 'Stats',     active: false },
                                { href: '/blog',      icon: '✍️',  label: 'Blog',      active: false },
                                { href: '#settings',  icon: '⚙️',  label: 'Settings',  active: false },
                            ].map(({ href, icon, label, active }) => (
                                <a
                                    key={label}
                                    href={href}
                                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                                        active ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                                >
                                    <span className="w-4 text-center text-xs">{icon}</span>
                                    <span>{label}</span>
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Bottom */}
                    <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <p className="text-xs font-medium text-gray-800">✨ Life is short.</p>
                            <p className="mt-1 text-xs text-gray-400 leading-relaxed">Make every week count.</p>
                        </div>
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs text-gray-400">Theme</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs">☀️</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-8 h-4 bg-gray-200 peer-checked:bg-gray-800 rounded-full transition-colors" />
                                </label>
                                <span className="text-xs">🌙</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN LAYOUT */}
            <div className="xl:ml-52 flex flex-col xl:flex-row min-h-screen">

                {/* CENTER */}
                <main className="flex-1 min-w-0 px-4 sm:px-6 py-6" id="life-grid">

                    {/* Page header + New Entry button */}
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Life Grid
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">
                                Your life visualized as weeks. Each square is one week of your life.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedJournalDate(toDateInputValue(new Date()))}
                            className="flex items-center gap-1.5 text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium mt-1"
                        >
                            + New Entry
                        </button>
                    </div>

                    {/* Controls card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4 shadow-sm">
                        <div className="flex flex-col lg:flex-row lg:items-end gap-3">
                            <div className="flex-1">
                                <BirthdateForm
                                    value={birthdateInput}
                                    onChange={setBirthdateInput}
                                    onSubmit={handleSubmit}
                                />
                            </div>
                            <div className="w-full lg:w-64">
                                <LifespanSelector
                                    lifespanOption={lifespanOption}
                                    customYears={customLifespanYears}
                                    onOptionChange={setLifespanOption}
                                    onCustomYearsChange={setCustomLifespanYears}
                                />
                            </div>
                        </div>
                        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                    </div>

                    {/* Stat cards — only after birthdate is set */}
                    {selectedBirthdate && !error && (
                        <LifeSummary
                            weeksLived={weeksLived}
                            weeksRemaining={weeksRemaining}
                            totalWeeks={totalWeeks}
                            lifespanYears={lifespanYears}
                            birthdate={selectedBirthdate}
                        />
                    )}

                    {/* Phase toggle */}
                    <div className="flex items-center mb-2.5">
                        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={showAveragePhases}
                                onChange={(e) => setShowAveragePhases(e.target.checked)}
                                className="h-3.5 w-3.5 rounded"
                            />
                            Show average life phases
                        </label>
                    </div>

                    {/* Grid card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 mb-3 shadow-sm">
                        <LifeGrid
                            weeksLived={weeksLived}
                            birthYear={selectedBirthdate ? selectedBirthdate.getFullYear() : null}
                            showAveragePhases={showAveragePhases}
                            totalWeeks={totalWeeks}
                        />
                    </div>

                    {/* Legend */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <GridLegend showAveragePhases={showAveragePhases} />
                    </div>
                </main>

                {/* RIGHT SIDEBAR — journal */}
                <aside
                    id="journal"
                    className="w-full xl:w-80 xl:min-w-[20rem] xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto border-t xl:border-t-0 xl:border-l border-gray-100 bg-gray-50"
                >
                    <div className="p-4 space-y-3">
                        <WeekJournalPanel
                            selectedDate={selectedJournalDate}
                            entry={selectedJournalEntry}
                            onDateChange={setSelectedJournalDate}
                            onSave={handleSaveJournalEntry}
                            onClear={handleClearJournalEntry}
                        />

                        <div className="rounded-xl bg-white border border-gray-100 px-4 py-3 shadow-sm">
                            <h3 className="text-xs font-semibold text-gray-700 mb-1">About the Grid</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                The grid is based on your life expectancy. Click on any week to add a reflection and make it yours.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default LifeSquaresPage;