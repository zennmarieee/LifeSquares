export const TOTAL_WEEKS = 4000;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function buildDate(year, month, day) {
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

export function parseBirthdate(value) {
    const trimmedValue = value.trim();

    const slashFormatMatch = trimmedValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashFormatMatch) {
        const month = Number(slashFormatMatch[1]);
        const day = Number(slashFormatMatch[2]);
        const year = Number(slashFormatMatch[3]);

        return buildDate(year, month, day);
    }

    const dashFormatMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dashFormatMatch) {
        const year = Number(dashFormatMatch[1]);
        const month = Number(dashFormatMatch[2]);
        const day = Number(dashFormatMatch[3]);

        return buildDate(year, month, day);
    }

    return null;
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
