import cors from "cors";

// Configuración de CORS para permitir comunicación entre frontend y backend
export const corsOptions = {
  origin: [
    "http://localhost:5173", // Desarrollo local
    "http://localhost:3000", // Puerto alternativo
    process.env.FRONTEND_URL, // URL del frontend en producción
    "https://*.netlify.app", // Dominios de Netlify
    "https://*.netlify.com", // Dominios de Netlify
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export const corsMiddleware = cors(corsOptions); 