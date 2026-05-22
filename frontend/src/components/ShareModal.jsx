import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Facebook, Twitter, Linkedin, MessageSquare, Copy, Check } from 'lucide-react';
import './ShareModal.css';

export default function ShareModal() {
  const { shareCountry, setShareCountry } = useContext(AppContext);
  const [copied, setCopied] = useState(false);

  if (!shareCountry) return null;

  const countryUrl = window.location.origin + `?code=${shareCountry.cca3}`;
  const shareText = `Explore beautiful ${shareCountry.name} ${shareCountry.flag}! Capital: ${shareCountry.capital || 'N/A'}, Population: ${shareCountry.population.toLocaleString()}. Learn more about nations at CountryExplorer. #CountryExplorer`;

  // Social Links
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(countryUrl)}&quote=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(countryUrl)}&text=${encodeURIComponent(shareText)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(countryUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + countryUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(countryUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setShareCountry(null);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('share-overlay')) {
      handleClose();
    }
  };

  return (
    <div className="share-overlay" onClick={handleOutsideClick}>
      <div className="share-content glass-panel animate-scale-in">
        
        {/* Header bar */}
        <div className="share-header">
          <h3>Share Country Information</h3>
          <button className="close-share-btn" onClick={handleClose}>
            <X className="share-close-icon" />
          </button>
        </div>

        {/* Info card overview */}
        <div className="share-country-brief">
          <img src={shareCountry.flagSvg} alt="" className="brief-flag" />
          <div className="brief-details">
            <h4>{shareCountry.name} {shareCountry.flag}</h4>
            <p>Capital: {shareCountry.capital || 'N/A'} • {shareCountry.region}</p>
          </div>
        </div>

        {/* Buttons list */}
        <div className="share-options-grid">
          
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="share-option-btn fb">
            <Facebook className="share-platform-icon" />
            <span>Facebook</span>
          </a>

          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="share-option-btn twitter">
            {/* Custom SVG or X icon */}
            <span className="x-logo">X</span>
            <span>Twitter / X</span>
          </a>

          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="share-option-btn linkedin">
            <Linkedin className="share-platform-icon" />
            <span>LinkedIn</span>
          </a>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="share-option-btn whatsapp">
            <MessageSquare className="share-platform-icon" />
            <span>WhatsApp</span>
          </a>

        </div>

        {/* Copy Link field */}
        <div className="copy-link-section">
          <label htmlFor="copy-link-input">Or copy link</label>
          <div className="copy-link-wrapper">
            <input 
              id="copy-link-input"
              type="text" 
              readOnly 
              value={countryUrl} 
            />
            <button className={`copy-btn ${copied ? 'success' : ''}`} onClick={handleCopyLink}>
              {copied ? <Check className="copy-icon" /> : <Copy className="copy-icon" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
