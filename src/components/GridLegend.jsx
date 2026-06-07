import { AVERAGE_LIFE_PHASES } from '../utils/lifeMath';

const PHASE_COLORS = {
    'childhood':        '#93c5fd',
    'teen-young-adult': '#6ee7b7',
    'working-years':    '#fcd34d',
    'retirement-later': '#c4b5fd',
};

function Swatch({ color, border }) {
    return (
        <span
            style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: 3,
                background: color,
                border: border ? '1px solid #cbd5e1' : 'none',
                flexShrink: 0,
            }}
        />
    );
}

function GridLegend({ showAveragePhases }) {
    if (showAveragePhases) {
        return (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
                {AVERAGE_LIFE_PHASES.map((phase) => (
                    <div key={phase.key} className="flex items-center gap-1.5">
                        <Swatch color={PHASE_COLORS[phase.key]} />
                        <span>{phase.label}</span>
                    </div>
                ))}
                <div className="flex items-center gap-1.5">
                    <Swatch color="#fcd34d" />
                    <span style={{ opacity: 0.4 }}>Future weeks (faded)</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
                <Swatch color="#4ade80" />
                <span>Weeks lived</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Swatch color="#111827" />
                <span>Current week</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Swatch color="#e2e8f0" border />
                <span>Weeks remaining</span>
            </div>
        </div>
    );
}

export default GridLegend;