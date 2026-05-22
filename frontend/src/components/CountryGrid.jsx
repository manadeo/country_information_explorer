import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import CountryCard from './CountryCard';
import { ChevronLeft, ChevronRight, HelpCircle, HeartOff, Compass } from 'lucide-react';
import './CountryGrid.css';

export default function CountryGrid() {
  const {
    countries,
    loading,
    error,
    page,
    setPage,
    pagination,
    currentPage,
    search,
    setSearch,
    setRegion,
    favorites,
    navigateTo
  } = useContext(AppContext);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < pagination.pages) setPage(page + 1);
  };

  const resetFilters = () => {
    setSearch('');
    setRegion('');
  };

  // Rendering Loader State
  if (loading) {
    return (
      <div className="spinner-container animate-fade-in" role="status">
        <div className="spinner"></div>
        <p className="spinner-text">Exploring nations...</p>
      </div>
    );
  }

  // Rendering Server Connection Error
  if (error) {
    return (
      <div className="error-state glass-panel animate-fade-in">
        <Compass className="error-icon" />
        <h3>Server Disconnected</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Retry Connection
        </button>
      </div>
    );
  }

  // Rendering Empty States
  if (countries.length === 0) {
    return (
      <div className="empty-state glass-panel animate-fade-in">
        {currentPage === 'bookmarks' && favorites.length === 0 ? (
          <>
            <HeartOff className="empty-icon text-red" />
            <h3>No Bookmarked Countries Yet</h3>
            <p>Go back to explore and click the heart icon on any country card to bookmark it.</p>
            <button className="clear-btn" onClick={() => navigateTo('home')}>
              Explore Nations
            </button>
          </>
        ) : (
          <>
            <HelpCircle className="empty-icon" />
            <h3>No Results Found</h3>
            <p>We couldn't find any countries matching your active filters. Try searching for something else.</p>
            <button className="clear-btn" onClick={resetFilters}>
              Clear Active Filters
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid-section">
      {/* Grid Container */}
      <div className="country-grid">
        {countries.map((country) => (
          <CountryCard key={country._id} country={country} />
        ))}
      </div>

      {/* Pagination Bar (disabled for local favorites array display) */}
      {currentPage === 'home' && pagination.pages > 1 && (
        <div className="pagination-bar glass-panel animate-fade-in">
          <button 
            className="pag-btn" 
            onClick={handlePrevPage} 
            disabled={page === 1}
            title="Previous Page"
          >
            <ChevronLeft className="pag-icon" />
          </button>
          
          <span className="page-indicator">
            Page <strong>{page}</strong> of <strong>{pagination.pages}</strong>
          </span>

          <button 
            className="pag-btn" 
            onClick={handleNextPage} 
            disabled={page === pagination.pages}
            title="Next Page"
          >
            <ChevronRight className="pag-icon" />
          </button>
        </div>
      )}
    </div>
  );
}
