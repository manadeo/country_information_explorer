import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, SlidersHorizontal, ListFilter, ArrowUpDown } from 'lucide-react';
import './FilterControls.css';

export default function FilterControls() {
  const {
    search,
    setSearch,
    region,
    setRegion,
    sortBy,
    setSortBy,
    order,
    setOrder,
    currentPage
  } = useContext(AppContext);

  const toggleSortOrder = () => {
    setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="filter-controls-container animate-fade-in">
      <div className="filters-wrapper glass-panel">
        
        {/* Search Field */}
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder={currentPage === 'bookmarks' ? "Search bookmarked countries..." : "Search by name, capital, code..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Dropdowns / Controls */}
        <div className="dropdowns-group">
          
          {/* Region Dropdown Filter */}
          <div className="filter-select-wrapper">
            <ListFilter className="select-icon" />
            <select 
              value={region} 
              onChange={(e) => setRegion(e.target.value)}
              aria-label="Filter by Region"
            >
              <option value="">All Regions</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="sort-group">
            <div className="filter-select-wrapper">
              <SlidersHorizontal className="select-icon" />
              <select 
                value={sortBy} 
                onChange={handleSortChange}
                aria-label="Sort by Parameter"
              >
                <option value="name">Sort by Name</option>
                <option value="population">Sort by Population</option>
                <option value="area">Sort by Area</option>
              </select>
            </div>

            {/* Sort Order Toggle */}
            <button 
              className="order-toggle-btn"
              onClick={toggleSortOrder}
              title={order === 'asc' ? 'Ascending Order' : 'Descending Order'}
            >
              <ArrowUpDown className={`order-icon ${order === 'desc' ? 'descending' : ''}`} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
