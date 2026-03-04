function LifeSummary({ weeksLived, weeksRemaining, totalWeeks, lifespanYears }) {
    return (
        <p className="text-sm text-gray-600 mb-6 text-center">
            {weeksLived.toLocaleString()} weeks lived • {weeksRemaining.toLocaleString()} weeks remaining • {totalWeeks.toLocaleString()} total weeks ({lifespanYears} years)
        </p>
    );
}

export default LifeSummary;
