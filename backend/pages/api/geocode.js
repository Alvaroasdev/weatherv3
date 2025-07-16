const OPENWEATHER_API_KEY = process.env.API_KEY;

export default async function handler(req, res) {
  // Headers CORS siempre presentes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { q, limit = 5, lang = 'en' } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Query debe tener al menos 2 caracteres' });
    }

    // Llamar a la API de OpenWeather Geocoding
    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=${limit}&appid=${OPENWEATHER_API_KEY}`;
    
    const response = await fetch(geocodeUrl);
    
    if (!response.ok) {
      return res.status(500).json({ error: 'Error al obtener datos de geocoding' });
    }

    const data = await response.json();

    // Transformar los datos para incluir nombres de países en el idioma correcto
    const transformedData = data.map(place => ({
      name: place.name,
      country: place.country,
      countryName: getCountryName(place.country, lang),
      lat: place.lat,
      lon: place.lon,
      state: place.state,
    }));

    return res.status(200).json(transformedData);
  } catch (error) {
    console.error('Error en geocoding API:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Función helper para obtener nombres de países
function getCountryName(countryCode, language) {
  const countries = {
    en: {
      ES: 'Spain', GB: 'United Kingdom', FR: 'France', IT: 'Italy', DE: 'Germany',
      NL: 'Netherlands', US: 'United States', JP: 'Japan', CN: 'China', AU: 'Australia',
      CA: 'Canada', MX: 'Mexico', AR: 'Argentina', BR: 'Brazil', PE: 'Peru',
      CO: 'Colombia', CL: 'Chile', VE: 'Venezuela', EC: 'Ecuador'
    },
    es: {
      ES: 'España', GB: 'Reino Unido', FR: 'Francia', IT: 'Italia', DE: 'Alemania',
      NL: 'Países Bajos', US: 'Estados Unidos', JP: 'Japón', CN: 'China', AU: 'Australia',
      CA: 'Canadá', MX: 'México', AR: 'Argentina', BR: 'Brasil', PE: 'Perú',
      CO: 'Colombia', CL: 'Chile', VE: 'Venezuela', EC: 'Ecuador'
    }
  };
  
  return countries[language]?.[countryCode] || countryCode;
} 