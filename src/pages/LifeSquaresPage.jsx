import { useMemo, useState } from 'react';
import AppHeader from '../components/AppHeader';
import BirthdateForm from '../components/BirthdateForm';
import GridLegend from '../components/GridLegend';
import LifeGrid from '../components/LifeGrid';
import LifeSummary from '../components/LifeSummary';
import { TOTAL_WEEKS, calculateWeeksLived, parseBirthdate } from '../utils/lifeMath';

function LifeSquaresPage() {
    const [birthdateInput, setBirthdateInput] = useState('');
    const [selectedBirthdate, setSelectedBirthdate] = useState(null);
    const [error, setError] = useState('');

    const weeksLived = useMemo(() => calculateWeeksLived(selectedBirthdate), [selectedBirthdate]);
    const weeksRemaining = TOTAL_WEEKS - weeksLived;

    const handleSubmit = (event) => {
        event.preventDefault();

        const parsedDate = parseBirthdate(birthdateInput);
        if (!parsedDate) {
            setError('Please select a valid birthdate (or type it as mm/dd/yyyy).');
            return;
        }

        if (parsedDate.getTime() > Date.now()) {
            setError('Birthdate cannot be in the future.');
            return;
        }

        setError('');
        setSelectedBirthdate(parsedDate);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            <AppHeader />
            <main className="flex flex-col items-center mt-12 w-full px-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2 tracking-wide text-center">YOUR LIFE IN WEEKS</h2>
                <p className="text-gray-500 text-center mb-6">You have roughly 4,000 weeks. How will you spend them?</p>
                <BirthdateForm
                    value={birthdateInput}
                    onChange={setBirthdateInput}
                    onSubmit={handleSubmit}
                />

                {error && <p className="text-sm text-red-600 mb-6">{error}</p>}

                {selectedBirthdate && !error && <LifeSummary weeksLived={weeksLived} weeksRemaining={weeksRemaining} />}

                <div className="flex justify-center items-center gap-12 mb-8">
                    <span className="text-5xl">🎓</span>
                    <span className="text-5xl">🏢</span>
                    <span className="text-5xl">❤️</span>
                </div>

                <LifeGrid weeksLived={weeksLived} />

                <GridLegend />
            </main>
            <footer className="w-full mt-auto bg-gray-800 h-16"></footer>
        </div>
    );
}

export default LifeSquaresPage;
