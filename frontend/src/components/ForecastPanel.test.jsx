import { describe, it } from 'vitest'; // Importamos funciones para definir los tests
import { render } from '@testing-library/react'; // Utilidad para renderizar componentes en tests
import ForecastPanel from './ForecastPanel'; // Componente que vamos a testear
import React from 'react'; // React necesario para JSX

// Agrupamos los tests relacionados con ForecastPanel
describe('ForecastPanel', () => {
  // Definimos un test que verifica que el componente se renderiza sin errores
  it('renders without crashing with mock data', () => {
    // Datos de texto simulados para los idiomas inglés y español
    const mockTexts = {
      en: {
        humidity: 'Humidity',
        wind: 'Wind',
        noForecast: 'No forecast data available',
      },
      es: {
        humidity: 'Humedad',
        wind: 'Viento',
        noForecast: 'No hay datos de pronóstico disponibles',
      }
    };

    // Datos simulados del pronóstico para pasar al componente
    const mockForecastData = [
      {
        dt: Math.floor(Date.now() / 1000) + 86400, // Marca de tiempo para "mañana"
        weather: [{ description: 'clear sky', icon: '01d' }], // Estado del tiempo simulado
        main: { temp_min: 15, temp_max: 25, humidity: 40 }, // Temperaturas y humedad
        wind: { speed: 3 }, // Velocidad del viento
      },
      // Aquí podrías agregar más días para simular un pronóstico completo
    ];

    // Renderizamos el componente con los datos simulados para asegurarnos que no da error
    render(
      <ForecastPanel
        forecastData={mockForecastData}
        language="en"
        texts={mockTexts}
      />
    );
  });
});
