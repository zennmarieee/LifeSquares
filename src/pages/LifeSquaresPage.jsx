import { useMemo, useState, useRef } from 'react';
import BirthdateForm from '../components/BirthdateForm';
import GridLegend from '../components/GridLegend';
import LifespanSelector from '../components/LifespanSelector';
import LifeGrid from '../components/LifeGrid';
import LifeSummary from '../components/LifeSummary';
import WeekJournalPanel from '../components/WeekJournalPanel';
import ShareGridButton from '../components/ShareGridButton';
import { snapToWeekStart, toDateStr, dateToWeekIndex } from '../utils/weekUtils';
import {
    calculateTotalWeeks,
    calculateWeeksLived,
    DEFAULT_LIFESPAN_YEARS,
    parseBirthdate,
} from '../utils/lifeMath';
import {
    loadJournalEntries,
    saveJournalEntries,
    loadBirthdate,
    saveBirthdate,
    loadLifespan,
    saveLifespan,
} from '../utils/storage';

const NAV_ITEMS = [
    { id: 'grid',     label: 'Life Grid', icon: '▦' },
    { id: 'stats',    label: 'Stats',     icon: '📊' },
    { id: 'blog',     label: 'Blog',      icon: '✍️',  href: '/blog' },
    { id: 'settings', label: 'Settings',  icon: '⚙️' },
];

function LifeSquaresPage() {
    const [activeNav, setActiveNav] = useState('grid');
    const gridRef = useRef(null);

    const [birthdateInput, setBirthdateInput] = useState('');
    const [selectedBirthdate, setSelectedBirthdate] = useState(() => loadBirthdate());
    const [error, setError] = useState('');
    const [showAveragePhases, setShowAveragePhases] = useState(false);

    const savedLifespan = loadLifespan();
    const [lifespanOption, setLifespanOption] = useState(savedLifespan?.option ?? '80');
    const [customLifespanYears, setCustomLifespanYears] = useState(savedLifespan?.customYears ?? '85');

    const [journalEntries, setJournalEntries] = useState(() => loadJournalEntries());
    // Always initialize to the Monday of the current week
    const [selectedJournalDate, setSelectedJournalDate] = useState(() =>
        snapToWeekStart(toDateStr(new Date()))
    );

    const lifespanYears = useMemo(() => {
        if (lifespanOption === 'custom') {
            const v = Number(customLifespanYears);
            return Number.isFinite(v) && v > 0 ? v : DEFAULT_LIFESPAN_YEARS;
        }
        return Number(lifespanOption);
    }, [lifespanOption, customLifespanYears]);

    const totalWeeks     = useMemo(() => calculateTotalWeeks(lifespanYears), [lifespanYears]);
    const rawWeeksLived  = useMemo(() => calculateWeeksLived(selectedBirthdate), [selectedBirthdate]);
    const weeksLived     = Math.min(rawWeeksLived, totalWeeks);
    const weeksRemaining = Math.max(totalWeeks - weeksLived, 0);

    // Build Set of week indices that have journal entries
    const journaledWeeks = useMemo(() => {
        if (!selectedBirthdate) return new Set();
        const s = new Set();
        Object.keys(journalEntries).forEach((dateStr) => {
            const idx = dateToWeekIndex(dateStr, selectedBirthdate);
            if (idx >= 0) s.add(idx);
        });
        return s;
    }, [journalEntries, selectedBirthdate]);

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
        saveBirthdate(parsed);
    };

    const handleLifespanOptionChange = (val) => {
        setLifespanOption(val);
        saveLifespan(val, customLifespanYears);
    };

    const handleCustomYearsChange = (val) => {
        setCustomLifespanYears(val);
        saveLifespan(lifespanOption, val);
    };

    const handleSaveJournalEntry = (entry) => {
        const next = {
            ...journalEntries,
            [selectedJournalDate]: {
                title:     entry.title ?? '',
                note:      entry.note ?? '',
                mode:      entry.mode ?? 'Reflection',
                tags:      entry.tags ?? '',
                mood:      entry.mood ?? '🙂',
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

    // Snap to Monday before setting
    const handleJournalDateChange = (dateStr) => {
        setSelectedJournalDate(snapToWeekStart(dateStr));
    };

    const entryCount = Object.keys(journalEntries).length;

    // ── Stats view ──────────────────────────────────────────────────────────
    function StatsView() {
        const entriesByMood = Object.values(journalEntries).reduce((acc, e) => {
            acc[e.mood] = (acc[e.mood] ?? 0) + 1; return acc;
        }, {});
        const entriesByMode = Object.values(journalEntries).reduce((acc, e) => {
            if (e.mode) { acc[e.mode] = (acc[e.mode] ?? 0) + 1; } return acc;
        }, {});

        const streak = (() => {
            const dates = Object.keys(journalEntries).sort((a, b) => b.localeCompare(a));
            if (dates.length === 0) return 0;
            let s = 1;
            for (let i = 0; i < dates.length - 1; i++) {
                const diff = (new Date(dates[i]) - new Date(dates[i + 1])) / (1000 * 60 * 60 * 24 * 7);
                if (diff <= 1.5) s++;
                else break;
            }
            return s;
        })();

        return (
            <>
                <div className="mb-5">
                    <h1 className="text-3xl font-semibold text-gray-900 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>Stats</h1>
                    <p className="text-sm text-gray-400 mt-1">A snapshot of your life and journal.</p>
                </div>

                {selectedBirthdate && (
                    <LifeSummary
                        weeksLived={weeksLived}
                        weeksRemaining={weeksRemaining}
                        totalWeeks={totalWeeks}
                        lifespanYears={lifespanYears}
                        birthdate={selectedBirthdate}
                    />
                )}

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                        <p className="text-xs text-gray-400 mb-1">Weeks journaled</p>
                        <p className="text-2xl font-semibold text-gray-900">{entryCount}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {weeksLived > 0 ? ((entryCount / weeksLived) * 100).toFixed(1) : 0}% of weeks lived
                        </p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                        <p className="text-xs text-gray-400 mb-1">Week streak</p>
                        <p className="text-2xl font-semibold text-gray-900">{streak}</p>
                        <p className="text-xs text-gray-400 mt-0.5">consecutive weeks</p>
                    </div>
                </div>

                {entryCount > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Mood breakdown</h2>
                            <div className="space-y-2">
                                {Object.entries(entriesByMood).sort(([,a],[,b]) => b - a).map(([mood, count]) => (
                                    <div key={mood} className="flex items-center gap-2">
                                        <span className="text-base w-6">{mood}</span>
                                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                            <div className="bg-gray-800 h-1.5 rounded-full transition-all" style={{ width: `${(count / entryCount) * 100}%` }} />
                                        </div>
                                        <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Entry modes</h2>
                            <div className="space-y-2">
                                {Object.entries(entriesByMode).sort(([,a],[,b]) => b - a).map(([mode, count]) => (
                                    <div key={mode} className="flex items-center gap-2">
                                        <span className="text-xs text-gray-600 w-20 truncate">{mode}</span>
                                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                            <div className="bg-emerald-400 h-1.5 rounded-full transition-all" style={{ width: `${(count / entryCount) * 100}%` }} />
                                        </div>
                                        <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm text-center">
                        <p className="text-gray-400 text-sm">No journal entries yet.</p>
                        <button
                            type="button"
                            onClick={() => setActiveNav('grid')}
                            className="mt-3 text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Go to Life Grid
                        </button>
                    </div>
                )}
            </>
        );
    }

    // ── Shared journal panel props ──────────────────────────────────────────
    const journalPanelProps = {
        selectedDate:   selectedJournalDate,
        entry:          selectedJournalEntry,
        onDateChange:   handleJournalDateChange,
        onSave:         handleSaveJournalEntry,
        onClear:        handleClearJournalEntry,
        journalEntries,
        onSelectEntry:  (date) => setSelectedJournalDate(snapToWeekStart(date)),
        birthdate:      selectedBirthdate,
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">

            {/* ── LEFT SIDEBAR ─────────────────────────────────────────── */}
            <aside className="hidden xl:flex flex-col fixed left-0 top-0 h-full w-52 z-10">
                <div className="bg-white border-r border-gray-100 h-full flex flex-col justify-between py-5 px-4">
                    <div>
                        <div className="flex items-center gap-2.5 mb-7 px-1">
                            <div className="w-7 h-7 bg-gray-900 text-white rounded-md flex items-center justify-center text-sm">▦</div>
                            <span className="text-sm font-semibold tracking-tight text-gray-900">LifeSquares</span>
                        </div>
                        <nav className="space-y-0.5">
                            {NAV_ITEMS.map(({ id, label, icon, href }) =>
                                href ? (
                                    <a key={id} href={href} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                                        <span className="w-4 text-center text-xs">{icon}</span>
                                        <span>{label}</span>
                                    </a>
                                ) : (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setActiveNav(id)}
                                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors text-left ${
                                            activeNav === id ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                        }`}
                                    >
                                        <span className="w-4 text-center text-xs">{icon}</span>
                                        <span>{label}</span>
                                    </button>
                                )
                            )}
                        </nav>
                    </div>
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

            {/* ── MAIN + RIGHT PANEL ───────────────────────────────────── */}
            <div className="xl:ml-52 flex min-h-screen pb-16 xl:pb-0">

                {/* CENTER */}
                <main className="flex-1 min-w-0 px-4 sm:px-6 py-6">
                    {activeNav === 'stats' ? (
                        <StatsView />
                    ) : (
                        <>
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <h1 className="text-3xl font-semibold text-gray-900 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        Life Grid
                                    </h1>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Your life visualized as weeks. Each square is one week of your life.
                                    </p>
                                </div>
                                {selectedBirthdate && (
                                    <ShareGridButton
                                        gridRef={gridRef}
                                        weeksLived={weeksLived}
                                        totalWeeks={totalWeeks}
                                        lifespanYears={lifespanYears}
                                        birthdate={selectedBirthdate}
                                    />
                                )}
                            </div>

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
                                            onOptionChange={handleLifespanOptionChange}
                                            onCustomYearsChange={handleCustomYearsChange}
                                        />
                                    </div>
                                </div>
                                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                                {selectedBirthdate && !error && (
                                    <p className="text-xs text-emerald-600 mt-2">
                                        ✓ Showing grid for {selectedBirthdate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                )}
                            </div>

                            {selectedBirthdate && !error && (
                                <LifeSummary
                                    weeksLived={weeksLived}
                                    weeksRemaining={weeksRemaining}
                                    totalWeeks={totalWeeks}
                                    lifespanYears={lifespanYears}
                                    birthdate={selectedBirthdate}
                                />
                            )}

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

                            <div className="bg-white border border-gray-100 rounded-xl p-4 mb-3 shadow-sm">
                                <LifeGrid
                                    ref={gridRef}
                                    weeksLived={weeksLived}
                                    birthYear={selectedBirthdate ? selectedBirthdate.getFullYear() : null}
                                    showAveragePhases={showAveragePhases}
                                    totalWeeks={totalWeeks}
                                    journaledWeeks={journaledWeeks}
                                />
                            </div>

                            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                <GridLegend showAveragePhases={showAveragePhases} />
                            </div>
                        </>
                    )}
                </main>

                {/* RIGHT PANEL — always visible on desktop */}
                <aside className="hidden xl:flex flex-col w-80 shrink-0 border-l border-gray-100 bg-white sticky top-0 h-screen overflow-y-auto">
                    <div className="p-4 space-y-3">
                        <WeekJournalPanel {...journalPanelProps} />
                        <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                            <h3 className="text-xs font-semibold text-gray-700 mb-1">About the Grid</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Darker green squares are weeks you've journaled. Each square = one week of your life.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* ── MOBILE BOTTOM TAB BAR ────────────────────────────────── */}
            <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100">
                <div className="flex">
                    {[
                        { id: 'grid',    label: 'Life Grid', icon: '▦' },
                        { id: 'journal', label: 'Journal',   icon: '📓' },
                        { id: 'stats',   label: 'Stats',     icon: '📊' },
                    ].map(({ id, label, icon }) => {
                        const active = activeNav === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setActiveNav(id)}
                                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-xs transition-colors ${
                                    active ? 'text-gray-900 font-medium' : 'text-gray-400'
                                }`}
                            >
                                <span className="text-base leading-none">{icon}</span>
                                <span>{label}</span>
                                {active && <span className="w-1 h-1 rounded-full bg-gray-900 mt-0.5" />}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* MOBILE JOURNAL fullscreen */}
            {activeNav === 'journal' && (
                <div className="xl:hidden fixed inset-0 z-10 bg-gray-50 overflow-y-auto pb-20 pt-4 px-4">
                    <WeekJournalPanel {...journalPanelProps} />
                </div>
            )}
        </div>
    );
}

export default LifeSquaresPage;