const weatherDescriptions = {
  // Thunderstorm
  'thunderstorm with light rain': {
    es: 'Tormenta con lluvia ligera',
    en: 'Thunderstorm with light rain',
  },
  'thunderstorm with rain': {
    es: 'Tormenta con lluvia',
    en: 'Thunderstorm with rain',
  },
  'thunderstorm with heavy rain': {
    es: 'Tormenta con lluvia intensa',
    en: 'Thunderstorm with heavy rain',
  },
  'light thunderstorm': { es: 'Tormenta ligera', en: 'Light thunderstorm' },
  thunderstorm: { es: 'Tormenta', en: 'Thunderstorm' },
  'heavy thunderstorm': { es: 'Tormenta fuerte', en: 'Heavy thunderstorm' },
  'ragged thunderstorm': {
    es: 'Tormenta irregular',
    en: 'Ragged thunderstorm',
  },
  'thunderstorm with light drizzle': {
    es: 'Tormenta con llovizna ligera',
    en: 'Thunderstorm with light drizzle',
  },
  'thunderstorm with drizzle': {
    es: 'Tormenta con llovizna',
    en: 'Thunderstorm with drizzle',
  },
  'thunderstorm with heavy drizzle': {
    es: 'Tormenta con llovizna intensa',
    en: 'Thunderstorm with heavy drizzle',
  },

  // Drizzle
  'light intensity drizzle': {
    es: 'Llovizna ligera',
    en: 'Light intensity drizzle',
  },
  drizzle: { es: 'Llovizna', en: 'Drizzle' },
  'heavy intensity drizzle': {
    es: 'Llovizna intensa',
    en: 'Heavy intensity drizzle',
  },
  'light intensity drizzle rain': {
    es: 'Llovizna ligera con lluvia',
    en: 'Light drizzle rain',
  },
  'drizzle rain': { es: 'Lluvia con llovizna', en: 'Drizzle rain' },
  'heavy intensity drizzle rain': {
    es: 'Lluvia intensa con llovizna',
    en: 'Heavy drizzle rain',
  },
  'shower rain and drizzle': {
    es: 'Chubascos y llovizna',
    en: 'Shower rain and drizzle',
  },
  'heavy shower rain and drizzle': {
    es: 'Chubascos intensos y llovizna',
    en: 'Heavy shower rain and drizzle',
  },
  'shower drizzle': { es: 'Chubasco de llovizna', en: 'Shower drizzle' },

  // Rain
  'light rain': { es: 'Lluvia ligera', en: 'Light rain' },
  'moderate rain': { es: 'Lluvia moderada', en: 'Moderate rain' },
  'heavy intensity rain': { es: 'Lluvia intensa', en: 'Heavy intensity rain' },
  'very heavy rain': { es: 'Lluvia muy intensa', en: 'Very heavy rain' },
  'extreme rain': { es: 'Lluvia extrema', en: 'Extreme rain' },
  'freezing rain': { es: 'Lluvia helada', en: 'Freezing rain' },
  'light intensity shower rain': {
    es: 'Chubasco de baja intensidad',
    en: 'Light intensity shower rain',
  },
  'shower rain': { es: 'Chubascos', en: 'Shower rain' },
  'heavy intensity shower rain': {
    es: 'Chubascos intensos',
    en: 'Heavy shower rain',
  },
  'ragged shower rain': {
    es: 'Chubascos irregulares',
    en: 'Ragged shower rain',
  },

  // Snow
  'light snow': { es: 'Nieve ligera', en: 'Light snow' },
  snow: { es: 'Nieve', en: 'Snow' },
  'heavy snow': { es: 'Nieve intensa', en: 'Heavy snow' },
  sleet: { es: 'Aguanieve', en: 'Sleet' },
  'light shower sleet': {
    es: 'Chubasco de aguanieve ligera',
    en: 'Light shower sleet',
  },
  'shower sleet': { es: 'Chubasco de aguanieve', en: 'Shower sleet' },
  'light rain and snow': {
    es: 'Lluvia ligera y nieve',
    en: 'Light rain and snow',
  },
  'rain and snow': { es: 'Lluvia y nieve', en: 'Rain and snow' },
  'light shower snow': {
    es: 'Chubasco de nieve ligera',
    en: 'Light shower snow',
  },
  'shower snow': { es: 'Chubasco de nieve', en: 'Shower snow' },
  'heavy shower snow': {
    es: 'Chubasco de nieve intensa',
    en: 'Heavy shower snow',
  },

  // Atmosphere
  mist: { es: 'Niebla', en: 'Mist' },
  smoke: { es: 'Humo', en: 'Smoke' },
  haze: { es: 'Neblina', en: 'Haze' },
  'sand/dust whirls': {
    es: 'Remolinos de arena/polvo',
    en: 'Sand/dust whirls',
  },
  fog: { es: 'Niebla espesa', en: 'Fog' },
  sand: { es: 'Arena', en: 'Sand' },
  dust: { es: 'Polvo', en: 'Dust' },
  'volcanic ash': { es: 'Ceniza volcánica', en: 'Volcanic ash' },
  squalls: { es: 'Ráfagas', en: 'Squalls' },
  tornado: { es: 'Tornado', en: 'Tornado' },

  // Clear & Clouds
  'clear sky': { es: 'Cielo despejado', en: 'Clear sky' },
  'few clouds': { es: 'Pocas nubes', en: 'Few clouds' },
  'scattered clouds': { es: 'Nubes dispersas', en: 'Scattered clouds' },
  'broken clouds': { es: 'Nubes rotas', en: 'Broken clouds' },
  'overcast clouds': { es: 'Nubes densas', en: 'Overcast clouds' },
};

export function translateWeatherDescription(description, language) {
  const translation = weatherDescriptions[description.toLowerCase()];
  return translation ? translation[language] || description : description;
}
