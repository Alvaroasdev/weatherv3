import fetch from 'node-fetch';

const URL = 'http://localhost:3000/api/weather?city=Madrid'; // Cambia el puerto si usas otro
const TOTAL_REQUESTS = 25; // Más de 20 para probar el límite

(async () => {
  for (let i = 1; i <= TOTAL_REQUESTS; i++) {
    const res = await fetch(URL);
    const data = await res.json();
    console.log(`Request ${i}: Status ${res.status} -`, data);
  }
})();