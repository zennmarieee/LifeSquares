import { TOTAL_WEEKS } from '../utils/lifeMath';

function LifeGrid({ weeksLived }) {
    return (
        <div className="w-full max-w-5xl overflow-x-auto pb-4 mb-8">
            <div className="grid grid-cols-[repeat(52,minmax(0,1fr))] gap-1 min-w-[720px]">
                {Array.from({ length: TOTAL_WEEKS }).map((_, index) => (
                    <div
                        key={index}
                        className={`aspect-square rounded-sm ${index < weeksLived ? 'bg-gray-800' : 'bg-gray-300'}`}
                        title={`Week ${index + 1}`}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default LifeGrid;
