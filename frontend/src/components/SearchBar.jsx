// SearchBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { getCountryName } from "../utils/countryHelper";

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
    }
  }, [propValue]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(inputValue)}&limit=5&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setSuggestions(
            data.map((place) => ({
              name: place.name,
              country: place.country,
              countryName: getCountryName(place.country, language),
              lat: place.lat,
              lon: place.lon,
              state: place.state,
            }))
          );
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      }
    };
    const timeout = setTimeout(fetchSuggestions, 300);
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
          {/* Icono lupa dentro del input */}
          
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
                className={`flex items-center gap-2 px-1 py-3 cursor-pointer text-white text-base
                            ${isHighlighted ? 'bg-white text-gray-900' : 'hover:bg-white/20'}`}
              >
                
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
