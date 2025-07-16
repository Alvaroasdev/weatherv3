// components/ForecastPanel.js
import React from 'react';
import { titleCase } from '../utils/titleCase';
import { translateWeatherDescription } from '../utils/weatherTranslations';

const ForecastPanel = ({ forecastData, language, texts }) => {
  if (!forecastData || forecastData.length === 0) {
    return (
      <div>{texts[language].noForecast || 'No forecast data available'}</div>
    );
  }

  // Filtramos para excluir el día actual y obtener solo los próximos 5 días
  const filteredForecast = [
    ...new Map(
      forecastData
        .filter((item) => {
          const itemDate = new Date(item.dt * 1000).toDateString();
          const today = new Date().toDateString();
          return itemDate !== today;
        })
        .map((item) => {
          const date = new Date(item.dt * 1000).toDateString();
          return [date, item];
        })
    ).values(),
  ].slice(0, 5);

  return (
    <div className="right-panel">
      {filteredForecast.map((item, idx) => (
        <div
          key={idx}
          className="forecast-card">
          <h3>
            {titleCase(
              new Date(item.dt * 1000).toLocaleDateString(
                language === 'es' ? 'es-ES' : 'en-US',
                { weekday: 'long' }
              )
            )}
          </h3>
          <img
            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
            alt={item.weather[0].description}
          />
          <p>
            {Math.round(item.main.temp_min)}° / {Math.round(item.main.temp_max)}
            °
          </p>
          <p>
            {translateWeatherDescription(item.weather[0].description, language)}
          </p>
          <p>
            {texts[language].humidity}: {item.main.humidity}%
          </p>
          <p>
            {texts[language].wind}: {(item.wind.speed * 3.6).toFixed(2)} km/h
          </p>
        </div>
      ))}
    </div>
  );
};

export default ForecastPanel;
