# Próximos Pasos y Mejoras

Este documento lista las mejoras y extensiones planificadas para Meetwork Light.

## Funcionalidades Faltantes de la Versión Actual

### Autenticación (Implementación Completa)
- [ ] Crear API routes completos para `/api/auth/login`, `/api/auth/register`, `/api/auth/set-role`
- [ ] Implementar Server Actions para autenticación en Next.js 14
- [ ] Middleware de protección de rutas basado en roles
- [ ] Manejo de sesiones con cookies seguras
- [ ] Logout y refresh de tokens

### Perfiles
- [ ] Formularios de creación/edición de perfil de reclutador
- [ ] Formularios de creación/edición de perfil de buscador
- [ ] Validación de formularios con Zod o similar
- [ ] Subida de logo/avatar (integración con Supabase Storage)

### Gestión de Vacantes (Reclutador)
- [ ] Formulario completo de creación de vacante
- [ ] Edición de vacantes existentes
- [ ] Activar/desactivar vacantes
- [ ] Vista de estadísticas básicas (vistas, contactos)

### Búsqueda de Vacantes (Mejorado)
- [ ] Paginación de resultados
- [ ] Ordenamiento (fecha, relevancia, salario)
- [ ] Guardar vacantes favoritas
- [ ] Compartir vacante (link directo)

## Extensiones Futuras (Roadmap)

### Módulo de Feed Social
- [ ] Publicaciones de usuarios
- [ ] Comentarios y reacciones
- [ ] Seguir a otros usuarios/empresas
- [ ] Notificaciones de actividad

### Módulo de Academia
- [ ] Catálogo de cursos
- [ ] Inscripción y seguimiento de progreso
- [ ] Certificaciones
- [ ] Integración con proveedores de contenido

### Sistema de Aplicaciones
- [ ] Botón "Aplicar" en vacantes
- [ ] Tracking de aplicaciones para buscadores
- [ ] Gestión de candidatos para reclutadores
- [ ] Flujo de entrevistas y feedback

### Mensajería Interna
- [ ] Chat 1:1 entre reclutadores y buscadores
- [ ] Notificaciones en tiempo real
- [ ] Historial de conversaciones

### Planes Premium
- [ ] Modelo de suscripción
- [ ] Destacar vacantes
- [ ] Acceso a estadísticas avanzadas
- [ ] Integración con pasarela de pago (Stripe/MercadoPago)

## Mejoras Técnicas

### Performance
- [ ] Implementar ISR (Incremental Static Regeneration) para páginas de vacantes
- [ ] Cache de queries con React Query o SWR
- [ ] Optimización de imágenes con Next.js Image
- [ ] Lazy loading de componentes pesados

### Testing
- [ ] Aumentar cobertura de tests unitarios (objetivo: >80%)
- [ ] Tests de integración con Supabase (using test database)
- [ ] Tests E2E con Playwright
- [ ] CI/CD pipeline con GitHub Actions

### Seguridad
- [ ] Implementar rate limiting
- [ ] Sanitización de inputs
- [ ] Protección contra XSS y CSRF
- [ ] Auditoría de seguridad de dependencias

### Monitoreo
- [ ] Integración con Sentry para error tracking
- [ ] Analytics con Google Analytics o Plausible
- [ ] Logging estructurado
- [ ] Alertas de performance

### DevOps
- [ ] Dockerizar la aplicación
- [ ] Deploy automático en Vercel/Railway
- [ ] Staging environment
- [ ] Scripts de backup de base de datos

## Decisiones de Diseño Pendientes

- Definir si las aplicaciones serán públicas (visible número de aplicantes) o privadas
- Confirmar si se permitirán aplicaciones anónimas o solo con perfil completo
- Decidir modelo de monetización (freemium, comisión, suscripción)
- Evaluar integración con redes sociales (LinkedIn, Facebook) para registro/login

## Contacto y Feedback

Para sugerencias o reportar bugs, contactar a: [email del equipo]
