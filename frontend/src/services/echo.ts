import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Registrar Pusher en el contexto global
window.Pusher = Pusher;

// Crear instancia de Echo
const echo = new Echo({
  broadcaster: 'pusher',
  key: 'app-key', // 🔑 el mismo que usas en Soketi (SOKETI_DEFAULT_APP_KEY)
  cluster: 'mt1', // 🔹 obligatorio aunque no uses Pusher Cloud
  wsHost: window.location.hostname, // normalmente 'localhost'
  wsPort: 6001, // puerto del contenedor Soketi
  wssPort: 6001, // opcional si usas HTTPS
  forceTLS: false, // no uses TLS en localhost
  disableStats: true, // desactiva métricas Pusher
  enabledTransports: ['ws', 'wss'], // WebSocket only
  authEndpoint: 'http://localhost:8000/broadcasting/auth', // endpoint Laravel para autenticar canales privados
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Sanctum token
      Accept: 'application/json',
    },
  },
});

export default echo;
