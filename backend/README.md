# Backend - Visitas Guiadas

Este es el backend independiente para la aplicación de Visitas Guiadas.

## Características

- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **Drizzle ORM** - ORM para TypeScript
- **CORS** - Configurado para comunicación con frontend
- **APIs REST** - Para gestión de cursos y tours

## APIs Disponibles

### Cursos
- `GET /api/courses` - Obtener todos los cursos
- `GET /api/courses/:id` - Obtener curso específico
- `POST /api/courses` - Crear nuevo curso
- `PATCH /api/courses/:id` - Actualizar curso
- `DELETE /api/courses/:id` - Eliminar curso

### Tours
- `GET /api/tours` - Obtener todos los tours

### Registros de Cursos
- `GET /api/course-registrations` - Obtener todos los registros
- `POST /api/course-registrations` - Crear nuevo registro
- `PATCH /api/course-registrations/:id/status` - Actualizar estado
- `DELETE /api/course-registrations/:id` - Eliminar registro

### Registros de Tours
- `GET /api/tour-registrations` - Obtener todos los registros
- `POST /api/tour-registrations` - Crear nuevo registro
- `PATCH /api/tour-registrations/:id/status` - Actualizar estado
- `DELETE /api/tour-registrations/:id` - Eliminar registro

## Variables de Entorno

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/visitas_guiadas
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://tu-frontend-url.netlify.app
```

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## Despliegue

### Railway (Recomendado)

1. Ve a [railway.app](https://railway.app)
2. Conecta tu repositorio
3. Configura las variables de entorno:
   - `DATABASE_URL` - URL de PostgreSQL
   - `FRONTEND_URL` - URL del frontend en Netlify
4. Deploy

### Render

1. Ve a [render.com](https://render.com)
2. Crea un nuevo Web Service
3. Conecta tu repositorio
4. Configura:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - Variables de entorno

### Heroku

1. Ve a [heroku.com](https://heroku.com)
2. Crea una nueva app
3. Conecta tu repositorio
4. Configura las variables de entorno
5. Deploy

## Base de Datos

Asegúrate de tener una base de datos PostgreSQL configurada:

- **Railway**: Ofrece PostgreSQL automáticamente
- **Render**: Ofrece PostgreSQL
- **Heroku**: Ofrece PostgreSQL
- **Neon**: Base de datos PostgreSQL serverless

## CORS

El backend está configurado para aceptar peticiones desde:
- `http://localhost:5173` (desarrollo)
- `https://*.netlify.app` (Netlify)
- `https://*.netlify.com` (Netlify)
- URL configurada en `FRONTEND_URL` 