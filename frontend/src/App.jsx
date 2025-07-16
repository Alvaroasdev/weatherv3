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
    const locationText = `${suggestion.name}, ${suggestion.country}`;
    setLocation(locationText);
    // Usar coordenadas directamente para evitar doble búsqueda
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

  // Estado para controlar el fondo sin parpadeo
  const [currentBackground, setCurrentBackground] = useState('from-blue-400 via-blue-500 to-blue-600');
  
  // Actualizar fondo solo cuando cambie el clima, no durante la carga
  React.useEffect(() => {
    if (weatherData && !loading) {
      const newBackground = getBackgroundGradient();
      if (newBackground !== currentBackground) {
        setCurrentBackground(newBackground);
      }
    }
  }, [weatherData, loading]);

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
    <div className={`min-h-screen bg-gradient-to-br ${currentBackground} transition-all duration-1000 ease-in-out relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header - Minimalist with animations */}
          <div className="flex justify-between items-center mb-8 animate-fade-in">
            <div className="text-white">
              <h1 className="text-3xl lg:text-4xl font-bold animate-slide-in-left">
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
            
            <div className="flex space-x-4">
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
                className="bg-white/10 backdrop-blur-md rounded-full px-4 py-3 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 animate-slide-in-right flex items-center space-x-2"
              >
                <span className="text-xl">📍</span>
                <span className="text-sm font-medium">{texts[language].useLocation}</span>
              </button>
              
              <button
                onClick={() => setLanguage((prev) => (prev === 'es' ? 'en' : 'es'))}
                className="bg-white/10 backdrop-blur-md rounded-full px-4 py-3 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 animate-slide-in-right flex items-center space-x-2"
                style={{animationDelay: '0.2s'}}
              >
                <span className="text-xl">🌐</span>
                <span className="text-sm font-medium">{language === 'es' ? 'English' : 'Español'}</span>
              </button>
            </div>
          </div>

          {/* Search Bar - Minimalist with animations */}
          <div className="max-w-lg mx-auto mb-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
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
              <div className="mt-4 bg-red-500/20 backdrop-blur-md rounded-xl p-4 text-white text-center text-base animate-shake">
                ⚠️ {error}
              </div>
            )}
            
            {loading && (
              <div className="mt-4 flex items-center justify-center space-x-3 text-white text-base animate-fade-in">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>{texts[language].loading}</span>
              </div>
            )}
          </div>

          {/* Weather Display - Unified container with animations */}
          {showDetails && weatherData && !loading ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl animate-fade-in-up transition-all duration-500 ease-in-out" style={{animationDelay: '0.5s'}}>
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                {/* Current Weather - 60% on left */}
                <div className="xl:col-span-3">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white border border-white/5 hover:bg-white/15 transition-all duration-500 h-full flex flex-col">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                      <div className="animate-slide-in-left">
                        <div className="text-lg text-white/70 mb-2">{texts[language].today}</div>
                        <h2 className="text-3xl lg:text-4xl font-light mb-3">
                          {weatherData.name}, {getCountryName(weatherData.sys.country, language)}
                        </h2>
                        <div className="text-lg text-white/70">
                          {texts[language].lastUpdate}{' '}
                          {new Date(weatherData.dt * 1000).toLocaleTimeString(
                            language === 'es' ? 'es-ES' : 'en-US',
                            { hour: '2-digit', minute: '2-digit' }
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-8 mt-6 lg:mt-0 animate-slide-in-right">
                        <div className="text-center hover:scale-105 transition-transform duration-300">
                          <div className="text-lg text-white/70 mb-2">💧 {texts[language].humidity}</div>
                          <div className="text-2xl lg:text-3xl">{weatherData.main.humidity}%</div>
                        </div>
                        <div className="text-center hover:scale-105 transition-transform duration-300">
                          <div className="text-lg text-white/70 mb-2">🌬️ {texts[language].wind}</div>
                          <div className="text-2xl lg:text-3xl">{(weatherData.wind.speed * 3.6).toFixed(1)} km/h</div>
                        </div>
                        <div className="text-center hover:scale-105 transition-transform duration-300">
                          <div className="text-lg text-white/70 mb-2">🌧️ {language === 'es' ? 'Lluvia' : 'Rain'}</div>
                          <div className="text-2xl lg:text-3xl">
                            {weatherData.rain ? Math.round(weatherData.rain['1h'] || weatherData.rain['3h'] || 0) : 0}%
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center lg:justify-start space-x-6 animate-fade-in-up flex-1">
                      <img
                        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                        alt={weatherData.weather[0].description}
                        className="w-28 h-28 lg:w-32 lg:h-32 animate-bounce-slow"
                      />
                      <div className="text-center lg:text-left">
                        <div className="text-6xl lg:text-7xl font-light mb-3 animate-pulse">
                          {Math.round(weatherData.main.temp)}°C
                        </div>
                        <div className="text-xl lg:text-2xl text-white/80">
                          {translateWeatherDescription(
                            weatherData.weather[0].description,
                            language
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Forecast - 40% on right */}
                <div className="xl:col-span-2">
                  <div className="space-y-3 lg:space-y-4 h-full">
                    {processForecastData().map((item, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white/10 backdrop-blur-md rounded-xl p-4 lg:p-5 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 border border-white/5 animate-slide-in-right"
                        style={{animationDelay: `${0.6 + idx * 0.1}s`}}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 lg:space-x-4">
                            <img
                              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                              alt={item.weather[0].description}
                              className="w-12 h-12 lg:w-14 lg:h-14 animate-pulse"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-base lg:text-lg font-medium truncate">
                                <span className="font-bold">{titleCase(
                                  new Date(item.dt * 1000).toLocaleDateString(
                                    language === 'es' ? 'es-ES' : 'en-US',
                                    { weekday: 'long' }
                                  )
                                )}</span>
                              </div>
                              <div className="text-sm lg:text-base text-white/70 truncate">
                                {titleCase(
                                  translateWeatherDescription(
                                    item.weather[0].description,
                                    language
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-2">
                            <div className="text-base lg:text-lg font-medium">
                              {Math.round(item.main.temp_max)}°/{Math.round(item.main.temp_min)}°
                            </div>
                            <div className="text-sm lg:text-base text-white/70">
                              {item.main.humidity}% 💧
                            </div>
                            <div className="text-sm lg:text-base text-white/70">
                              {(item.wind.speed * 3.6).toFixed(1)} km/h 🌬️
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            !loading && !weatherData && (
              <div className="text-center text-white animate-fade-in-up">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-16 max-w-lg mx-auto border border-white/5 hover:bg-white/15 transition-all duration-500">
                  <div className="text-8xl mb-8 animate-bounce-slow">🌤️</div>
                  <h2 className="text-3xl lg:text-4xl font-light mb-6">{texts[language].startMessage}</h2>
                  <p className="text-xl text-white/80">{texts[language].searchHint}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in-left {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-in-right {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 1s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default App;