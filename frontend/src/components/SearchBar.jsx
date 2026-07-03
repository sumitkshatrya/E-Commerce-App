import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('collection')) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  return showSearch && visible ? (
    <div className="w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-premium transition-all duration-300 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Search Input Container */}
        <div className="flex-1 max-w-xl mx-auto flex items-center gap-3 bg-gray-100 dark:bg-gray-900 border border-premium hover:border-border-hover dark:hover:border-gray-700 px-4 py-2.5 rounded-full transition duration-200">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            type="text"
            placeholder="Search our catalog..."
            autoFocus
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              aria-label="Clear Search"
            >
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShowSearch(false)}
          className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
          aria-label="Close search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  ) : null;
};

export default SearchBar;
