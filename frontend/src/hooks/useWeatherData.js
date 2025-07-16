import { useState } from 'react';

export function useWeatherData(language) {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtiene la base URL según variable de entorno o fallback
  const getBaseUrl = () => {
    const envUrl = import.meta.env.VITE_BACKEND_URL;

    if (!envUrl) {
      console.warn(
        '⚠️ VITE_BACKEND_URL no está definida, se usará URL por defecto para producción'
      );
      return 'https://best-weather-web-qtgn.vercel.app'; // fallback producción
    }
    return envUrl;
  };

  const baseUrl = getBaseUrl();

  const buildUrl = (locationOrCoords) => {
    if (!baseUrl) {
      console.error('baseUrl no está definida');
      return null;
    }

    let url = `${baseUrl}/api/weather?lang=${language}`;

    if (typeof locationOrCoords === 'string') {
      url += `&city=${encodeURIComponent(locationOrCoords.trim())}`;
    } else if (typeof locationOrCoords === 'object') {
      const { lat, lon } = locationOrCoords;
      if (lat == null || lon == null) return null;
      url += `&lat=${lat}&lon=${lon}`;
    } else {
      return null;
    }
    return url;
  };

  const fetchWeather = async (locationOrCoords) => {
    if (!locationOrCoords) return;

    if (!baseUrl) {
      console.error(
        'Backend URL no configurada. Verifica VITE_BACKEND_URL en variables de entorno'
      );
      setError('Backend URL no configurada - revisar variables de entorno');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = buildUrl(locationOrCoords);
      if (!url) {
        setError('Parámetros de ubicación inválidos');
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching weather from:', url);

      const res = await fetch(url);

      if (!res.ok) {
        if (res.status === 429) {
          const data = await res.json();
          alert(
            data.secondsLeft
              ? `Espera ${data.secondsLeft} segundos antes de hacer otra consulta.`
              : data.error || 'Demasiadas solicitudes. Intenta luego.'
          );
        } else {
          console.error('❌ Error response:', res.status, res.statusText);
          console.error('❌ Response URL:', res.url);
          console.error(
            '❌ Response headers:',
            Object.fromEntries(res.headers.entries())
          );

          try {
            const errorText = await res.text();
            console.error('❌ Response body:', errorText);
          } catch (e) {
            console.error('❌ Could not read response body:', e);
          }

          throw new Error(
            `Error fetching weather: ${res.status} ${res.statusText}`
          );
        }
        setWeatherData(null);
        setForecastData(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log('Weather data received:', data);
      setWeatherData(data.weather);
      setForecastData(data.forecast);
    } catch (e) {
      console.error('Fetch error:', e);
      setError(`Error al obtener datos: ${e.message}`);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    weatherData,
    forecastData,
    fetchWeather,
    loading,
    error,
    baseUrl, // para debugging si quieres
  };
}
