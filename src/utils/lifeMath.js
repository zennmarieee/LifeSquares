export const TOTAL_WEEKS = 4000;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function parseBirthdate(value) {
    const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) {
        return null;
    }

    const month = Number(match[1]);
    const day = Number(match[2]);
    const year = Number(match[3]);

    const date = new Date(year, month - 1, day);
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}

export function calculateWeeksLived(birthdate) {
    if (!birthdate) {
        return 0;
    }

    const now = Date.now();
    const born = birthdate.getTime();

    if (born > now) {
        return 0;
    }

    return Math.min(TOTAL_WEEKS, Math.floor((now - born) / WEEK_MS));
}
