import { getAveragePhaseForAge, TOTAL_WEEKS } from '../utils/lifeMath';

function LifeGrid({ weeksLived, birthYear, showAveragePhases }) {
    const weeksPerYear = 52;
    const totalYears = Math.ceil(TOTAL_WEEKS / weeksPerYear);

    return (
        <div className="w-full max-w-5xl overflow-x-auto pb-4 mb-8">
            <div className="min-w-[780px] space-y-1">
                {Array.from({ length: totalYears }).map((_, yearIndex) => (
                    <div key={yearIndex} className="flex items-center gap-2">
                        <span className="w-14 text-[10px] text-gray-500 text-right">
                            Age {yearIndex}
                        </span>

                        <div className="grid grid-cols-[repeat(52,minmax(0,1fr))] gap-1 flex-1">
                            {Array.from({ length: weeksPerYear }).map((__, weekInYear) => {
                                const weekIndex = yearIndex * weeksPerYear + weekInYear;
                                const ageAtWeek = Math.floor(weekIndex / weeksPerYear);

                                if (weekIndex >= TOTAL_WEEKS) {
                                    return <div key={weekInYear} className="aspect-square rounded-sm bg-transparent" />;
                                }

                                const phase = getAveragePhaseForAge(ageAtWeek);

                                const baseClass = showAveragePhases
                                    ? phase.colorClass
                                    : weekIndex < weeksLived
                                        ? 'bg-gray-800'
                                        : 'bg-gray-300';

                                const livedStateClass = showAveragePhases && weekIndex >= weeksLived ? 'opacity-35' : '';

                                return (
                                    <div
                                        key={weekInYear}
                                        className={`aspect-square rounded-sm ${baseClass} ${livedStateClass}`}
                                        title={showAveragePhases ? `Week ${weekIndex + 1} • ${phase.label}` : `Week ${weekIndex + 1}`}
                                    ></div>
                                );
                            })}
                        </div>

                        <span className="w-14 text-[10px] text-gray-500 text-left">
                            {birthYear ? birthYear + yearIndex : '-'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LifeGrid;
