import React, { useState } from "react";
import { useWeatherData } from "./hooks/useWeatherData";
import { SearchBar } from "./components/SearchBar";
import { titleCase } from "./utils/titleCase";
import { getCountryName } from "./utils/countryHelper";
import { translateWeatherDescription } from "./utils/weatherTranslations";

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function App() {
  const [location, setLocation] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [language, setLanguage] = useState('en');
  const { weatherData, forecastData, fetchWeather, loading, error } = useWeatherData(language);

  const texts = {
    es: {
      placeholder: 'Introduce una ciudad o código postal...',
      startMessage: 'Escribe una ciudad para comenzar',
      today: 'Hoy',
      lastUpdate: 'Última actualización:',
      humidity: 'Humedad',
      wind: 'Viento',
      changeLang: 'Cambiar a Inglés',
      useLocation: 'Usar ubicación',
      UseCurrentLocation: 'Usar ubicación actual',
      loading: 'Cargando...',
      searchHint: 'Busca una ciudad o usa tu ubicación actual',
      forecast: 'Pronóstico de 5 días'
    },
    en: {
      placeholder: 'Enter a city or zip code...',
      startMessage: 'Write a city to start',
      today: 'Today',
      lastUpdate: 'Last update:',
      humidity: 'Humidity',
      wind: 'Wind',
      changeLang: 'Switch to Spanish',
      useLocation: 'Use location',
      UseCurrentLocation: 'Use current location',
      loading: 'Loading...',
      searchHint: 'Search for a city or use your current location',
      forecast: '5-day forecast'
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location) return;
    fetchWeather(location);
    setShowDetails(true);
  };

  const handleSelectSuggestion = (suggestion) => {
    setLocation(`${suggestion.name}, ${suggestion.country}`);
    fetchWeather({ lat: suggestion.lat, lon: suggestion.lon });
    setShowDetails(true);
  };

  const getBackgroundGradient = () => {
    if (!weatherData) return 'from-blue-400 via-blue-500 to-blue-600';
    const main = weatherData.weather[0].main.toLowerCase();
    switch (main) {
      case 'clear': return 'from-yellow-400 via-orange-500 to-red-500';
      case 'clouds': return 'from-gray-400 via-gray-500 to-gray-600';
      case 'rain':
      case 'drizzle': return 'from-blue-600 via-blue-700 to-blue-800';
      case 'thunderstorm': return 'from-purple-600 via-purple-700 to-purple-800';
      case 'snow': return 'from-blue-200 via-blue-300 to-blue-400';
      case 'mist':
      case 'fog': return 'from-gray-300 via-gray-400 to-gray-500';
      default: return 'from-blue-400 via-blue-500 to-blue-600';
    }
  };

  const processForecastData = () => {
    if (!forecastData) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyForecastsMap = new Map();
    
    forecastData.list.forEach((item) => {
      const itemDate = new Date(item.dt * 1000);
      itemDate.setHours(0, 0, 0, 0);
      if (itemDate.getTime() > today.getTime()) {
        const dateKey = itemDate.toISOString().split('T')[0];
        if (!dailyForecastsMap.has(dateKey)) {
          dailyForecastsMap.set(dateKey, []);
        }
        dailyForecastsMap.get(dateKey).push(item);
      }
    });

    const processedForecastDays = [];
    let futureDayCount = 0;
    const sortedDateKeys = Array.from(dailyForecastsMap.keys()).sort();
    
    for (const dateKey of sortedDateKeys) {
      if (futureDayCount >= 5) break;
      const dayItems = dailyForecastsMap.get(dateKey);
      const minTemp = Math.min(...dayItems.map((item) => item.main.temp_min));
      const maxTemp = Math.max(...dayItems.map((item) => item.main.temp_max));
      let representativeItem = dayItems[0];
      
      const middayItem = dayItems.find((item) => {
        const hour = new Date(item.dt * 1000).getHours();
        return hour >= 12 && hour < 18;
      });
      
      if (middayItem) representativeItem = middayItem;
      
      processedForecastDays.push({
        dt: representativeItem.dt,
        weather: representativeItem.weather,
        main: {
          temp_min: minTemp,
          temp_max: maxTemp,
          humidity: representativeItem.main.humidity,
        },
        wind: representativeItem.wind,
      });
      futureDayCount++;
    }
    return processedForecastDays;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-700`}>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
            <button
              onClick={async () => {
                const permission = window.confirm(
                  language === 'es'
                    ? '¿Deseas permitir el acceso a tu ubicación para obtener el clima actual?'
                    : 'Do you want to allow access to your location to get the current weather?'
                );
                if (!permission) return;
                if (!navigator.geolocation) {
                  alert(
                    language === 'es'
                      ? 'La geolocalización no es compatible con tu navegador.'
                      : 'Geolocation is not supported by your browser.'
                  );
                  return;
                }
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeather({ lat: latitude, lon: longitude });
                    setShowDetails(true);
                  },
                  (err) => {
                    alert(
                      language === 'es'
                        ? 'No se pudo obtener tu ubicación.'
                        : 'Unable to retrieve your location.'
                    );
                    console.error(err);
                  }
                );
              }}
              className="w-full sm:w-auto flex items-center justify-center sm:justify-start space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-white hover:bg-white/30 transition-all duration-300"
            >
              <span className="text-lg">📍</span>
              <span>{texts[language].useLocation}</span>
            </button>
            
            <button
              onClick={() => setLanguage((prev) => (prev === 'es' ? 'en' : 'es'))}
              className="w-full sm:w-auto flex items-center justify-center sm:justify-start space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-white hover:bg-white/30 transition-all duration-300"
            >
              <span className="text-lg">🌐</span>
              <span>{language === 'es' ? 'English' : 'Español'}</span>
            </button>
          </div>

          {/* Current Date */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-light text-white/90">
              {capitalizeFirst(
                new Date().toLocaleDateString(
                  language === 'es' ? 'es-ES' : 'en-US',
                  {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }
                )
              )}
            </h1>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
            <SearchBar
              value={location}
              onChange={setLocation}
              onSubmit={handleSubmit}
              placeholder={texts[language].placeholder}
              disabled={loading}
              language={language}
              onSelectSuggestion={handleSelectSuggestion}
            />
            
            {error && (
              <div className="mt-4 bg-red-500/20 backdrop-blur-md rounded-2xl p-4 text-white text-center">
                ⚠️ {error}
              </div>
            )}
            
            {loading && (
              <div className="mt-4 flex items-center justify-center space-x-3 text-white">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>{texts[language].loading}</span>
              </div>
            )}
          </div>

          {/* Weather Display */}
          {showDetails && weatherData ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Weather */}
              <div className="lg:col-span-2">
                <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 sm:p-8 text-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-light mb-2">
                        {weatherData.name}, {getCountryName(weatherData.sys.country, language)}
                      </h2>
                      <div className="flex items-center space-x-2 text-white/70">
                        <span className="text-sm">🕒</span>
                        <span className="text-sm sm:text-base">
                          {texts[language].lastUpdate}{' '}
                          {new Date(weatherData.dt * 1000).toLocaleTimeString(
                            language === 'es' ? 'es-ES' : 'en-US',
                            { hour: '2-digit', minute: '2-digit' }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <img
                        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                        alt={weatherData.weather[0].description}
                        className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4"
                      />
                      <div className="text-5xl sm:text-6xl font-light mb-2">
                        {Math.round(weatherData.main.temp)}°C
                      </div>
                      <div className="text-lg sm:text-xl text-white/80">
                        {translateWeatherDescription(
                          weatherData.weather[0].description,
                          language
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl text-blue-300">💧</span>
                        <div>
                          <div className="text-sm text-white/70">{texts[language].humidity}</div>
                          <div className="text-xl">{weatherData.main.humidity}%</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl text-gray-300">🌬️</span>
                        <div>
                          <div className="text-sm text-white/70">{texts[language].wind}</div>
                          <div className="text-xl">{(weatherData.wind.speed * 3.6).toFixed(1)} km/h</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Forecast */}
              <div className="lg:col-span-1">
                <div className="bg-white/20 backdrop-blur-md rounded-3xl p-4 sm:p-6 text-white">
                  <h3 className="text-lg sm:text-xl font-light mb-4 sm:mb-6 text-center">
                    {texts[language].forecast}
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {processForecastData().map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 sm:p-4 bg-white/10 rounded-2xl">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <img
                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                            alt={item.weather[0].description}
                            className="w-8 h-8 sm:w-10 sm:h-10"
                          />
                          <div>
                            <div className="text-sm sm:text-base font-medium">
                              {titleCase(
                                new Date(item.dt * 1000).toLocaleDateString(
                                  language === 'es' ? 'es-ES' : 'en-US',
                                  { weekday: 'short' }
                                )
                              )}
                            </div>
                            <div className="text-xs sm:text-sm text-white/70">
                              {translateWeatherDescription(
                                item.weather[0].description,
                                language
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm sm:text-base font-medium">
                            {Math.round(item.main.temp_max)}°/{Math.round(item.main.temp_min)}°
                          </div>
                          <div className="text-xs sm:text-sm text-white/70">
                            {item.main.humidity}% 💧
                          </div>
                          <div className="text-xs sm:text-sm text-white/70">
                            {(item.wind.speed * 3.6).toFixed(1)} km/h
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            !loading && (
              <div className="text-center text-white">
                <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 sm:p-12 max-w-md mx-auto">
                  <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🌤️</div>
                  <h2 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4">{texts[language].startMessage}</h2>
                  <p className="text-sm sm:text-base text-white/80">{texts[language].searchHint}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;