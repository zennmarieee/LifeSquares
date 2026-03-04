const JOURNAL_STORAGE_KEY = 'lifesquares-journal-v1';

export function loadJournalEntries() {
    if (typeof window === 'undefined') {
        return {};
    }

    try {
        const rawValue = window.localStorage.getItem(JOURNAL_STORAGE_KEY);
        if (!rawValue) {
            return {};
        }

        const parsedValue = JSON.parse(rawValue);
        return parsedValue && typeof parsedValue === 'object' ? parsedValue : {};
    } catch {
        return {};
    }
}

export function saveJournalEntries(entries) {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
}
