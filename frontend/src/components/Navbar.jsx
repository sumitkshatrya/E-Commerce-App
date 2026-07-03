import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    theme,
    toggleTheme,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-premium transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src={assets.logo} className="w-28 filter dark:brightness-110 dark:contrast-125 transition-transform duration-300 group-hover:scale-105" alt="logo" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <NavLink to="/" className={({ isActive }) => `text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition nav-link-hover ${isActive ? 'text-black dark:text-white nav-link-active' : ''}`}>
            HOME
          </NavLink>
          <NavLink to="/collection" className={({ isActive }) => `text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition nav-link-hover ${isActive ? 'text-black dark:text-white nav-link-active' : ''}`}>
            COLLECTION
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition nav-link-hover ${isActive ? 'text-black dark:text-white nav-link-active' : ''}`}>
            ABOUT
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition nav-link-hover ${isActive ? 'text-black dark:text-white nav-link-active' : ''}`}>
            CONTACT
          </NavLink>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Theme Toggler */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition duration-200"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            )}
          </button>

          {/* Search Icon */}
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* User Profile */}
          <div className="relative group">
            <button
              onClick={() => (token ? null : navigate("/login"))}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition"
              aria-label="User Profile"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {token && (
              <div className="absolute right-0 top-full pt-2 w-44 hidden group-hover:block transition duration-200 animate-scale-in">
                <div className="bg-premium-card shadow-lg rounded-xl border-premium py-2 text-sm text-gray-600 dark:text-gray-300">
                  <p
                    onClick={() => navigate('/profile')}
                    className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white cursor-pointer transition"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/profile') }}
                    aria-label="Go to My Profile"
                  >
                    My Profile
                  </p>
                  <p 
                    onClick={() => navigate('/orders')} 
                    className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white cursor-pointer transition"
                  >
                    Orders
                  </p>
                  <div className="border-t border-premium my-1"></div>
                  <p 
                    onClick={logout} 
                    className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-red-500 hover:text-red-600 cursor-pointer transition"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute top-1 right-1 min-w-4 h-4 px-1 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black font-semibold text-[9px] rounded-full shadow-sm transition">
              {getCartCount()}
            </span>
          </Link>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setVisible(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition"
            aria-label="Open Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar Mobile Navigation */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setVisible(false)}
      >
        <div
          className={`absolute top-0 right-0 bottom-0 w-3/4 max-w-xs bg-premium-card border-l border-premium p-6 flex flex-col gap-6 shadow-2xl transition-transform duration-300 ${visible ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between pb-4 border-b border-premium">
            <span className="font-semibold text-lg">Menu</span>
            <button
              onClick={() => setVisible(false)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-4">
            <NavLink
              onClick={() => setVisible(false)}
              className={({ isActive }) => `py-2 px-3 rounded-lg text-base font-medium transition ${isActive ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"}`}
              to="/"
            >
              HOME
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className={({ isActive }) => `py-2 px-3 rounded-lg text-base font-medium transition ${isActive ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"}`}
              to="/collection"
            >
              COLLECTION
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className={({ isActive }) => `py-2 px-3 rounded-lg text-base font-medium transition ${isActive ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"}`}
              to="/about"
            >
              ABOUT
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className={({ isActive }) => `py-2 px-3 rounded-lg text-base font-medium transition ${isActive ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"}`}
              to="/contact"
            >
              CONTACT
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
