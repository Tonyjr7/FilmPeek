import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  StarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';

export default function Header() {
  const [activeLink, setActiveLink] = useState('home');

  function getLinkClasses(isActive) {
    return isActive
      ? 'font-bold text-amber-500 flex items-center space-x-2 scale-110'
      : 'font-normal text-white text-lg hover:text-amber-200 flex items-center space-x-2';
  }

  return (
    <header className="bg-gray-950 text-white">
      <div className="mx-auto px-4 py-6 flex items-center justify-between">
        {/* Left: Logo and Nav with flex-grow */}
        <div className="flex items-center space-x-6 flex-grow">
          <Link to="/" className="mb-2">
            <img src="filmpeek.png" width="150"></img>
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
              to="/profile"
              className={getLinkClasses(activeLink === 'profile')}
              onClick={() => setActiveLink('profile')}
            >
              <UserCircleIcon className="w-5 h-5" />
              <span>Profile</span>
            </Link>
            <Link
              to="/search"
              className={getLinkClasses(activeLink === 'search')}
              onClick={() => setActiveLink('search')}
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              <span>Search</span>
            </Link>
          </nav>
        </div>

        {/* Right: Login */}
        <div className="hidden md:block">
          <Link
            to="/login"
            className={getLinkClasses(activeLink === 'login')}
            onClick={() => setActiveLink('login')}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Login</span>
          </Link>
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
            to="/favorites"
            className={getLinkClasses(activeLink === 'favorites')}
            onClick={() => setActiveLink('favorites')}
          >
            <StarIcon className="w-5 h-5" />
          </Link>
          <Link
            to="/profile"
            className={getLinkClasses(activeLink === 'profile')}
            onClick={() => setActiveLink('profile')}
          >
            <UserCircleIcon className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className={getLinkClasses(activeLink === 'login')}
            onClick={() => setActiveLink('login')}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
