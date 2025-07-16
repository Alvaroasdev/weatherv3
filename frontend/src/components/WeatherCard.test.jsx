import { describe, it, expect } from 'vitest'; // Importamos funciones para describir y correr tests
import { render } from '@testing-library/react'; // Usamos para renderizar el componente en un entorno de prueba
import WeatherCard from './WeatherCard'; // Componente que vamos a testear
import React from 'react'; // React siempre debe importarse al usar JSX

// Agrupamos los tests relacionados con WeatherCard
describe('WeatherCard', () => {
  // Test básico para asegurarnos que el componente se renderiza sin errores con datos simulados
  it('renders without crashing', () => {
    // Definimos textos de muestra que el componente espera para mostrar etiquetas en inglés
    const mockTexts = {
      en: {
        lastUpdate: 'Last update:',
        humidity: 'Humidity',
        wind: 'Wind',
      },
    };

    // Renderizamos el componente con datos de clima simulados
    render(
      <WeatherCard
        weatherData={{
          weather: [{ description: 'clear sky', icon: '01d' }], // Condiciones climáticas
          main: { temp: 20, humidity: 50 }, // Temperatura y humedad
          wind: { speed: 2 }, // Velocidad del viento
          name: 'Test', // Nombre de la ciudad
          sys: { country: 'US' }, // Código del país
          dt: 0, // Timestamp (se puede usar un número cualquiera para pruebas)
        }}
        language="en" // Lenguaje para los textos
        texts={mockTexts} // Textos para etiquetas y mensajes
      />
    );
  });
});

