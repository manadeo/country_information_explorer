import React from 'react';
import FilterControls from '../components/FilterControls';
import CountryGrid from '../components/CountryGrid';
import { Compass, Globe2 } from 'lucide-react';
import './Pages.css';

export default function HomePage() {
  return (
    <div className="page-layout home-page animate-fade-in">
      <header className="hero-banner glass-panel">
        <div className="hero-content">
          <div className="hero-badge animate-scale-in">
            <Compass className="badge-icon spinner-slow" />
            <span>Discover the Globe</span>
          </div>
          <h2 className="hero-title">
            Explore the World's <span>Nations</span>
          </h2>
          <p className="hero-subtitle">
            Search, filter, and sort through detailed geographical, demographic, and political data of countries across the seven seas.
          </p>
        </div>
        <div className="hero-art">
          <Globe2 className="art-globe" />
        </div>
      </header>

      <FilterControls />
      <CountryGrid />
    </div>
  );
}
