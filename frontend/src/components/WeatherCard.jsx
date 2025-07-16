// components/WeatherCard.jsx
import React from 'react';
import { titleCase } from '../utils/titleCase';

const WeatherCard = ({ weatherData, language, texts }) => {
  const { name, sys, main, weather, wind, dt } = weatherData;
  return (
    <div className="location-info">
      <h1>{`${name}, ${sys.country}`}</h1>
      <p>
        {texts[language].lastUpdate}{' '}
        {new Date(dt * 1000).toLocaleTimeString(
          language === 'es' ? 'es-ES' : 'en-US',
          { hour: '2-digit', minute: '2-digit' }
        )}
      </p>
      <p>
        {texts[language].humidity}: {main.humidity} %
      </p>
      <p>
        {texts[language].wind}: {(wind.speed * 3.6).toFixed(2)} km/h
      </p>

      <div className="main-weather">
        <img
          src={`https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`}
          alt={weather[0].description}
          className="weather-icon"
        />
        <h2>{Math.round(main.temp)}°C</h2>
        <p>{titleCase(weather[0].description)}</p>
      </div>
    </div>
  );
};

export default WeatherCard;
