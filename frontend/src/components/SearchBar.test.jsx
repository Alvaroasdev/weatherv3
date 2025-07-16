/// <reference types="vitest" /> 
// Esto ayuda a que el editor reconozca los tipos y funciones de Vitest

import { describe, it, expect } from 'vitest'; // Importamos funciones básicas para tests
import { render } from '@testing-library/react'; // Herramienta para renderizar componentes en tests
import SearchBar from './SearchBar'; // Componente que vamos a probar
import React from 'react'; // Siempre importar React cuando usamos JSX

// Agrupamos los tests relacionados con SearchBar
describe('SearchBar', () => {
  // Test simple para asegurarnos que el componente se renderiza sin errores
  it('renders without crashing', () => {
    render(
      <SearchBar
        value=""                  // Valor inicial del input vacío
        onChange={() => {}}       // Función vacía para manejar cambios
        onSubmit={() => {}}       // Función vacía para manejar el envío
        placeholder="Search..."   // Texto que aparece cuando el input está vacío
        suggestions={[]}          // Array vacío para las sugerencias
        onSelectSuggestion={() => {}} // Función vacía al seleccionar una sugerencia
      />
    );
  });
});
