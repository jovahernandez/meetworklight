# Guía de Despliegue en Vercel - Meetwork Light

## Pre-requisitos
1. Cuenta de GitHub
2. Cuenta de Vercel (puedes usar tu cuenta de GitHub)
3. Tu código debe estar en un repositorio de GitHub

## Paso 1: Preparar el proyecto

### 1.1 Crear archivo .env.example
Este archivo sirve como plantilla para las variables de entorno:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

### 1.2 Verificar que .gitignore incluya:
```
.env.local
.env*.local
.next
node_modules
```

## Paso 2: Subir código a GitHub

### Opción A: Si NO tienes repositorio aún

1. Abre una terminal en tu proyecto:
```powershell
cd "c:\Users\jovan\Desktop\meetwork ligh"
```

2. Inicializa git:
```powershell
git init
git add .
git commit -m "Initial commit - Meetwork Light MVP"
```

3. Crea un nuevo repositorio en GitHub:
   - Ve a https://github.com/new
   - Nombre: `meetwork-light`
   - Descripción: "Plataforma de vacantes para el sector industrial"
   - Público o Privado (tu elección)
   - NO inicialices con README, .gitignore ni licencia

4. Conecta y sube:
```powershell
git remote add origin https://github.com/TU_USUARIO/meetwork-light.git
git branch -M main
git push -u origin main
```

### Opción B: Si YA tienes repositorio

```powershell
cd "c:\Users\jovan\Desktop\meetwork ligh"
git add .
git commit -m "Preparado para deploy en Vercel"
git push
```

## Paso 3: Desplegar en Vercel

### 3.1 Importar proyecto
1. Ve a https://vercel.com
2. Haz clic en "Add New" → "Project"
3. Importa tu repositorio de GitHub
4. Selecciona el repositorio `meetwork-light`

### 3.2 Configurar el proyecto
Vercel detectará automáticamente que es Next.js:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (dejar por defecto)
- **Build Command**: `npm run build` (ya está configurado)
- **Output Directory**: `.next` (ya está configurado)
- **Install Command**: `npm install` (ya está configurado)

### 3.3 Configurar Variables de Entorno
En la sección "Environment Variables", agrega:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fvqaczvjimslzupfrjrm.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tu anon key de Supabase |

**Para obtener tu anon key:**
1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Settings → API
4. Copia "anon/public" key

### 3.4 Deploy
1. Haz clic en "Deploy"
2. Espera 2-3 minutos mientras Vercel construye tu app
3. ¡Listo! Tu app estará en una URL como: `meetwork-light.vercel.app`

## Paso 4: Configurar Supabase para producción

### 4.1 Actualizar URL permitidas en Supabase
1. Ve a tu proyecto en Supabase
2. Authentication → URL Configuration
3. Agrega tu URL de Vercel a "Site URL":
   ```
   https://tu-proyecto.vercel.app
   ```
4. Agrega a "Redirect URLs":
   ```
   https://tu-proyecto.vercel.app/**
   ```

### 4.2 Verificar CORS
En Supabase → Settings → API:
- Allowed origins debe incluir tu dominio de Vercel

## Paso 5: Verificar el despliegue

1. Abre tu URL de Vercel
2. Prueba el registro de usuario
3. Verifica que puedas crear vacantes
4. Confirma que los filtros funcionen

## Comandos útiles para futuras actualizaciones

```powershell
# Después de hacer cambios en tu código:
git add .
git commit -m "Descripción de tus cambios"
git push

# Vercel automáticamente detectará el push y redespleglará
```

## Troubleshooting

### Error: "Module not found"
- Verifica que todas las dependencias estén en `package.json`
- En Vercel → Settings → General → Build & Development Settings
- Asegúrate que Node.js version sea 18.x o superior

### Error de base de datos
- Verifica que las variables de entorno estén correctamente configuradas
- Revisa los logs en Vercel → Deployments → (tu deployment) → Function Logs

### Redirecciones no funcionan
- Verifica que el middleware esté correctamente configurado
- Asegúrate que las rutas en Supabase Auth incluyan tu dominio

## Dominios personalizados (Opcional)

Si tienes un dominio propio:
1. Vercel → Settings → Domains
2. Agrega tu dominio
3. Sigue las instrucciones de DNS
4. Actualiza las URLs en Supabase

## Notas importantes

- **Cada push a main desplegará automáticamente**
- Los logs están en Vercel → Deployments
- Puedes crear preview deployments desde branches
- Vercel tiene un plan gratuito generoso para proyectos personales
