// SearchBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { getCountryName } from "../utils/countryHelper";

// Ciudades populares como fallback
const popularCities = [
  { name: "Madrid", country: "ES", countryName: "Spain", lat: 40.4168, lon: -3.7038 },
  { name: "Barcelona", country: "ES", countryName: "Spain", lat: 41.3851, lon: 2.1734 },
  { name: "Valencia", country: "ES", countryName: "Spain", lat: 39.4699, lon: -0.3763 },
  { name: "Sevilla", country: "ES", countryName: "Spain", lat: 37.3891, lon: -5.9845 },
  { name: "Bilbao", country: "ES", countryName: "Spain", lat: 43.2627, lon: -2.9253 },
  { name: "London", country: "GB", countryName: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  { name: "Paris", country: "FR", countryName: "France", lat: 48.8566, lon: 2.3522 },
  { name: "Rome", country: "IT", countryName: "Italy", lat: 41.9028, lon: 12.4964 },
  { name: "Berlin", country: "DE", countryName: "Germany", lat: 52.5200, lon: 13.4050 },
  { name: "Amsterdam", country: "NL", countryName: "Netherlands", lat: 52.3676, lon: 4.9041 },
  { name: "New York", country: "US", countryName: "United States", lat: 40.7128, lon: -74.0060 },
  { name: "Los Angeles", country: "US", countryName: "United States", lat: 34.0522, lon: -118.2437 },
  { name: "Chicago", country: "US", countryName: "United States", lat: 41.8781, lon: -87.6298 },
  { name: "Miami", country: "US", countryName: "United States", lat: 25.7617, lon: -80.1918 },
  { name: "Tokyo", country: "JP", countryName: "Japan", lat: 35.6762, lon: 139.6503 },
  { name: "Beijing", country: "CN", countryName: "China", lat: 39.9042, lon: 116.4074 },
  { name: "Sydney", country: "AU", countryName: "Australia", lat: -33.8688, lon: 151.2093 },
  { name: "Toronto", country: "CA", countryName: "Canada", lat: 43.6532, lon: -79.3832 },
  { name: "Mexico City", country: "MX", countryName: "Mexico", lat: 19.4326, lon: -99.1332 },
  { name: "Buenos Aires", country: "AR", countryName: "Argentina", lat: -34.6118, lon: -58.3960 },
  { name: "São Paulo", country: "BR", countryName: "Brazil", lat: -23.5505, lon: -46.6333 },
  { name: "Rio de Janeiro", country: "BR", countryName: "Brazil", lat: -22.9068, lon: -43.1729 },
  { name: "Lima", country: "PE", countryName: "Peru", lat: -12.0464, lon: -77.0428 },
  { name: "Bogotá", country: "CO", countryName: "Colombia", lat: 4.7110, lon: -74.0721 },
  { name: "Santiago", country: "CL", countryName: "Chile", lat: -33.4489, lon: -70.6693 },
  { name: "Caracas", country: "VE", countryName: "Venezuela", lat: 10.4806, lon: -66.9036 },
  { name: "Quito", country: "EC", countryName: "Ecuador", lat: -0.2299, lon: -78.5249 },
  { name: "Guayaquil", country: "EC", countryName: "Ecuador", lat: -2.1894, lon: -79.8891 },
];

export function SearchBar({
  value: propValue,
  onChange: propOnChange,
  onSubmit,
  placeholder,
  disabled,
  onSelectSuggestion,
  backgroundClass = '',
  language = 'en'
}) {
  const [inputValue, setInputValue] = useState(propValue || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (propValue !== undefined && propValue !== inputValue) {
      setInputValue(propValue);
      // Limpiar sugerencias cuando se actualiza el valor desde fuera
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [propValue]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.length < 2) {
        setSuggestions([]);
        return;
      }

      // Primero buscar en ciudades populares
      const popularMatches = popularCities.filter(city => 
        city.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        city.countryName.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 3);

      // Intentar buscar en el backend
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        const res = await fetch(
          `${backendUrl}/api/geocode?q=${encodeURIComponent(inputValue)}&limit=5&lang=${language}`
        );
        
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSuggestions(data);
            return;
          }
        }
      } catch (err) {
        console.error('Error fetching suggestions from backend:', err);
      }

      // Si no hay backend o falla, usar ciudades populares
      setSuggestions(popularMatches);
    };

    const timeout = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timeout);
  }, [inputValue, language]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
    if (propOnChange) propOnChange(value);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = (e) => {
    if (!e.relatedTarget || !listRef.current?.contains(e.relatedTarget)) {
      setTimeout(() => setShowSuggestions(false), 200);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
        break;
      case 'Enter':
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          e.preventDefault();
          handleSelect(suggestions[highlightedIndex]);
        } else if (onSubmit) {
          onSubmit({ preventDefault: () => {} });
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  const handleSelect = (suggestion) => {
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    setSuggestions([]);
    if (onSelectSuggestion) onSelectSuggestion(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full max-w-full ${backgroundClass}`} style={{ zIndex: 1000 }}>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (onSubmit) onSubmit(e);
          setSuggestions([]);
          setShowSuggestions(false);
        }}
        autoComplete="off"
      >
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            aria-autocomplete="list"
            aria-controls="autocomplete-listbox"
            aria-activedescendant={highlightedIndex >= 0 ? `autocomplete-item-${highlightedIndex}` : undefined}
            className="w-full rounded-xl border border-white/30 bg-white/15 text-white placeholder-white/75
                       py-3 px-4 text-lg outline-none
                       focus:border-white focus:ring-2 focus:ring-white
                       transition-all duration-200
                       backdrop-blur-md"
            style={{
              boxShadow: '0 1px 8px rgba(0,0,0,0.1)',
            }}
          />
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul
          id="autocomplete-listbox"
          role="listbox"
          ref={listRef}
          className="absolute top-full mt-2 left-0 right-0 max-h-64 overflow-y-auto rounded-xl bg-gray-900 bg-opacity-95 border border-white/30 shadow-lg"
          style={{ zIndex: 1001 }}
        >
          {suggestions.map((suggestion, index) => {
            const isHighlighted = highlightedIndex === index;
            return (
              <li
                key={`${suggestion.lat}-${suggestion.lon}`}
                id={`autocomplete-item-${index}`}
                role="option"
                aria-selected={isHighlighted}
                onMouseDown={e => {
                  e.preventDefault();
                  handleSelect(suggestion);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`flex items-center gap-2 px-4 py-3 cursor-pointer text-white text-base
                            ${isHighlighted ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                <span className="text-lg">🏙️</span>
                <span>
                  {suggestion.name}
                  {suggestion.state && `, ${suggestion.state}`}, {suggestion.countryName || suggestion.country}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
