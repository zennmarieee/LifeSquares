import { NavLink } from 'react-router-dom';

function AppHeader() {
    const navClassName = ({ isActive }) =>
        isActive ? 'font-semibold text-gray-900' : 'hover:text-gray-900';

    return (
        <header className="w-full flex justify-between items-center px-8 py-6 border-b border-gray-300">
            <NavLink
                to="/"
                className="text-3xl font-bold text-gray-900 cursor-pointer"
                style={{ fontFamily: 'Playfair Display, serif' }}
            >
                LifeSquares
            </NavLink>
            <nav className="flex items-center gap-6 text-sm md:text-base text-gray-700">
                <NavLink to="/about" className={navClassName}>
                    About
                </NavLink>
                <NavLink to="/blog" className={navClassName}>
                    Blog
                </NavLink>
            </nav>
        </header>
    );
}

export default AppHeader;
