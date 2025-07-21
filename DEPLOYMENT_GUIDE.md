# 🚀 Guía Completa de Despliegue - Visitas Guiadas

## 📋 Resumen

Tu proyecto está configurado para desplegar:
- **Frontend** → Netlify
- **Backend** → Railway/Render/Heroku
- **Base de datos** → PostgreSQL

## 🎯 Paso 1: Desplegar el Frontend en Netlify

### Opción A: Desde GitHub (Recomendado)

1. **Sube tu código a GitHub**
   ```bash
   git add .
   git commit -m "Configuración para Netlify"
   git push origin main
   ```

2. **Conecta con Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Haz clic en "New site from Git"
   - Selecciona tu repositorio
   - Configura:
     - **Build command**: `npm run build:frontend`
     - **Publish directory**: `dist/public`
   - Haz clic en "Deploy site"

### Opción B: Drag & Drop

1. **Construye localmente**
   ```bash
   npm install
   npm run build:frontend
   ```

2. **Sube a Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Arrastra la carpeta `dist/public` al área de deploy

## 🎯 Paso 2: Desplegar el Backend

### Opción A: Railway (Recomendado)

1. **Ve a Railway**
   - [railway.app](https://railway.app)
   - Conecta tu cuenta de GitHub

2. **Crea nuevo proyecto**
   - Haz clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Selecciona tu repositorio

3. **Configura el servicio**
   - Railway detectará automáticamente que es un proyecto Node.js
   - Configura las variables de entorno:
     ```
     DATABASE_URL=tu_url_de_postgresql
     FRONTEND_URL=https://tu-app.netlify.app
     NODE_ENV=production
     ```

4. **Agrega base de datos**
   - En Railway, haz clic en "New"
   - Selecciona "Database" → "PostgreSQL"
   - Railway generará automáticamente la `DATABASE_URL`

### Opción B: Render

1. **Ve a Render**
   - [render.com](https://render.com)
   - Conecta tu cuenta de GitHub

2. **Crea Web Service**
   - Haz clic en "New" → "Web Service"
   - Conecta tu repositorio
   - Configura:
     - **Name**: `visitas-guiadas-backend`
     - **Build Command**: `npm run build`
     - **Start Command**: `npm start`
     - **Environment**: `Node`

3. **Configura variables**
   ```
   DATABASE_URL=tu_url_de_postgresql
   FRONTEND_URL=https://tu-app.netlify.app
   NODE_ENV=production
   ```

## 🎯 Paso 3: Configurar Variables de Entorno

### En Netlify (Frontend)

Ve a **Site settings > Environment variables** y agrega:

```
VITE_API_URL=https://tu-backend-url.railway.app
```

**Nota**: Reemplaza con la URL real de tu backend.

### En Railway/Render (Backend)

```
DATABASE_URL=postgresql://usuario:password@host:puerto/database
FRONTEND_URL=https://tu-app.netlify.app
NODE_ENV=production
```

## 🎯 Paso 4: Configurar Base de Datos

### Opción A: Railway (Automático)
- Railway crea automáticamente la base de datos
- La `DATABASE_URL` se configura automáticamente

### Opción B: Neon (Gratis)
1. Ve a [neon.tech](https://neon.tech)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Copia la URL de conexión
5. Úsala como `DATABASE_URL`

### Opción C: Supabase (Gratis)
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings > Database
4. Copia la connection string
5. Úsala como `DATABASE_URL`

## 🎯 Paso 5: Ejecutar Migraciones

Una vez que tengas la base de datos configurada:

```bash
# En Railway/Render, ejecuta en la terminal:
npm run db:push
```

O agrega este comando al build script:

```json
{
  "scripts": {
    "build": "npm run db:push && esbuild index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
  }
}
```

## 🔧 Configuración de CORS

El backend ya está configurado para aceptar peticiones desde Netlify. Si necesitas agregar más dominios, edita `server/cors.ts`:

```typescript
export const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://*.netlify.app",
    "https://*.netlify.com",
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
};
```

## 🧪 Pruebas

### Frontend
- Tu app estará disponible en: `https://tu-app.netlify.app`
- Verifica que las APIs funcionen correctamente

### Backend
- Prueba las APIs directamente: `https://tu-backend-url.railway.app/api/courses`
- Deberías recibir una respuesta JSON

## 🐛 Troubleshooting

### Error: "Build failed"
- Verifica que Node.js 18+ esté configurado
- Revisa los logs de build en Netlify/Railway

### Error: "API calls failing"
- Verifica que `VITE_API_URL` esté configurada correctamente
- Asegúrate de que el backend esté funcionando
- Revisa la configuración de CORS

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` esté correcta
- Asegúrate de que la base de datos esté activa
- Ejecuta las migraciones: `npm run db:push`

### Error: "CORS error"
- Verifica que `FRONTEND_URL` esté configurada en el backend
- Asegúrate de que el dominio esté en la lista de CORS

## 📊 Monitoreo

### Netlify
- Ve a tu dashboard de Netlify
- Revisa las métricas de visitas
- Configura notificaciones de deploy

### Railway/Render
- Monitorea los logs del backend
- Revisa el uso de recursos
- Configura alertas de errores

## 🔄 Actualizaciones

Para actualizar tu aplicación:

1. **Desarrollo local**
   ```bash
   git pull origin main
   npm install
   npm run dev
   ```

2. **Despliegue**
   - Haz push a GitHub
   - Netlify y Railway se actualizarán automáticamente

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Netlify/Railway
2. Verifica las variables de entorno
3. Prueba las APIs directamente
4. Consulta la documentación de cada plataforma

¡Tu aplicación de Visitas Guiadas estará lista para producción! 🎉 