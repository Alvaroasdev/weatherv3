const OPENWEATHER_API_KEY = process.env.API_KEY;
const USE_UPSTASH = process.env.USE_UPSTASH === 'true';

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const MONTH_SECONDS = 30 * 24 * 60 * 60;

async function upstashFetch(path, options = {}) {
  const res = await fetch(UPSTASH_REDIS_REST_URL + path, {
    ...options,
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`Upstash error: ${res.status}`);
  return res.json();
}

export default async function handler(req, res) {
  // Headers CORS siempre presentes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    if (USE_UPSTASH) {
      // En producción con Upstash, pero sin límite
      const keyCount = 'api_call_count';
      const keyLastCall = 'api_last_call';

      // Actualizar contador y timestamp (solo para info, sin limitar)
      const countResp = await upstashFetch(`/get/${keyCount}`);
      const count = countResp.result ? parseInt(countResp.result) : 0;

      const now = Math.floor(Date.now() / 1000);

      if (count === 0) {
        await upstashFetch(`/setex/${keyCount}/${MONTH_SECONDS}/1`, { method: 'POST' });
      } else {
        await upstashFetch(`/incr/${keyCount}`, { method: 'POST' });
      }
      await upstashFetch(`/setex/${keyLastCall}/${MONTH_SECONDS}/${now}`, { method: 'POST' });
    }
    // Procesar parámetros
    const { city, lat, lon, lang } = req.query;
    const language = lang || 'en';

    let weatherUrl = '';
    let forecastUrl = '';

    if (city) {
      const encodedCity = encodeURIComponent(city);
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=${language}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=${language}`;
    } else if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=${language}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=${language}`;
    } else {
      return res.status(400).json({ error: 'Faltan parámetros de ubicación' });
    }

    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl),
    ]);

    if (!weatherRes.ok || !forecastRes.ok) {
      return res.status(500).json({ error: 'Error al obtener datos de OpenWeather' });
    }

    const weather = await weatherRes.json();
    const forecast = await forecastRes.json();

    return res.status(200).json({ weather, forecast });
  } catch (error) {
    console.error('Error en API:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
