import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import FilterControls from '../components/FilterControls';
import CountryGrid from '../components/CountryGrid';
import { Heart, BookOpen } from 'lucide-react';
import './Pages.css';

export default function BookmarkPage() {
  const { favorites } = useContext(AppContext);

  return (
    <div className="page-layout bookmark-page animate-fade-in">
      <header className="hero-banner glass-panel bookmark-hero">
        <div className="hero-content">
          <div className="hero-badge animate-scale-in">
            <Heart className="badge-icon heart-pulse" />
            <span>Your Personal Collection</span>
          </div>
          <h2 className="hero-title">
            Curated <span>Destinations</span>
          </h2>
          <p className="hero-subtitle">
            Keep track of the countries that interest you most. You have saved <strong>{favorites.length}</strong> {favorites.length === 1 ? 'country' : 'countries'} so far.
          </p>
        </div>
        <div className="hero-art">
          <BookOpen className="art-globe" />
        </div>
      </header>

      <FilterControls />
      <CountryGrid />
    </div>
  );
}
