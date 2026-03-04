function AppFooter() {
    return (
        <footer className="w-full mt-auto bg-gray-800 text-gray-200">
            <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
                <p>LifeSquares</p>
                <p>Visualize your life in weeks.</p>
                <p>© {new Date().getFullYear()}</p>
            </div>
        </footer>
    );
}

export default AppFooter;
