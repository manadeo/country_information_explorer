import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Sun, Moon, Compass, Heart, Globe } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { 
    theme, 
    toggleTheme, 
    currentPage, 
    navigateTo, 
    favorites 
  } = useContext(AppContext);

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div className="navbar-logo" onClick={() => navigateTo('home')}>
          <div className="logo-icon-wrapper">
            <Globe className="logo-icon" />
          </div>
          <h1>Country<span>Explorer</span></h1>
        </div>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* Favorites Tab Button */}
          <button 
            className={`nav-btn fav-btn ${currentPage === 'bookmarks' ? 'active' : ''}`}
            onClick={() => navigateTo(currentPage === 'bookmarks' ? 'home' : 'bookmarks')}
            title={currentPage === 'bookmarks' ? "View All Countries" : "View Bookmarks"}
          >
            <Heart className={`nav-icon heart-icon ${currentPage === 'bookmarks' ? 'filled' : ''}`} />
            <span className="btn-label">Bookmarks</span>
            {favorites.length > 0 && (
              <span className="fav-count animate-scale-in">{favorites.length}</span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button 
            className="nav-btn theme-toggle" 
            onClick={toggleTheme}
            title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === 'light' ? (
              <Moon className="nav-icon theme-icon animate-scale-in" />
            ) : (
              <Sun className="nav-icon theme-icon animate-scale-in" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
