import { useState } from 'react';
import { toPng } from 'html-to-image';

function ShareGridButton({ gridRef, weeksLived, totalWeeks, lifespanYears, birthdate }) {
    const [state, setState] = useState('idle'); // idle | generating | done | error

    const pct = totalWeeks > 0 ? ((weeksLived / totalWeeks) * 100).toFixed(1) : '0.0';

    const handleExport = async () => {
        if (!gridRef?.current) return;
        setState('generating');

        try {
            // Wrap the grid in a styled container for the export
            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                position: fixed;
                top: -9999px;
                left: -9999px;
                background: #ffffff;
                padding: 32px;
                border-radius: 16px;
                width: ${gridRef.current.offsetWidth + 64}px;
                font-family: Inter, system-ui, sans-serif;
            `;

            // Header
            const header = document.createElement('div');
            header.style.cssText = 'margin-bottom: 16px;';
            header.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                    <div style="width:24px;height:24px;background:#111827;border-radius:6px;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;">▦</div>
                    <span style="font-size:14px;font-weight:600;color:#111827;">LifeSquares</span>
                </div>
                <div style="font-size:22px;font-weight:700;color:#111827;margin-bottom:2px;">
                    ${pct}% of life lived
                </div>
                <div style="font-size:12px;color:#9ca3af;">
                    ${weeksLived.toLocaleString()} weeks lived · ${(totalWeeks - weeksLived).toLocaleString()} remaining · ${lifespanYears} year expectancy
                </div>
            `;

            // Clone the grid
            const gridClone = gridRef.current.cloneNode(true);
            gridClone.style.width = gridRef.current.offsetWidth + 'px';

            // Footer
            const footer = document.createElement('div');
            footer.style.cssText = 'margin-top:16px; font-size:11px; color:#d1d5db; text-align:right;';
            footer.textContent = 'lifesquares.app';

            wrapper.appendChild(header);
            wrapper.appendChild(gridClone);
            wrapper.appendChild(footer);
            document.body.appendChild(wrapper);

            const dataUrl = await toPng(wrapper, { pixelRatio: 2, cacheBust: true });
            document.body.removeChild(wrapper);

            // Download
            const link = document.createElement('a');
            link.download = `lifesquares-${birthdate ? birthdate.getFullYear() : 'grid'}.png`;
            link.href = dataUrl;
            link.click();

            setState('done');
            setTimeout(() => setState('idle'), 2500);
        } catch (err) {
            console.error('Export failed:', err);
            setState('error');
            setTimeout(() => setState('idle'), 2500);
        }
    };

    const labels = {
        idle:       '↗ Share grid',
        generating: 'Generating...',
        done:       '✓ Downloaded!',
        error:      'Try again',
    };

    const colors = {
        idle:       'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
        generating: 'bg-white border border-gray-200 text-gray-400 cursor-wait',
        done:       'bg-emerald-50 border border-emerald-200 text-emerald-700',
        error:      'bg-red-50 border border-red-200 text-red-600',
    };

    return (
        <button
            type="button"
            onClick={handleExport}
            disabled={state === 'generating'}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${colors[state]}`}
        >
            {labels[state]}
        </button>
    );
}

export default ShareGridButton;