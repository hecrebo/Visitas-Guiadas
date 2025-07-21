# Despliegue en Netlify - Visitas Guiadas

## Configuración Actual

Este proyecto está configurado para desplegar solo el **frontend** en Netlify. El backend necesitará ser desplegado por separado.

## Pasos para el Despliegue

### 1. Preparar el Repositorio

El proyecto ya está configurado con:
- `netlify.toml` - Configuración de Netlify
- Script `build:frontend` - Para construir solo el frontend
- Configuración de API base URL

### 2. Desplegar en Netlify

#### Opción A: Desde GitHub/GitLab
1. Ve a [netlify.com](https://netlify.com)
2. Haz clic en "New site from Git"
3. Conecta tu repositorio
4. Configura:
   - **Build command**: `npm run build:frontend`
   - **Publish directory**: `dist/public`
5. Haz clic en "Deploy site"

#### Opción B: Drag & Drop
1. Ejecuta localmente: `npm run build:frontend`
2. Sube la carpeta `dist/public` a Netlify

### 3. Configurar Variables de Entorno

En el dashboard de Netlify, ve a **Site settings > Environment variables** y agrega:

```
VITE_API_URL=https://tu-backend-url.com
```

**Nota**: Reemplaza `https://tu-backend-url.com` con la URL real de tu backend.

### 4. Desplegar el Backend

El backend necesita ser desplegado por separado. Opciones recomendadas:

#### Opción A: Railway
1. Ve a [railway.app](https://railway.app)
2. Conecta tu repositorio
3. Configura las variables de entorno:
   - `DATABASE_URL` - URL de tu base de datos PostgreSQL
4. Deploy

#### Opción B: Render
1. Ve a [render.com](https://render.com)
2. Crea un nuevo Web Service
3. Conecta tu repositorio
4. Configura:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - Variables de entorno: `DATABASE_URL`

#### Opción C: Heroku
1. Ve a [heroku.com](https://heroku.com)
2. Crea una nueva app
3. Conecta tu repositorio
4. Configura las variables de entorno

### 5. Configurar CORS (si es necesario)

Si tu backend está en un dominio diferente, asegúrate de configurar CORS:

```typescript
// En server/index.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
```

### 6. Base de Datos

Asegúrate de tener una base de datos PostgreSQL configurada:
- **Railway**: Ofrece PostgreSQL
- **Render**: Ofrece PostgreSQL
- **Heroku**: Ofrece PostgreSQL
- **Neon**: Base de datos PostgreSQL serverless

## Estructura del Proyecto

```
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Esquemas compartidos
├── netlify.toml     # Configuración de Netlify
└── package.json     # Scripts de build
```

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build solo frontend (para Netlify)
npm run build:frontend

# Build completo (frontend + backend)
npm run build

# Verificar tipos
npm run check
```

## Troubleshooting

### Error: "Module not found"
- Asegúrate de que todas las dependencias estén en `package.json`
- Ejecuta `npm install` antes del build

### Error: "API calls failing"
- Verifica que `VITE_API_URL` esté configurada correctamente
- Asegúrate de que el backend esté desplegado y funcionando

### Error: "Build failing"
- Verifica que Node.js versión 18+ esté configurada
- Revisa los logs de build en Netlify 