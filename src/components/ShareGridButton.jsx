import { useState } from 'react';
import { toPng } from 'html-to-image';

function ShareGridButton({ gridRef, weeksLived, totalWeeks, lifespanYears, birthdate }) {
    const [state, setState] = useState('idle');

    const pct = totalWeeks > 0 ? ((weeksLived / totalWeeks) * 100).toFixed(1) : '0.0';

    const handleExport = async () => {
        if (!gridRef?.current) {
            alert('Grid not ready yet. Please enter your birthdate first.');
            return;
        }
        setState('generating');

        try {
            // Use the grid container directly — simpler and more reliable
            const dataUrl = await toPng(gridRef.current, {
                pixelRatio: 2,
                cacheBust: true,
                backgroundColor: '#ffffff',
                style: {
                    padding: '16px',
                    borderRadius: '12px',
                },
            });

            // Build final image with header using canvas
            const gridImg = new Image();
            gridImg.src = dataUrl;
            await new Promise((res) => { gridImg.onload = res; });

            const PADDING   = 32;
            const HEADER_H  = 80;
            const FOOTER_H  = 32;
            const W         = gridImg.width + PADDING * 2;
            const H         = gridImg.height + HEADER_H + FOOTER_H + PADDING;

            const canvas  = document.createElement('canvas');
            canvas.width  = W;
            canvas.height = H;
            const ctx     = canvas.getContext('2d');

            // Background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, W, H);

            // Logo box
            ctx.fillStyle = '#111827';
            roundRect(ctx, PADDING, PADDING, 28, 28, 6);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('▦', PADDING + 14, PADDING + 19);

            // App name
            ctx.fillStyle = '#111827';
            ctx.font = 'bold 14px Inter, system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('LifeSquares', PADDING + 36, PADDING + 18);

            // Main stat
            ctx.font = 'bold 22px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#111827';
            ctx.fillText(`${pct}% of life lived`, PADDING + 36, PADDING + 44);

            // Sub stat
            ctx.font = '12px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#9ca3af';
            ctx.fillText(
                `${weeksLived.toLocaleString()} weeks lived · ${(totalWeeks - weeksLived).toLocaleString()} remaining · ${lifespanYears}yr expectancy`,
                PADDING + 36,
                PADDING + 62
            );

            // Grid image
            ctx.drawImage(gridImg, PADDING, HEADER_H + PADDING / 2);

            // Footer
            ctx.font = '11px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#d1d5db';
            ctx.textAlign = 'right';
            ctx.fillText('lifesquares.app', W - PADDING, H - 12);

            // Download
            const link      = document.createElement('a');
            link.download   = `lifesquares-${birthdate ? birthdate.getFullYear() : 'grid'}.png`;
            link.href       = canvas.toDataURL('image/png');
            link.click();

            setState('done');
            setTimeout(() => setState('idle'), 2500);
        } catch (err) {
            console.error('Export failed:', err);
            setState('error');
            setTimeout(() => setState('idle'), 2500);
        }
    };

    // Helper: rounded rect
    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    const labels = {
        idle:       '↗ Share grid',
        generating: 'Generating...',
        done:       '✓ Downloaded!',
        error:      'Failed — try again',
    };

    const styles = {
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
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${styles[state]}`}
        >
            {labels[state]}
        </button>
    );
}

export default ShareGridButton;