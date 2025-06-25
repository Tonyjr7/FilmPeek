import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  StarIcon,
  BookmarkIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';

import Toast from './Toast'; // Make sure this path is correct

export default function Header() {
  const [activeLink, setActiveLink] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function getLinkClasses(isActive) {
    return isActive
      ? 'font-bold text-amber-500 flex items-center space-x-2 scale-110'
      : 'font-normal text-white text-lg hover:text-amber-200 flex items-center space-x-2';
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearch(false);
      setSearchTerm('');
      setActiveLink('search');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setActiveLink('home');
    navigate('/');
    setToast({ message: 'Logged out successfully', type: 'success' });
  };

  const headerClasses = isScrolled
    ? 'bg-black bg-opacity-90 shadow-md backdrop-blur'
    : 'bg-transparent';

  return (
    <>
      <header
        className={`${headerClasses} text-white fixed top-0 left-0 w-full z-50 transition-all duration-300`}
      >
        <div className="mx-auto px-4 py-6 flex items-center justify-between">
          {/* Left: Logo and Nav with flex-grow */}
          <div className="flex items-center space-x-6 flex-grow">
            <Link to="/" className="mb-2">
              <img src="filmpeek.png" width="150" alt="Filmpeek Logo" />
            </Link>
            <nav className="hidden md:flex space-x-6 items-center justify-center">
              <Link
                to="/"
                className={getLinkClasses(activeLink === 'home')}
                onClick={() => setActiveLink('home')}
              >
                <HomeIcon className="w-5 h-5 mb-1" />
                <span>Browse</span>
              </Link>
              <Link
                to="/favorites"
                className={getLinkClasses(activeLink === 'favorites')}
                onClick={() => setActiveLink('favorites')}
              >
                <StarIcon className="w-5 h-5" />
                <span>Favorites</span>
              </Link>
              <Link
                to="/watchlist"
                className={getLinkClasses(activeLink === 'watchlist')}
                onClick={() => setActiveLink('watchlist')}
              >
                <BookmarkIcon className="w-5 h-5" />
                <span>WatchList</span>
              </Link>

              {/* Search Icon and Input */}
              <div className="relative flex items-center">
                <button
                  onClick={() => setShowSearch((prev) => !prev)}
                  className="flex items-center space-x-2 text-white hover:text-yellow-400 focus:outline-none"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>

                <form
                  onSubmit={handleSearchSubmit}
                  className={`overflow-hidden transition-all duration-300 ml-2 ${
                    showSearch ? 'w-64 opacity-100' : 'w-0 opacity-0'
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-1 rounded-md text-black outline-none"
                  />
                </form>
              </div>
            </nav>
          </div>

          {/* Right: Login or Logout */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="font-normal text-white text-lg hover:text-amber-200 flex items-center space-x-2"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className={getLinkClasses(activeLink === 'login')}
                onClick={() => setActiveLink('login')}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Nav */}
          <nav className="flex justify-around items-center p-2 gap-5 md:hidden ml-auto">
            <Link
              to="/"
              className={getLinkClasses(activeLink === 'home')}
              onClick={() => setActiveLink('home')}
            >
              <HomeIcon className="w-5 h-5" />
            </Link>
            <Link
              to="/search"
              className={getLinkClasses(activeLink === 'search')}
              onClick={() => {
                setActiveLink('search');
              }}
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </Link>
            <Link
              to="/favorites"
              className={getLinkClasses(activeLink === 'favorites')}
              onClick={() => setActiveLink('favorites')}
            >
              <StarIcon className="w-5 h-5" />
            </Link>
            <Link
              to="/watchlist"
              className={getLinkClasses(activeLink === 'watchlist')}
              onClick={() => setActiveLink('watchlist')}
            >
              <BookmarkIcon className="w-5 h-5" />
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="font-normal text-white hover:text-amber-200 flex items-center space-x-2"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="sr-only">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className={getLinkClasses(activeLink === 'login')}
                onClick={() => setActiveLink('login')}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
