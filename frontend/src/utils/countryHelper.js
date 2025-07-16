import countries from 'i18n-iso-countries';
import esLocale from 'i18n-iso-countries/langs/es.json';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(esLocale);
countries.registerLocale(enLocale);

export function getCountryName(code, language) {
  return countries.getName(code, language) || code;
}
