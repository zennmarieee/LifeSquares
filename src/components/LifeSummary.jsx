function LifeSummary({ weeksLived, weeksRemaining }) {
    return (
        <p className="text-sm text-gray-600 mb-6 text-center">
            {weeksLived.toLocaleString()} weeks lived • {weeksRemaining.toLocaleString()} weeks remaining
        </p>
    );
}

export default LifeSummary;
