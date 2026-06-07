import { useRef, useEffect, useState } from 'react';
import { getAveragePhaseForAge, WEEKS_PER_YEAR } from '../utils/lifeMath';

const LABEL_EVERY = 5;

function LifeGrid({ weeksLived, birthYear, showAveragePhases, totalWeeks }) {
    const totalYears = Math.ceil(totalWeeks / WEEKS_PER_YEAR);
    const currentWeekIndex = birthYear && weeksLived < totalWeeks ? weeksLived : -1;
    const gridRef = useRef(null);
    const [rowHeight, setRowHeight] = useState(13);

    useEffect(() => {
        if (!gridRef.current) return;
        const measure = () => {
            const firstCell = gridRef.current.querySelector('.life-square');
            if (firstCell) {
                setRowHeight(firstCell.getBoundingClientRect().height + 3);
            }
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(gridRef.current);
        return () => ro.disconnect();
    }, [totalWeeks]);

    function getSquareClass(weekIndex) {
        const isPast = weekIndex < weeksLived;
        const isCurrent = weekIndex === currentWeekIndex;
        const isFuture = !isPast && !isCurrent;

        if (showAveragePhases) {
            const age = Math.floor(weekIndex / WEEKS_PER_YEAR);
            const phase = getAveragePhaseForAge(age);
            const phaseKey = {
                'childhood': 'childhood',
                'teen-young-adult': 'teen',
                'working-years': 'working',
                'retirement-later': 'retirement',
            }[phase.key] ?? 'working';
            return ['life-square', `sq-phase-${phaseKey}`, isFuture ? 'sq-phase-future' : '', isCurrent ? 'sq-current' : ''].filter(Boolean).join(' ');
        }

        if (isCurrent) return 'life-square sq-current';
        if (isPast)    return 'life-square sq-past';
        return 'life-square sq-future';
    }

    const allWeeks = Array.from({ length: totalYears * WEEKS_PER_YEAR }, (_, i) => i);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">Life Grid</span>
                    <span className="text-xs text-gray-400">· 52 weeks per row</span>
                </div>
                <div className="flex items-center gap-4">
                    {[
                        { cls: 'sq-past',    label: 'Past',    color: '#4ade80' },
                        { cls: 'sq-current', label: 'Current', color: '#111827' },
                        { cls: 'sq-future',  label: 'Future',  color: '#e2e8f0' },
                    ].map(({ label, color }) => (
                        <span key={label} className="flex items-center gap-1.5">
                            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: color, border: label === 'Future' ? '1px solid #cbd5e1' : 'none', flexShrink: 0 }} />
                            <span className="text-xs text-gray-500">{label}</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Grid + year labels */}
            <div className="life-grid-wrapper">
                {/* Year labels */}
                <div className="life-grid-year-labels" aria-hidden="true">
                    {Array.from({ length: totalYears }, (_, year) => (
                        <div
                            key={year}
                            className="life-grid-year-label"
                            style={{ height: rowHeight }}
                        >
                            {year % LABEL_EVERY === 0 ? year : ''}
                        </div>
                    ))}
                </div>

                {/* Squares */}
                <div
                    className="life-grid-container"
                    ref={gridRef}
                    role="grid"
                    aria-label="Life weeks grid"
                >
                    {allWeeks.map((weekIndex) => {
                        const year = Math.floor(weekIndex / WEEKS_PER_YEAR);
                        const weekInYear = weekIndex % WEEKS_PER_YEAR;
                        return (
                            <div
                                key={weekIndex}
                                role="gridcell"
                                tabIndex={weekIndex === currentWeekIndex ? 0 : -1}
                                aria-label={`Age ${year}, week ${weekInYear + 1}`}
                                title={`Age ${year}, week ${weekInYear + 1}`}
                                className={getSquareClass(weekIndex)}
                            />
                        );
                    })}
                </div>
            </div>

            <p className="text-xs text-gray-400 text-center mt-3">
                Each square represents one week of your life
            </p>
        </div>
    );
}

export default LifeGrid;