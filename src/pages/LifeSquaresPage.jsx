import { useMemo, useState, useRef, useEffect } from 'react';
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

// ── Motivational quotes ────────────────────────────────────────────────────
const QUOTES = [
    { text: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain" },
    { text: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", author: "Maya Angelou" },
    { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
    { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
    { text: "The purpose of life is to live it, to taste experience to the utmost.", author: "Eleanor Roosevelt" },
    { text: "Do not go gentle into that good night. Rage, rage against the dying of the light.", author: "Dylan Thomas" },
    { text: "It's not about how long you live, but how fully you live.", author: "Unknown" },
    { text: "One day your life will flash before your eyes. Make sure it's worth watching.", author: "Gerard Way" },
    { text: "The fear of death follows from the fear of life. A man who lives fully is prepared to die at any time.", author: "Mark Twain" },
    { text: "We are here for a short time. Do the most you can with what you have.", author: "Unknown" },
    { text: "Every week is a blank page. You are the author.", author: "Unknown" },
    { text: "Someday is not a day of the week.", author: "Unknown" },
    { text: "Stop waiting for Friday, for summer, for someone to fall in love with you. Happiness is achieved when you stop waiting for it.", author: "Unknown" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "Twenty years from now you will be more disappointed by the things you didn't do than the ones you did.", author: "Mark Twain" },
];

function useRandomQuote() {
    const [quote, setQuote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    const shuffle = () => {
        setQuote((prev) => {
            let next;
            do { next = QUOTES[Math.floor(Math.random() * QUOTES.length)]; }
            while (next === prev);
            return next;
        });
    };
    return { quote, shuffle };
}

// ── Dark mode hook ─────────────────────────────────────────────────────────
function useDarkMode() {
    const [dark, setDark] = useState(() => {
        try { return localStorage.getItem('lifesquares-theme') === 'dark'; } catch { return false; }
    });

    useEffect(() => {
        const root = document.documentElement;
        if (dark) {
            root.classList.add('dark');
            localStorage.setItem('lifesquares-theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('lifesquares-theme', 'light');
        }
    }, [dark]);

    return { dark, setDark };
}

const NAV_ITEMS = [
    { id: 'grid',     label: 'Life Grid', icon: '▦' },
    { id: 'stats',    label: 'Stats',     icon: '📊' },
    // { id: 'blog',     label: 'Blog',      icon: '✍️',  href: '/blog' },
    // { id: 'settings', label: 'Settings',  icon: '⚙️' },
];

function LifeSquaresPage() {
    const [activeNav, setActiveNav] = useState('grid');
    const gridRef = useRef(null);
    const { dark, setDark } = useDarkMode();
    const { quote, shuffle } = useRandomQuote();

    const [birthdateInput, setBirthdateInput] = useState('');
    const [selectedBirthdate, setSelectedBirthdate] = useState(() => loadBirthdate());
    const [error, setError] = useState('');
    const [showAveragePhases, setShowAveragePhases] = useState(false);

    const savedLifespan = loadLifespan();
    const [lifespanOption, setLifespanOption] = useState(savedLifespan?.option ?? '80');
    const [customLifespanYears, setCustomLifespanYears] = useState(savedLifespan?.customYears ?? '85');

    const [journalEntries, setJournalEntries] = useState(() => loadJournalEntries());
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

    const handleLifespanOptionChange = (val) => { setLifespanOption(val); saveLifespan(val, customLifespanYears); };
    const handleCustomYearsChange    = (val) => { setCustomLifespanYears(val); saveLifespan(lifespanOption, val); };

    const handleSaveJournalEntry = (entry) => {
        const next = {
            ...journalEntries,
            [selectedJournalDate]: {
                title: entry.title ?? '', note: entry.note ?? '',
                mode: entry.mode ?? 'Reflection', tags: entry.tags ?? '',
                mood: entry.mood ?? '🙂', updatedAt: new Date().toISOString(),
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

    const handleJournalDateChange = (dateStr) => setSelectedJournalDate(snapToWeekStart(dateStr));

    const entryCount = Object.keys(journalEntries).length;

    // ── Shared dark-mode classes ───────────────────────────────────────────
    const card = dark ? 'bg-slate-800 border border-slate-700 rounded-xl shadow-sm' : 'bg-white border border-gray-100 rounded-xl shadow-sm';
    const text = dark ? 'text-slate-100' : 'text-gray-900';
    const muted = dark ? 'text-slate-400' : 'text-gray-400';

    // ── Stats view ─────────────────────────────────────────────────────────
    function StatsView() {
        const entriesByMood = Object.values(journalEntries).reduce((acc, e) => { acc[e.mood] = (acc[e.mood] ?? 0) + 1; return acc; }, {});
        const entriesByMode = Object.values(journalEntries).reduce((acc, e) => { if (e.mode) { acc[e.mode] = (acc[e.mode] ?? 0) + 1; } return acc; }, {});
        const streak = (() => {
            const dates = Object.keys(journalEntries).sort((a, b) => b.localeCompare(a));
            if (!dates.length) return 0;
            let s = 1;
            for (let i = 0; i < dates.length - 1; i++) {
                const diff = (new Date(dates[i]) - new Date(dates[i + 1])) / (1000 * 60 * 60 * 24 * 7);
                if (diff <= 1.5) s++; else break;
            }
            return s;
        })();

        return (
            <>
                <div className="mb-5">
                    <h1 className={`text-3xl font-semibold leading-tight ${text}`} style={{ fontFamily: 'Playfair Display, serif' }}>Stats</h1>
                    <p className={`text-sm mt-1 ${muted}`}>A snapshot of your life and journal.</p>
                </div>
                {selectedBirthdate && <LifeSummary weeksLived={weeksLived} weeksRemaining={weeksRemaining} totalWeeks={totalWeeks} lifespanYears={lifespanYears} birthdate={selectedBirthdate} dark={dark} />}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                        { label: 'Weeks journaled', value: entryCount, sub: `${weeksLived > 0 ? ((entryCount / weeksLived) * 100).toFixed(1) : 0}% of weeks lived` },
                        { label: 'Week streak',     value: streak,     sub: 'consecutive weeks' },
                    ].map(({ label, value, sub }) => (
                        <div key={label} className={`${card} px-4 py-3`}>
                            <p className={`text-xs mb-1 ${muted}`}>{label}</p>
                            <p className={`text-2xl font-semibold ${text}`}>{value}</p>
                            <p className={`text-xs mt-0.5 ${muted}`}>{sub}</p>
                        </div>
                    ))}
                </div>
                {entryCount > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { title: 'Mood breakdown', items: Object.entries(entriesByMood).sort(([,a],[,b]) => b-a), color: dark ? 'bg-slate-300' : 'bg-gray-800', renderKey: ([mood]) => <span className="text-base w-6">{mood}</span> },
                            { title: 'Entry modes',    items: Object.entries(entriesByMode).sort(([,a],[,b]) => b-a), color: 'bg-emerald-400',               renderKey: ([mode]) => <span className={`text-xs w-20 truncate ${text}`}>{mode}</span> },
                        ].map(({ title, items, color, renderKey }) => (
                            <div key={title} className={`${card} p-4`}>
                                <h2 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${muted}`}>{title}</h2>
                                <div className="space-y-2">
                                    {items.map(([key, count]) => (
                                        <div key={key} className="flex items-center gap-2">
                                            {renderKey([key, count])}
                                            <div className={`flex-1 rounded-full h-1.5 ${dark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                                                <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${(count / entryCount) * 100}%` }} />
                                            </div>
                                            <span className={`text-xs w-4 text-right ${muted}`}>{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`${card} p-8 text-center`}>
                        <p className={`text-sm ${muted}`}>No journal entries yet.</p>
                        <button type="button" onClick={() => setActiveNav('grid')} className="mt-3 text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                            Go to Life Grid
                        </button>
                    </div>
                )}
            </>
        );
    }

    const journalPanelProps = {
        selectedDate: selectedJournalDate, entry: selectedJournalEntry,
        onDateChange: handleJournalDateChange, onSave: handleSaveJournalEntry,
        onClear: handleClearJournalEntry, journalEntries, dark,
        onSelectEntry: (date) => setSelectedJournalDate(snapToWeekStart(date)),
        birthdate: selectedBirthdate,
    };

    return (
        <div className={`w-full min-h-screen transition-colors duration-200 ${dark ? 'dark bg-slate-900' : 'bg-gray-50'}`}>

            {/* ── LEFT SIDEBAR ─────────────────────────────────────── */}
            <aside className="hidden xl:flex flex-col fixed left-0 top-0 h-full w-52 z-10">
                <div className={`h-full flex flex-col justify-between py-5 px-4 border-r transition-colors duration-200 ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div>
                        {/* Logo */}
                        <div className="flex items-center gap-2.5 mb-7 px-1">
                            <div className={`w-7 h-7 rounded-md flex items-center justify-center text-sm ${dark ? 'bg-slate-100 text-slate-900' : 'bg-gray-900 text-white'}`}>▦</div>
                            <span className={`text-sm font-semibold tracking-tight ${text}`}>LifeSquares</span>
                        </div>

                        {/* Nav */}
                        <nav className="space-y-0.5">
                            {NAV_ITEMS.map(({ id, label, icon, href }) =>
                                href ? (
                                    <a key={id} href={href} className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${dark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
                                        <span className="w-4 text-center text-xs">{icon}</span>
                                        <span>{label}</span>
                                    </a>
                                ) : (
                                    <button key={id} type="button" onClick={() => setActiveNav(id)}
                                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors text-left ${
                                            activeNav === id
                                                ? dark ? 'bg-slate-800 text-slate-100 font-medium' : 'bg-gray-100 text-gray-900 font-medium'
                                                : dark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                        }`}
                                    >
                                        <span className="w-4 text-center text-xs">{icon}</span>
                                        <span>{label}</span>
                                    </button>
                                )
                            )}
                        </nav>
                    </div>

                    {/* Bottom panel */}
                    <div className="space-y-3">
                        {/* Motivational quote */}
                        <div
                            className={`rounded-lg p-3 border cursor-pointer transition-colors ${dark ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
                            onClick={shuffle}
                            title="Click for a new quote"
                        >
                            <p className={`text-xs leading-relaxed italic ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                "{quote.text}"
                            </p>
                            <p className={`text-xs mt-1.5 font-medium ${muted}`}>— {quote.author}</p>
                            <p className={`text-xs mt-1 ${muted} opacity-50`}>click to refresh ↻</p>
                        </div>

                        {/* Theme toggle */}
                        <div className="flex items-center justify-between px-1">
                            <span className={`text-xs ${muted}`}>Theme</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs">☀️</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={dark}
                                        onChange={(e) => setDark(e.target.checked)}
                                    />
                                    <div className={`w-8 h-4 rounded-full transition-colors ${dark ? 'bg-slate-500' : 'bg-gray-200'}`}>
                                        <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${dark ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                </label>
                                <span className="text-xs">🌙</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── MAIN + RIGHT PANEL ───────────────────────────────── */}
            <div className="xl:ml-52 flex min-h-screen pb-16 xl:pb-0">

                {/* CENTER */}
                <main className="flex-1 min-w-0 px-4 sm:px-6 py-6">
                    {activeNav === 'stats' ? <StatsView /> : (
                        <>
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <h1 className={`text-3xl font-semibold leading-tight ${text}`} style={{ fontFamily: 'Playfair Display, serif' }}>Life Grid</h1>
                                    <p className={`text-sm mt-1 ${muted}`}>Your life visualized as weeks. Each square is one week of your life.</p>
                                </div>
                                {selectedBirthdate && (
                                    <ShareGridButton gridRef={gridRef} weeksLived={weeksLived} totalWeeks={totalWeeks} lifespanYears={lifespanYears} birthdate={selectedBirthdate} dark={dark} />
                                )}
                            </div>

                            {/* Controls */}
                            <div className={`${card} p-4 mb-4`}>
                                <div className="flex flex-col lg:flex-row lg:items-end gap-3">
                                    <div className="flex-1">
                                        <BirthdateForm value={birthdateInput} onChange={setBirthdateInput} onSubmit={handleSubmit} dark={dark} />
                                    </div>
                                    <div className="w-full lg:w-64">
                                        <LifespanSelector lifespanOption={lifespanOption} customYears={customLifespanYears} onOptionChange={handleLifespanOptionChange} onCustomYearsChange={handleCustomYearsChange} dark={dark} />
                                    </div>
                                </div>
                                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                                {selectedBirthdate && !error && (
                                    <p className="text-xs text-emerald-500 mt-2">✓ Showing grid for {selectedBirthdate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                )}
                            </div>

                            {selectedBirthdate && !error && (
                                <LifeSummary weeksLived={weeksLived} weeksRemaining={weeksRemaining} totalWeeks={totalWeeks} lifespanYears={lifespanYears} birthdate={selectedBirthdate} dark={dark} />
                            )}

                            <div className="flex items-center mb-2.5">
                                <label className={`flex items-center gap-2 text-xs cursor-pointer select-none ${muted}`}>
                                    <input type="checkbox" checked={showAveragePhases} onChange={(e) => setShowAveragePhases(e.target.checked)} className="h-3.5 w-3.5 rounded" />
                                    Show average life phases
                                </label>
                            </div>

                            <div className={`${card} p-4 mb-3`}>
                                <LifeGrid ref={gridRef} weeksLived={weeksLived} birthYear={selectedBirthdate ? selectedBirthdate.getFullYear() : null} showAveragePhases={showAveragePhases} totalWeeks={totalWeeks} journaledWeeks={journaledWeeks} dark={dark} />
                            </div>

                            <div className={`${card} p-4`}>
                                <GridLegend showAveragePhases={showAveragePhases} dark={dark} />
                            </div>
                        </>
                    )}
                </main>

                {/* RIGHT PANEL */}
                <aside className={`hidden xl:flex flex-col w-80 shrink-0 border-l sticky top-0 h-screen overflow-y-auto transition-colors duration-200 ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div className="p-4 space-y-3">
                        <WeekJournalPanel {...journalPanelProps} />
                        <div className={`rounded-xl px-4 py-3 border ${dark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                            <h3 className={`text-xs font-semibold mb-1 ${text}`}>About the Grid</h3>
                            <p className={`text-xs leading-relaxed ${muted}`}>Darker green squares are weeks you've journaled. Each square = one week of your life.</p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* ── MOBILE BOTTOM TAB BAR ────────────────────────────── */}
            <nav className={`xl:hidden fixed bottom-0 left-0 right-0 z-20 border-t transition-colors duration-200 ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'}`}>
                <div className="flex">
                    {[
                        { id: 'grid',    label: 'Life Grid', icon: '▦' },
                        { id: 'journal', label: 'Journal',   icon: '📓' },
                        { id: 'stats',   label: 'Stats',     icon: '📊' },
                    ].map(({ id, label, icon }) => {
                        const active = activeNav === id;
                        return (
                            <button key={id} type="button" onClick={() => setActiveNav(id)}
                                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-xs transition-colors ${active ? (dark ? 'text-slate-100 font-medium' : 'text-gray-900 font-medium') : (dark ? 'text-slate-500' : 'text-gray-400')}`}
                            >
                                <span className="text-base leading-none">{icon}</span>
                                <span>{label}</span>
                                {active && <span className={`w-1 h-1 rounded-full mt-0.5 ${dark ? 'bg-slate-100' : 'bg-gray-900'}`} />}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* MOBILE JOURNAL fullscreen */}
            {activeNav === 'journal' && (
                <div className={`xl:hidden fixed inset-0 z-10 overflow-y-auto pb-20 pt-4 px-4 transition-colors duration-200 ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
                    <WeekJournalPanel {...journalPanelProps} />
                </div>
            )}
        </div>
    );
}

export default LifeSquaresPage;