# Meetwork Light

Plataforma de vacantes y búsqueda de empleo enfocada al sector industrial en México.

## Descripción

Meetwork Light es una aplicación web monolítica construida con arquitectura hexagonal que conecta talento industrial con oportunidades laborales reales. Esta versión incluye únicamente el módulo de vacantes y búsqueda de empleo.

## Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilo**: TailwindCSS
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Testing**: Vitest + React Testing Library

## Arquitectura

El proyecto sigue el patrón de **Arquitectura Hexagonal** (Ports & Adapters):

```
src/
├── domain/          # Entidades y lógica de negocio pura
├── application/     # Casos de uso (orquestación)
├── ports/           # Interfaces (contratos)
├── infrastructure/  # Adaptadores (Supabase, etc.)
├── app/             # Next.js App Router (presentación)
├── components/      # Componentes React reutilizables
└── lib/             # Utilidades y constantes
```

## Prerequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase (gratuita)

## Instalación

### 1. Clonar el repositorio

```bash
cd "meetwork ligh"
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
copy .env.example .env.local
```

Edita `.env.local` y configura tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:8000
```

### 4. Configurar la base de datos

1. Ve a tu proyecto de Supabase
2. Abre el SQL Editor
3. Ejecuta el script de migración ubicado en:
   ```
   src/infrastructure/migrations/001_initial_schema.sql
   ```

Este script creará todas las tablas necesarias (users, recruiter_profiles, job_seeker_profiles, job_postings, industry_sectors) con sus índices y políticas RLS.

## Ejecución en Desarrollo

### Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:8000**

### Otros comandos útiles

```bash
# Build para producción
npm run build

# Ejecutar en modo producción
npm start

# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Linter
npm run lint
```

## Estructura de Funcionalidades

### Para Buscadores de Empleo

1. Registro y creación de perfil
2. Exploración de vacantes con filtros:
   - Búsqueda por texto
   - Ubicación
   - Sector industrial
   - Área de trabajo
   - Tipo de contrato
   - Modalidad (presencial/híbrido/remoto)
3. Visualización de vacantes en formato de tarjetas con información de contacto

### Para Reclutadores

1. Registro y creación de perfil de empresa
2. Panel de gestión
3. Publicación de vacantes
4. Listado de vacantes propias

## Modelos de Datos Principales

### User
- id, email, role (recruiter | seeker), created_at

### RecruiterProfile
- company_name, contact_name, phone, email_contact, location, industrial_sector, website

### JobSeekerProfile
- full_name, main_role, years_experience, preferred_sectors, location, open_to_relocation

### JobPosting
- title, company_name, location, industrial_sector, job_area
- contract_type, modality, shift, salary_range
- description_short, description_long
- contact_phone, contact_email, is_active

## Testing

Los tests unitarios están ubicados en `tests/unit/`:

```bash
# Ejecutar todos los tests
npm test

# Tests con UI interactiva
npm run test:ui
```

## Roadmap Futuro

- [ ] Feed social para networking
- [ ] Academia con cursos y certificaciones
- [ ] Mensajería interna
- [ ] Sistema de aplicaciones avanzado
- [ ] Planes premium

## Contribución

Este es un proyecto de demostración. Para contribuciones, por favor abre un issue primero para discutir los cambios propuestos.

## Licencia

Privado - Uso interno de Meetwork
