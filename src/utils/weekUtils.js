// Snap any date string (yyyy-mm-dd) to the Monday of that week
export function snapToWeekStart(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    // getDay(): 0=Sun,1=Mon,...,6=Sat — shift so Monday=0
    const day = date.getDay();
    const daysToMonday = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + daysToMonday);
    return toDateStr(date);
}

// Format a date object as yyyy-mm-dd
export function toDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// Get the Sunday (end of week) from a Monday date string
export function getWeekEnd(mondayStr) {
    const [y, m, d] = mondayStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 6);
    return date;
}

// Format a date range like "Jun 2 – Jun 8, 2026"
export function formatWeekRange(mondayStr) {
    const [y, m, d] = mondayStr.split('-').map(Number);
    const start = new Date(y, m - 1, d);
    const end = new Date(y, m - 1, d + 6);

    const fmt = (date, includeYear) =>
        date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            ...(includeYear ? { year: 'numeric' } : {}),
        });

    const sameMonth = start.getMonth() === end.getMonth();
    const startStr = fmt(start, false);
    const endStr   = fmt(end, true);
    return `${startStr} – ${endStr}`;
}

// Compute week number from birthdate (1-indexed)
export function getWeekNumber(mondayStr, birthdate) {
    if (!birthdate) return null;
    const [y, m, d] = mondayStr.split('-').map(Number);
    const date  = new Date(y, m - 1, d);
    const birth = new Date(
        birthdate.getFullYear(),
        birthdate.getMonth(),
        birthdate.getDate()
    );
    const ms = date.getTime() - birth.getTime();
    if (ms < 0) return null;
    return Math.floor(ms / (7 * 24 * 60 * 60 * 1000)) + 1;
}

// dateToWeekIndex (0-indexed, for grid coloring)
export function dateToWeekIndex(dateStr, birthdate) {
    if (!birthdate || !dateStr) return -1;
    const [y, m, d] = dateStr.split('-').map(Number);
    const date  = new Date(y, m - 1, d);
    const birth = new Date(
        birthdate.getFullYear(),
        birthdate.getMonth(),
        birthdate.getDate()
    );
    const ms = date.getTime() - birth.getTime();
    if (ms < 0) return -1;
    return Math.floor(ms / (7 * 24 * 60 * 60 * 1000));
}