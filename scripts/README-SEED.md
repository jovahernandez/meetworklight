# Instrucciones para Agregar Vacantes de Prueba

## Pasos para ejecutar el script en Supabase:

### 1. Crear un perfil de reclutador primero
- Inicia sesión en tu aplicación (http://localhost:8000)
- Regístrate con un nuevo email
- Selecciona "Soy Reclutador"
- Completa el formulario de perfil de reclutador

### 2. Ejecutar el script SQL
1. Ve a tu proyecto en Supabase: https://app.supabase.com
2. Entra en "SQL Editor" en el menú lateral
3. Crea una nueva query
4. Copia y pega el contenido del archivo `scripts/seed-jobs.sql`
5. Haz clic en "Run" para ejecutar el script

### 3. Verificar las vacantes
- El script insertará 8 vacantes de prueba automáticamente
- Todas estarán asociadas al primer perfil de reclutador en la base de datos
- Las vacantes incluyen diferentes sectores:
  - Manufactura (Operador de Maquinaria)
  - Construcción (Soldador, Operador de Grúa)
  - Automotriz (Técnico de Mantenimiento)
  - Alimentaria (Supervisor de Producción)
  - Logística (Almacenista)
  - Química (Técnico de Calidad)
  - Minería (Mecánico Industrial)

### 4. Ver las vacantes en la aplicación
- Ve a http://localhost:8000/jobs
- Deberías ver las 8 vacantes de prueba listadas

## Nota importante:
El script usa `(SELECT id FROM recruiter_profiles LIMIT 1)` para obtener automáticamente el primer perfil de reclutador. Si tienes múltiples perfiles y quieres asociar las vacantes a uno específico, puedes modificar esa línea con el ID específico del perfil.

## Troubleshooting:
Si el script falla, verifica que:
1. Tienes al menos un perfil de reclutador creado
2. La tabla `job_postings` existe en tu base de datos
3. Los permisos de RLS permiten la inserción (puedes deshabilitarlos temporalmente si es necesario)
