import { NavLink } from 'react-router-dom';

function AppHeader() {
    const navClassName = ({ isActive }) =>
        isActive ? 'font-medium text-gray-900' : 'text-gray-600 hover:text-gray-900';

    return (
        <header className="fixed top-0 left-0 w-full z-50 border-b" style={{ borderColor: 'rgba(15,23,42,0.06)', background: 'var(--background)' }}>
            <div className="page-center flex items-center justify-between h-12">
                <div className="flex items-center gap-4">
                    <NavLink to="/" className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                        LifeSquares
                    </NavLink>
                    <nav className="hidden md:flex items-center gap-4 text-sm">
                        <NavLink to="/" className={navClassName} end>
                            LIFE GRID
                        </NavLink>
                        <NavLink to="/" className={navClassName}>
                            JOURNAL
                        </NavLink>
                        <NavLink to="/blog" className={navClassName}>
                            BLOG
                        </NavLink>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors active:scale-95 duration-200">
                        <span className="material-symbols-outlined">calendar_today</span>
                    </button>
                    <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors active:scale-95 duration-200">
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default AppHeader;
