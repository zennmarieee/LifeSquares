import { AVERAGE_LIFE_PHASES } from '../utils/lifeMath';

function GridLegend({ showAveragePhases }) {
    if (showAveragePhases) {
        return (
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12 text-xs text-gray-600">
                {AVERAGE_LIFE_PHASES.map((phase) => (
                    <div key={phase.key} className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-sm ${phase.colorClass}`}></span>
                        <span>{phase.label}</span>
                    </div>
                ))}
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-gray-400 opacity-35"></span>
                    <span>Future weeks (faded)</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 mb-12 text-xs text-gray-600">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-gray-800"></span>
                <span>Lived</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-gray-300"></span>
                <span>Remaining</span>
            </div>
        </div>
    );
}

export default GridLegend;
