import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Heart, Share2, ArrowUpRight, Compass, Users } from 'lucide-react';
import './CountryCard.css';

export default function CountryCard({ country }) {
  const { toggleFavorite, isFavorited, setActiveCountry, setShareCountry } = useContext(AppContext);

  const favorited = isFavorited(country._id);

  const formatPopulation = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num;
  };

  const handleCardClick = (e) => {
    // Only open details if user did not click action buttons
    if (e.target.closest('.card-action-btn')) return;
    setActiveCountry(country);
  };

  return (
    <div className="country-card glass-panel animate-fade-in" onClick={handleCardClick}>
      {/* SVG Flag Header with zoom effect */}
      <div className="card-flag-wrapper">
        <img 
          src={country.flagSvg || 'https://flagcdn.com/un.svg'} 
          alt={`${country.name} Flag`} 
          loading="lazy"
        />
        <div className="card-flag-overlay">
          <span className="details-badge">
            Details <ArrowUpRight className="badge-icon" />
          </span>
        </div>
      </div>

      {/* Country Body Content */}
      <div className="card-body">
        
        {/* Name and Emoji Flag */}
        <div className="card-title-row">
          <h3>
            {country.name} <span className="title-emoji">{country.flag}</span>
          </h3>
          <span className="card-code">{country.cca3}</span>
        </div>

        {/* Quick Parameters */}
        <div className="card-stats">
          <div className="stat-item">
            <Compass className="stat-icon" />
            <span className="stat-label">Capital:</span>
            <span className="stat-value">{country.capital || 'N/A'}</span>
          </div>
          <div className="stat-item">
            <Users className="stat-icon" />
            <span className="stat-label">Population:</span>
            <span className="stat-value">{formatPopulation(country.population)}</span>
          </div>
        </div>

        {/* Region Tag & Action Buttons */}
        <div className="card-footer">
          <span className="region-badge">{country.region}</span>
          
          <div className="card-actions">
            
            {/* Share Trigger */}
            <button 
              className="card-action-btn share-btn"
              onClick={() => setShareCountry(country)}
              title="Share Country Information"
            >
              <Share2 className="action-icon" />
            </button>

            {/* Favorite / Bookmark Trigger */}
            <button 
              className={`card-action-btn fav-btn ${favorited ? 'active' : ''}`}
              onClick={() => toggleFavorite(country._id)}
              title={favorited ? "Remove from bookmarks" : "Bookmark this country"}
            >
              <Heart className={`action-icon heart-icon ${favorited ? 'filled' : ''}`} />
            </button>
            
          </div>
        </div>

      </div>
    </div>
  );
}
