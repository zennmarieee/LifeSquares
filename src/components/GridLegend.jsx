function GridLegend() {
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
