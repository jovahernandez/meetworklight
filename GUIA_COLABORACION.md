# Guía de Colaboración - Meetwork Light

## Para el Nuevo Colaborador

### 1. Aceptar Invitación
- Revisa tu email o notificaciones de GitHub
- Acepta la invitación al repositorio `jovahernandez/meetworklight`

### 2. Clonar el Repositorio
```bash
git clone https://github.com/jovahernandez/meetworklight.git
cd meetworklight
```

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://fvqaczvjimslzupfrjrm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2cWFjenZqaW1zbHp1cGZyanJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMzI2NTQsImV4cCI6MjA3ODgwODY1NH0.2rG53jx_dKGf61mykgUdMzS1VsxZKI1wWa2QvlwPSv4

# MetaMap (opcional - para KYC)
NEXT_PUBLIC_METAMAP_CLIENT_ID=tu_client_id
METAMAP_SECRET_KEY=tu_secret_key
```

**IMPORTANTE:** Solicita las credenciales completas a Jovan si necesitas acceso a MetaMap.

### 5. Correr Servidor de Desarrollo
```bash
npm run dev
```

La aplicación estará en: http://localhost:8000

---

## Workflow de Trabajo Recomendado

### Opción A: Trabajo Directo en Main (Simple)
Si son solo 2 personas y confían en el código del otro:

```bash
# Antes de empezar a trabajar
git pull origin main

# Hacer cambios...

# Commitear
git add .
git commit -m "Descripción de cambios"

# Push
git push origin main
```

### Opción B: Trabajo con Branches (Recomendado)
Para evitar conflictos y hacer code review:

```bash
# Crear branch para tu feature
git checkout -b feature/nombre-de-tu-feature

# Hacer cambios y commitear
git add .
git commit -m "Descripción de cambios"

# Push de tu branch
git push origin feature/nombre-de-tu-feature

# En GitHub: Crear Pull Request
# Jovan revisa y aprueba
# Hacer merge a main
```

**Nombres de branches sugeridos:**
- `feature/nueva-funcionalidad` - Para nuevas features
- `fix/correccion-de-bug` - Para bugs
- `docs/documentacion` - Para documentación
- `refactor/mejora-codigo` - Para refactorización

---

## Estructura del Proyecto

```
meetwork-ligh/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Autenticación
│   │   ├── jobs/              # Vacantes públicas
│   │   ├── recruiter/         # Dashboard reclutadores
│   │   ├── seeker/            # Dashboard buscadores
│   │   ├── legal/             # Términos
│   │   └── api/               # API Routes
│   ├── application/           # Use Cases (lógica negocio)
│   ├── domain/                # Entidades y reglas
│   ├── infrastructure/        # Supabase, MetaMap, etc.
│   ├── ports/                 # Interfaces
│   ├── components/            # Componentes React
│   ├── lib/                   # Utilidades
│   └── middleware.ts          # Auth middleware
├── docs/                      # Documentación
├── scripts/                   # Scripts SQL
├── supabase/migrations/       # Migraciones BD
├── ESTADO_PROYECTO_ITERACION_5.md  # Estado actual
└── package.json
```

---

## Accesos que Necesitarás

### 1. GitHub
- ✅ Ya tienes acceso como colaborador

### 2. Supabase Dashboard
**URL:** https://supabase.com/dashboard/project/fvqaczvjimslzupfrjrm

**Solicitar a Jovan:**
- Invitación como miembro del proyecto
- Podrás ver BD, auth, storage, etc.

### 3. Vercel (Opcional)
**URL:** https://vercel.com/jovanigits-projects/meetwork-ligh

**Solicitar a Jovan:**
- Invitación al proyecto
- Podrás hacer deployments y ver logs

### 4. MetaMap (Opcional)
Solo si trabajarás con KYC verification

---

## Comandos Útiles

### Desarrollo
```bash
npm run dev          # Correr en modo desarrollo
npm run build        # Build de producción
npm run start        # Correr build de producción
npm run lint         # Linter
```

### Git
```bash
git status                    # Ver estado
git log --oneline -10        # Ver últimos commits
git pull origin main         # Actualizar desde remoto
git checkout -b nombre-branch # Crear branch
git branch -a                # Ver todas las branches
```

### Base de Datos (Supabase)
- SQL Editor: https://supabase.com/dashboard/project/fvqaczvjimslzupfrjrm/editor
- Scripts útiles en: `scripts/*.sql`

---

## Convenciones del Proyecto

### Commits
```
feat: Nueva funcionalidad
fix: Corrección de bug
docs: Cambios en documentación
refactor: Refactorización de código
style: Cambios de formato (sin lógica)
test: Agregar o modificar tests
chore: Tareas de mantenimiento
```

**Ejemplos:**
```bash
git commit -m "feat: Agregar filtro de búsqueda por salario"
git commit -m "fix: Corregir validación de RFC"
git commit -m "docs: Actualizar README con instrucciones"
```

### Arquitectura
- Respetar arquitectura hexagonal
- Use cases en `application/`
- Repositorios en `infrastructure/`
- NO lógica de negocio en componentes

### Iteraciones Completadas
1. ✅ KYC + Términos
2. ✅ Seguridad en vacantes
3. ✅ Vigencia de vacantes
4. ✅ Avisos de vigencia
5. ✅ OAuth Google + UX email

**Leer:** `ESTADO_PROYECTO_ITERACION_5.md` para contexto completo

---

## Troubleshooting

### Error: "Cannot find module..."
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Supabase client not initialized"
Verifica que `.env.local` existe y tiene las variables correctas

### Error: "Port 8000 already in use"
```bash
# Matar proceso en puerto 8000
npx kill-port 8000
# O cambiar puerto
npm run dev -- -p 3000
```

### Conflictos de Git
```bash
# Si hay conflictos al hacer pull
git stash                  # Guardar cambios temporalmente
git pull origin main       # Actualizar
git stash pop             # Recuperar cambios
# Resolver conflictos manualmente
```

---

## Contacto

**Jovan Hernández**
- GitHub: @jovahernandez
- Repo: https://github.com/jovahernandez/meetworklight

**Para dudas:**
1. Revisar documentación en `/docs`
2. Revisar `ESTADO_PROYECTO_ITERACION_5.md`
3. Contactar a Jovan directamente

---

## Checklist Inicial

- [ ] Aceptar invitación de GitHub
- [ ] Clonar repositorio
- [ ] Instalar dependencias (`npm install`)
- [ ] Crear `.env.local` con variables de entorno
- [ ] Correr `npm run dev` exitosamente
- [ ] Leer `ESTADO_PROYECTO_ITERACION_5.md`
- [ ] Solicitar acceso a Supabase (opcional)
- [ ] Solicitar acceso a Vercel (opcional)
- [ ] Hacer primer commit de prueba

---

¡Bienvenido al equipo! 🚀
