import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { X, Heart, MapPin, Landmark, Users, Globe2, Compass, Languages, Coins, Maximize2 } from 'lucide-react';
import './DetailModal.css';

export default function DetailModal() {
  const { 
    activeCountry, 
    setActiveCountry, 
    toggleFavorite, 
    isFavorited 
  } = useContext(AppContext);

  const [borderCountries, setBorderCountries] = useState([]);
  const [loadingBorders, setLoadingBorders] = useState(false);

  // Fetch full details of bordering countries (converting code to name)
  useEffect(() => {
    if (!activeCountry) {
      setBorderCountries([]);
      return;
    }

    const fetchBorders = async () => {
      if (!activeCountry.borders || activeCountry.borders.length === 0) {
        setBorderCountries([]);
        return;
      }
      
      setLoadingBorders(true);
      try {
        const borderPromises = activeCountry.borders.map(code => 
          axios.get(`http://localhost:5000/api/countries/code/${code}`)
            .then(res => res.data.success ? res.data.data : null)
            .catch(() => null)
        );
        
        const results = await Promise.all(borderPromises);
        setBorderCountries(results.filter(c => c !== null));
      } catch (err) {
        console.error('Error fetching border countries:', err);
      } finally {
        setLoadingBorders(false);
      }
    };

    fetchBorders();
  }, [activeCountry]);

  // Navigate to border country detail view
  const handleBorderClick = (country) => {
    setActiveCountry(country);
  };

  const handleClose = () => {
    setActiveCountry(null);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      handleClose();
    }
  };

  // Close modal when activeCountry is null
  if (!activeCountry) return null;

  const favorited = isFavorited(activeCountry._id);

  return (
    <div className="modal-overlay" onClick={handleOutsideClick}>
      <div className="modal-content glass-panel animate-scale-in">
        
        {/* Action Header Button Controls */}
        <div className="banner-actions">
          <button 
            className={`banner-btn fav-btn ${favorited ? 'active' : ''}`}
            onClick={() => toggleFavorite(activeCountry._id)}
            title={favorited ? "Remove from bookmarks" : "Bookmark country"}
          >
            <Heart className={`banner-icon heart-icon ${favorited ? 'filled' : ''}`} />
          </button>
          <button 
            className="banner-btn close-btn" 
            onClick={handleClose}
            title="Close Panel"
          >
            <X className="banner-icon" />
          </button>
        </div>

        {/* Flag Image Banner Header */}
        <div className="modal-banner">
          <img 
            src={activeCountry.flagSvg || 'https://flagcdn.com/un.svg'} 
            alt={`${activeCountry.name} Flag`} 
          />
          <div className="banner-gradient"></div>

          <div className="banner-title-group">
            <span className="banner-region">{activeCountry.subregion || activeCountry.region}</span>
            <h2>{activeCountry.name} {activeCountry.flag}</h2>
          </div>
        </div>

        {/* Info Grid */}
        <div className="modal-body">
          <div className="info-main">
            {/* Description Text */}
            <div className="info-section desc-section">
              <h3>Overview</h3>
              <p>
                {activeCountry.description || 
                 `Welcome to ${activeCountry.name}, a sovereign nation situated in the ${activeCountry.subregion || activeCountry.region} region. Let us discover more about its culture and statistics.`}
              </p>
            </div>

            {/* Quick Stat Details Columns */}
            <div className="stats-grid">
              
              <div className="info-stat-card">
                <Landmark className="stat-card-icon" />
                <div className="stat-card-content">
                  <span className="stat-card-label">Official Name</span>
                  <span className="stat-card-val">{activeCountry.officialName || activeCountry.name}</span>
                </div>
              </div>

              <div className="info-stat-card">
                <Compass className="stat-card-icon" />
                <div className="stat-card-content">
                  <span className="stat-card-label">Capital City</span>
                  <span className="stat-card-val">{activeCountry.capital || 'N/A'}</span>
                </div>
              </div>

              <div className="info-stat-card">
                <Users className="stat-card-icon" />
                <div className="stat-card-content">
                  <span className="stat-card-label">Population</span>
                  <span className="stat-card-val">{activeCountry.population.toLocaleString()}</span>
                </div>
              </div>

              <div className="info-stat-card">
                <Maximize2 className="stat-card-icon" />
                <div className="stat-card-content">
                  <span className="stat-card-label">Total Area</span>
                  <span className="stat-card-val">
                    {activeCountry.area ? `${activeCountry.area.toLocaleString()} km²` : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="info-stat-card">
                <Languages className="stat-card-icon" />
                <div className="stat-card-content">
                  <span className="stat-card-label">Languages</span>
                  <span className="stat-card-val">
                    {activeCountry.languages && activeCountry.languages.length > 0
                      ? activeCountry.languages.join(', ')
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="info-stat-card">
                <Coins className="stat-card-icon" />
                <div className="stat-card-content">
                  <span className="stat-card-label">Currencies</span>
                  <span className="stat-card-val">
                    {activeCountry.currencies && activeCountry.currencies.length > 0
                      ? activeCountry.currencies.map(c => `${c.name} (${c.symbol || c.code})`).join(', ')
                      : 'N/A'}
                  </span>
                </div>
              </div>

            </div>

            {/* Borders Section */}
            <div className="info-section borders-section">
              <h3>Bordering Nations</h3>
              {loadingBorders ? (
                <div className="border-loader">Loading borders...</div>
              ) : borderCountries.length > 0 ? (
                <div className="borders-list">
                  {borderCountries.map(border => (
                    <button 
                      key={border._id}
                      className="border-pill-btn"
                      onClick={() => handleBorderClick(border)}
                    >
                      <span className="pill-emoji">{border.flag}</span>
                      {border.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="no-borders-text">
                  This country does not share land borders with any other nation (island or isolated territory).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Map / Share Footer */}
        {activeCountry.mapsGoogle && (
          <div className="modal-footer">
            <a 
              href={activeCountry.mapsGoogle} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="map-link-btn"
            >
              <MapPin className="map-link-icon" /> View on Google Maps
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
