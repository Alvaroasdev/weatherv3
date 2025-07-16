import { describe, it, expect, vi } from 'vitest'; // Importamos funciones para tests y mocks
import { render, fireEvent } from '@testing-library/react'; // Herramientas para renderizar y simular eventos
import LanguageToggle from './LanguageToggle'; // Componente que vamos a probar

// Agrupamos los tests para el componente LanguageToggle
describe('LanguageToggle', () => {
  // Test para verificar que el botón se renderiza bien y llama a la función toggle al hacer click
  it('renders correctly and toggles language on click', () => {
    const toggleLanguageMock = vi.fn(); // Creamos una función simulada para el toggle

    // Renderizamos el componente con idioma inglés inicialmente
    const { getByRole } = render(
      <LanguageToggle language="en" toggleLanguage={toggleLanguageMock} />
    );

    // Buscamos el botón por su rol y etiqueta accesible
    const button = getByRole('button', { name: /Switch to Spanish/i });
    expect(button).toBeDefined(); // Verificamos que el botón existe en el DOM
    expect(button.textContent).toBe('🇪🇸 ES'); // Comprobamos que el texto del botón es correcto

    // Simulamos un click en el botón
    fireEvent.click(button);
    // Verificamos que la función toggle se haya llamado una vez
    expect(toggleLanguageMock).toHaveBeenCalled();
  });

  // Test para cuando el idioma es español, asegurando que muestra el texto y aria-label correctos
  it('renders Spanish button and aria-label when language is "es"', () => {
    const toggleLanguageMock = vi.fn();

    // Renderizamos con el idioma español
    const { getByRole } = render(
      <LanguageToggle language="es" toggleLanguage={toggleLanguageMock} />
    );

    // Buscamos el botón usando el aria-label en español
    const button = getByRole('button', { name: /Cambiar a inglés/i });
    expect(button).toBeDefined(); // Comprobamos que existe el botón
    expect(button.textContent).toBe('🇬🇧 EN'); // Verificamos que el texto sea el correcto
  });
});
