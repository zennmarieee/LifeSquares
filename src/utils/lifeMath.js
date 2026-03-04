export const WEEKS_PER_YEAR = 52;
export const DEFAULT_LIFESPAN_YEARS = 80;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const AVERAGE_LIFE_PHASES = [
    {
        key: 'childhood',
        label: 'Childhood (0-12)',
        startAge: 0,
        endAge: 12,
        colorClass: 'bg-sky-300',
    },
    {
        key: 'teen-young-adult',
        label: 'Teen & Early Adult (13-24)',
        startAge: 13,
        endAge: 24,
        colorClass: 'bg-emerald-300',
    },
    {
        key: 'working-years',
        label: 'Working Years (25-64)',
        startAge: 25,
        endAge: 64,
        colorClass: 'bg-amber-300',
    },
    {
        key: 'retirement-later',
        label: 'Retirement & Later Life (65+)',
        startAge: 65,
        endAge: Number.POSITIVE_INFINITY,
        colorClass: 'bg-violet-300',
    },
];

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

    return Math.floor((now - born) / WEEK_MS);
}

export function calculateTotalWeeks(lifespanYears) {
    const years = Number(lifespanYears);

    if (!Number.isFinite(years) || years <= 0) {
        return DEFAULT_LIFESPAN_YEARS * WEEKS_PER_YEAR;
    }

    return Math.round(years * WEEKS_PER_YEAR);
}

export function getAveragePhaseForAge(age) {
    return AVERAGE_LIFE_PHASES.find((phase) => age >= phase.startAge && age <= phase.endAge) ?? AVERAGE_LIFE_PHASES[AVERAGE_LIFE_PHASES.length - 1];
}
