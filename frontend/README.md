# 🌤️ Weather Info - React + OpenWeather

Aplicación web moderna para consultar el clima actual y pronóstico de 4/5 días. Diseño minimalista y responsive.

![React](https://img.shields.io/badge/React-18.0+-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0+-purple?style=for-the-badge&logo=vite)

---

## ✨ Características

- **Clima Actual**: Temperatura, humedad, viento, probabilidad de lluvia
- **Pronóstico 4/5 Días**: Información detallada día a día
- **Búsqueda Inteligente**: Autocompletado de ciudades con API real
- **Ubicación GPS**: Obtener clima de tu ubicación actual
- **Diseño Responsive**: Perfecto en móvil, tablet y desktop
- **Español/Inglés**: Cambio de idioma en tiempo real

---

## 🛠️ Tecnologías

- **React** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **OpenWeather API** - Datos meteorológicos

---

## 🚀 Instalación Rápida

### 1. Obtener API Key
1. Ve a [OpenWeather](https://openweathermap.org/)
2. Crea cuenta gratuita y obtén tu API key

### 2. Configurar Proyecto

```bash
# Clonar y instalar
git clone https://github.com/tu-usuario/weather-app.git
cd weather-app/frontend
npm install

# Crear archivo de configuración
echo "VITE_OPENWEATHER_API_KEY=tu_api_key_aqui" > .env.local
```

### 3. Ejecutar

```bash
npm run dev
```

La app estará en `http://localhost:5173`

---

## 🎯 Cómo Usar

1. **Buscar ciudad**: Escribe en el campo de búsqueda y selecciona del autocompletado
2. **Ubicación actual**: Haz clic en "📍 Usar ubicación"
3. **Cambiar idioma**: Haz clic en "🌐 English/Español"

---

## 🔧 Configuración

### Variables de Entorno (.env.local)
```env
# Solo frontend
VITE_OPENWEATHER_API_KEY=tu_api_key_aqui

# Con backend (opcional)
VITE_BACKEND_URL=http://localhost:3000
```

### Backend (Opcional)
Si quieres usar el backend incluido:

```bash
cd backend
npm install
echo "API_KEY=tu_api_key_aqui" > .env.local
npm run dev
```

---

## 📊 Límites API

- **1000 requests/día** (gratuito)
- **Suficiente** para desarrollo y uso personal
- **Fallback** con ciudades populares si se agota

---

## 🐛 Problemas Comunes

- **Autocompletado no funciona**: Verifica que tienes la API key configurada
- **Error de CORS**: Solo ocurre si usas backend (verifica que esté corriendo)
- **API key inválida**: Espera 2 horas después de crear la key

---

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Subir carpeta dist a Netlify
```

---

## 📄 Licencia

MIT License

---

⭐ **Si te gusta este proyecto, ¡dale una estrella!**
