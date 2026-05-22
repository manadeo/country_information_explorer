import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

export const AppContext = createContext();

const API_BASE = 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  // Theme Management
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });

  // Data States
  const [countries, setCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search, Filter, Sort States
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 12 });

  // View States
  const [activeCountry, setActiveCountry] = useState(null);
  const [shareCountry, setShareCountry] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'bookmarks'

  // Navigate between pages with clean filter resets
  const navigateTo = useCallback((pageName) => {
    setCurrentPage(pageName);
    setSearch('');
    setRegion('');
    setSortBy('name');
    setOrder('asc');
    setPage(1);
  }, []);

  // Compute filtered and sorted favorites in real-time on the frontend
  const filteredFavorites = useMemo(() => {
    let result = [...favorites];

    // Search filter: match name, officialName, capital, and cca3
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(country => 
        (country.name && country.name.toLowerCase().includes(term)) ||
        (country.officialName && country.officialName.toLowerCase().includes(term)) ||
        (country.capital && country.capital.toLowerCase().includes(term)) ||
        (country.cca3 && country.cca3.toLowerCase().includes(term))
      );
    }

    // Region filter
    if (region) {
      result = result.filter(country => 
        country.region && country.region.toLowerCase() === region.toLowerCase()
      );
    }

    // Sorting and ordering
    if (sortBy) {
      result.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (sortBy === 'name') {
          valA = a.name || '';
          valB = b.name || '';
        }

        if (typeof valA === 'string') {
          return order === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        } else {
          // Numeric sorting for population and area
          const numA = Number(valA) || 0;
          const numB = Number(valB) || 0;
          return order === 'asc' ? numA - numB : numB - numA;
        }
      });
    }

    return result;
  }, [favorites, search, region, sortBy, order]);

  // Sync theme with HTML attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Fetch favorites list
  const fetchFavorites = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/favorites`);
      if (data.success) {
        setFavorites(data.data.map(fav => fav.country));
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  }, []);

  // Initial favorites load
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Fetch countries list dynamically based on search, region, sorting, and pagination
  const fetchCountries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_BASE}/countries`, {
        params: {
          page,
          limit: 12,
          sortBy,
          order,
          ...(search && { search }),
          ...(region && { region })
        }
      });
      if (data.success) {
        setCountries(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to fetch countries');
      }
    } catch (err) {
      setError('Could not connect to the backend server');
      console.error('Fetch countries error:', err);
    } finally {
      setLoading(false);
    }
  }, [search, region, sortBy, order, page]);

  // Trigger country search
  useEffect(() => {
    // Only query backend for active grid if we are on the Home page
    if (currentPage === 'home') {
      fetchCountries();
    }
  }, [fetchCountries, currentPage]);

  // Reset pagination on search/filter changes
  useEffect(() => {
    setPage(1);
  }, [search, region, sortBy]);

  // Toggle favorite post/delete API calls
  const toggleFavorite = async (countryId) => {
    const isFav = favorites.some(fav => fav._id === countryId);
    try {
      if (isFav) {
        // DELETE
        const { data } = await axios.delete(`${API_BASE}/favorites/${countryId}`);
        if (data.success) {
          setFavorites(prev => prev.filter(c => c._id !== countryId));
        }
      } else {
        // POST
        const { data } = await axios.post(`${API_BASE}/favorites`, { countryId });
        if (data.success) {
          setFavorites(prev => [...prev, data.data.country]);
        }
      }
    } catch (err) {
      console.error('Toggle favorite API error:', err);
    }
  };

  const isFavorited = (countryId) => {
    return favorites.some(fav => fav._id === countryId);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentPage,
        navigateTo,
        countries: currentPage === 'bookmarks' ? filteredFavorites : countries,
        favorites,
        loading,
        error,
        search,
        setSearch,
        region,
        setRegion,
        sortBy,
        setSortBy,
        order,
        setOrder,
        page,
        setPage,
        pagination,
        activeCountry,
        setActiveCountry,
        shareCountry,
        setShareCountry,
        toggleFavorite,
        isFavorited,
        refetchFavorites: fetchFavorites
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
