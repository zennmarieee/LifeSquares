const JOURNAL_KEY = 'lifesquares-journal-v1';
const BIRTHDATE_KEY = 'lifesquares-birthdate-v1';
const LIFESPAN_KEY = 'lifesquares-lifespan-v1';

export function loadJournalEntries() {
    try {
        const raw = window.localStorage.getItem(JOURNAL_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch { return {}; }
}

export function saveJournalEntries(entries) {
    try {
        window.localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
    } catch {}
}

export function loadBirthdate() {
    try {
        const raw = window.localStorage.getItem(BIRTHDATE_KEY);
        if (!raw) return null;
        const d = new Date(raw);
        return isNaN(d.getTime()) ? null : d;
    } catch { return null; }
}

export function saveBirthdate(date) {
    try {
        if (date) window.localStorage.setItem(BIRTHDATE_KEY, date.toISOString());
        else window.localStorage.removeItem(BIRTHDATE_KEY);
    } catch {}
}

export function loadLifespan() {
    try {
        const raw = window.localStorage.getItem(LIFESPAN_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed ?? null;
    } catch { return null; }
}

export function saveLifespan(option, customYears) {
    try {
        window.localStorage.setItem(LIFESPAN_KEY, JSON.stringify({ option, customYears }));
    } catch {}
}