import { useRef, useEffect, useState, forwardRef } from 'react';
import { getAveragePhaseForAge, WEEKS_PER_YEAR } from '../utils/lifeMath';

const LABEL_EVERY = 5;

const LifeGrid = forwardRef(function LifeGrid(
    { weeksLived, birthYear, showAveragePhases, totalWeeks, journaledWeeks = new Set() },
    ref
) {
    const totalYears = Math.ceil(totalWeeks / WEEKS_PER_YEAR);
    const currentWeekIndex = birthYear && weeksLived < totalWeeks ? weeksLived : -1;
    const gridRef = useRef(null);
    const [rowHeight, setRowHeight] = useState(13);

    // expose grid DOM node to parent for html-to-image
    useEffect(() => {
        if (ref && gridRef.current) {
            if (typeof ref === 'function') ref(gridRef.current);
            else ref.current = gridRef.current;
        }
    }, [ref]);

    useEffect(() => {
        if (!gridRef.current) return;
        const measure = () => {
            const first = gridRef.current.querySelector('.life-square');
            if (first) setRowHeight(first.getBoundingClientRect().height + 3);
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(gridRef.current);
        return () => ro.disconnect();
    }, [totalWeeks]);

    function getSquareStyle(weekIndex) {
        const isPast    = weekIndex < weeksLived;
        const isCurrent = weekIndex === currentWeekIndex;
        const isFuture  = !isPast && !isCurrent;
        const isJournaled = journaledWeeks.has(weekIndex);

        if (showAveragePhases) {
            const age = Math.floor(weekIndex / WEEKS_PER_YEAR);
            const phase = getAveragePhaseForAge(age);
            const phaseColors = {
                'childhood':        '#93c5fd',
                'teen-young-adult': '#6ee7b7',
                'working-years':    '#fcd34d',
                'retirement-later': '#c4b5fd',
            };
            const color = phaseColors[phase.key] ?? '#fcd34d';
            return {
                className: 'life-square',
                style: {
                    background: isCurrent ? '#111827' : color,
                    opacity: isFuture ? 0.3 : 1,
                    outline: isJournaled && !isFuture ? '2px solid #111827' : undefined,
                    outlineOffset: '1px',
                },
            };
        }

        if (isCurrent) return {
            className: 'life-square',
            style: { background: '#111827' },
        };

        if (isPast) return {
            className: 'life-square',
            style: {
                // journaled = richer green, normal past = soft green
                background: isJournaled ? '#16a34a' : '#4ade80',
                outline: isJournaled ? '2px solid #15803d' : undefined,
                outlineOffset: isJournaled ? '1px' : undefined,
            },
        };

        return {
            className: 'life-square',
            style: {
                background: '#e2e8f0',
                border: '1px solid #cbd5e1',
                boxSizing: 'border-box',
            },
        };
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
                        { color: '#4ade80', label: 'Past' },
                        { color: '#16a34a', label: 'Journaled', outline: '#15803d' },
                        { color: '#111827', label: 'Current' },
                        { color: '#e2e8f0', label: 'Future', border: '#cbd5e1' },
                    ].map(({ color, label, outline, border }) => (
                        <span key={label} className="flex items-center gap-1.5">
                            <span style={{
                                display: 'inline-block',
                                width: 10, height: 10,
                                borderRadius: 2,
                                background: color,
                                border: border ? `1px solid ${border}` : 'none',
                                outline: outline ? `2px solid ${outline}` : 'none',
                                outlineOffset: '1px',
                                flexShrink: 0,
                            }} />
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
                        <div key={year} className="life-grid-year-label" style={{ height: rowHeight }}>
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
                        const { className, style } = getSquareStyle(weekIndex);
                        const isJournaled = journaledWeeks.has(weekIndex);
                        return (
                            <div
                                key={weekIndex}
                                role="gridcell"
                                tabIndex={weekIndex === currentWeekIndex ? 0 : -1}
                                aria-label={`Age ${year}, week ${weekInYear + 1}${isJournaled ? ' (journaled)' : ''}`}
                                title={`Age ${year}, week ${weekInYear + 1}${isJournaled ? ' ✏️ journaled' : ''}`}
                                className={className}
                                style={style}
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
});

export default LifeGrid;