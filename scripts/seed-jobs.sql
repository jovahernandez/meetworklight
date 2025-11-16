-- Script para agregar vacantes de prueba en Meetwork Light
-- Ejecutar en Supabase SQL Editor después de tener al menos un perfil de reclutador creado

-- Nota: Reemplaza 'TU_USER_ID_AQUI' con el ID de tu usuario reclutador
-- Puedes obtenerlo ejecutando: SELECT id FROM auth.users WHERE email = 'tu-email@ejemplo.com';

-- Primero, obtén el recruiter_profile_id ejecutando:
-- SELECT id FROM recruiter_profiles WHERE user_id = 'TU_USER_ID_AQUI';

-- Insertar vacantes de prueba
INSERT INTO job_postings (
    recruiter_profile_id,
    title,
    company_name,
    location,
    industrial_sector,
    job_area,
    contract_type,
    modality,
    salary_range,
    shift,
    description_short,
    description_long,
    contact_phone,
    contact_email,
    status
) VALUES
-- Vacante 1: Operador de Maquinaria
(
    (SELECT id FROM recruiter_profiles LIMIT 1), -- Toma el primer perfil de reclutador
    'Operador de Maquinaria Industrial',
    'Industrias del Norte SA',
    'Monterrey, Nuevo León',
    'Manufactura',
    'Operaciones',
    'Tiempo Completo',
    'Presencial',
    '$12,000 - $15,000 MXN',
    'Diurno',
    'Buscamos operador de maquinaria con experiencia en el sector manufacturero para turno diurno.',
    'Responsabilidades:
- Operar maquinaria CNC y equipos de producción
- Realizar mantenimiento preventivo básico
- Cumplir con estándares de seguridad y calidad
- Reportar anomalías al supervisor

Requisitos:
- Experiencia mínima de 2 años en operación de maquinaria
- Conocimientos básicos de mecánica
- Secundaria terminada
- Disponibilidad para trabajar turnos rotativos

Ofrecemos:
- Prestaciones de ley
- Seguro de vida
- Vales de despensa
- Capacitación continua',
    '+52 81 1234 5678',
    'reclutamiento@industriasnorte.com',
    'active'
),

-- Vacante 2: Soldador
(
    (SELECT id FROM recruiter_profiles LIMIT 1),
    'Soldador Especializado',
    'Construcciones Metálicas del Bajío',
    'León, Guanajuato',
    'Construcción',
    'Producción',
    'Tiempo Completo',
    'Presencial',
    '$14,000 - $18,000 MXN',
    'Diurno',
    'Soldador con certificación en MIG/TIG para proyectos de construcción metálica.',
    'Descripción del puesto:
Buscamos soldador certificado para unirse a nuestro equipo de construcción de estructuras metálicas industriales.

Responsabilidades:
- Soldadura MIG, TIG y arco eléctrico
- Lectura e interpretación de planos
- Inspección de calidad de soldaduras
- Cumplimiento de normas de seguridad

Requisitos:
- Certificación AWS o equivalente
- 3+ años de experiencia en soldadura industrial
- Conocimiento en diferentes tipos de metales
- Capacidad para trabajar en alturas

Beneficios:
- Sueldo competitivo
- Prestaciones superiores a la ley
- Equipo de protección de primera calidad
- Oportunidad de crecimiento',
    '+52 477 234 5678',
    'rh@metalicasbajio.com',
    'active'
),

-- Vacante 3: Técnico de Mantenimiento
(
    (SELECT id FROM recruiter_profiles LIMIT 1),
    'Técnico de Mantenimiento Eléctrico',
    'Planta Industrial AutoParts',
    'Saltillo, Coahuila',
    'Automotriz',
    'Mantenimiento',
    'Tiempo Completo',
    'Presencial',
    '$15,000 - $20,000 MXN',
    'Mixto',
    'Técnico electricista para mantenimiento preventivo y correctivo en planta automotriz.',
    'Acerca del puesto:
Empresa líder en manufactura de autopartes busca técnico electricista para realizar mantenimiento de equipos e instalaciones eléctricas.

Funciones principales:
- Mantenimiento preventivo y correctivo de equipos eléctricos
- Diagnóstico y reparación de fallas eléctricas
- Instalación de sistemas eléctricos industriales
- Programación básica de PLCs
- Documentación de actividades de mantenimiento

Requisitos:
- Carrera técnica en electricidad o electromecánica
- Experiencia mínima de 3 años en sector automotriz
- Conocimientos en PLCs (Siemens, Allen Bradley)
- Disponibilidad para turnos rotativos
- Inglés básico (deseable)

Ofrecemos:
- Excelente clima laboral
- Prestaciones superiores
- Capacitación constante
- Oportunidad de desarrollo profesional
- Fondo de ahorro',
    '+52 844 345 6789',
    'empleos@autoparts.com.mx',
    'active'
),

-- Vacante 4: Supervisor de Producción
(
    (SELECT id FROM recruiter_profiles LIMIT 1),
    'Supervisor de Producción',
    'Alimentos Procesados del Norte',
    'Querétaro, Querétaro',
    'Alimentaria',
    'Supervisión',
    'Tiempo Completo',
    'Presencial',
    '$18,000 - $22,000 MXN',
    'Nocturno',
    'Supervisor de línea de producción para turno nocturno en planta de alimentos.',
    'Perfil del puesto:
Empresa líder en la industria alimentaria busca supervisor de producción con experiencia en manufactura de alimentos procesados.

Responsabilidades:
- Supervisar personal operativo (15-20 personas)
- Garantizar cumplimiento de objetivos de producción
- Asegurar calidad y seguridad alimentaria
- Realizar reportes de producción y KPIs
- Implementar mejoras continuas
- Coordinar con otras áreas (calidad, mantenimiento, almacén)

Requisitos:
- Ingeniería industrial o afín
- 2+ años como supervisor en industria alimentaria
- Conocimiento en BPM y HACCP
- Manejo de personal y resolución de conflictos
- Disponibilidad para turno nocturno
- Paquetería Office intermedio

Beneficios:
- Prestaciones de ley y superiores
- Seguro de gastos médicos mayores
- Comedor subsidiado
- Transporte de personal
- Bonos por productividad',
    '+52 442 456 7890',
    'recursos.humanos@alimentosnorte.mx',
    'active'
),

-- Vacante 5: Almacenista
(
    (SELECT id FROM recruiter_profiles LIMIT 1),
    'Almacenista con Licencia de Montacargas',
    'Logística Integral SA de CV',
    'Guadalajara, Jalisco',
    'Logística y Transporte',
    'Almacén',
    'Tiempo Completo',
    'Presencial',
    '$11,000 - $13,000 MXN',
    'Diurno',
    'Almacenista con licencia vigente para operación de montacargas y experiencia en inventarios.',
    'Descripción:
Centro de distribución busca almacenista para gestión de inventarios y operación de montacargas.

Actividades:
- Recepción y verificación de mercancía
- Almacenamiento y acomodo de productos
- Preparación de pedidos (picking)
- Operación de montacargas y patín hidráulico
- Control de inventarios en sistema WMS
- Carga y descarga de unidades

Requisitos:
- Secundaria o preparatoria
- Licencia de montacargas vigente
- 1+ año de experiencia en almacén
- Conocimientos básicos de computación
- Disponibilidad de horario

Ofrecemos:
- Sueldo base + bonos
- Prestaciones de ley
- Uniforme
- Comedor
- Estabilidad laboral',
    '+52 33 3567 8901',
    'contrataciones@logintegral.com',
    'active'
),

-- Vacante 6: Operador de Grúa
(
    (SELECT id FROM recruiter_profiles LIMIT 1),
    'Operador de Grúa Torre',
    'Constructora Edificios Modernos',
    'Ciudad de México',
    'Construcción',
    'Operaciones',
    'Por Proyecto',
    'Presencial',
    '$16,000 - $20,000 MXN',
    'Diurno',
    'Operador certificado de grúa torre para proyecto de construcción de edificio residencial.',
    'Sobre el proyecto:
Constructora con 25 años de experiencia busca operador de grúa torre para proyecto de 18 meses.

Responsabilidades:
- Operación segura de grúa torre
- Maniobras de carga y descarga de materiales
- Inspección diaria del equipo
- Comunicación efectiva con señaleros
- Cumplimiento estricto de protocolos de seguridad

Requisitos indispensables:
- Certificación vigente para operación de grúa torre
- Experiencia mínima de 3 años
- Conocimiento de normatividad de seguridad en alturas
- Examen médico aprobado
- Disponibilidad inmediata

Ofrecemos:
- Contrato por proyecto (18 meses)
- Sueldo competitivo
- Prestaciones de ley
- Seguro de vida
- Equipo de protección personal
- Posibilidad de contratación en futuros proyectos',
    '+52 55 5678 9012',
    'rh@edificiosmodernos.com',
    'active'
),

-- Vacante 7: Técnico de Calidad
(
    (SELECT id FROM recruiter_profiles LIMIT 1),
    'Técnico de Control de Calidad',
    'Laboratorios Químicos del Pacífico',
    'Mérida, Yucatán',
    'Química y Farmacéutica',
    'Calidad',
    'Tiempo Completo',
    'Presencial',
    '$13,000 - $16,000 MXN',
    'Diurno',
    'Técnico de laboratorio para control de calidad en productos químicos industriales.',
    'Descripción del puesto:
Laboratorio químico busca técnico para realizar análisis de control de calidad de productos químicos.

Funciones:
- Realizar análisis físicos y químicos de materias primas y productos terminados
- Operar equipos de laboratorio (espectrofotómetro, pH metro, etc.)
- Documentar resultados en bitácoras y sistema SAP
- Preparar soluciones y reactivos
- Calibración de equipos
- Cumplir con normas de seguridad y buenas prácticas de laboratorio

Requisitos:
- Carrera técnica en química o QFB trunca
- 1+ año de experiencia en laboratorio industrial
- Conocimientos en análisis químicos básicos
- Manejo de paquetería Office
- Atención al detalle

Beneficios:
- Prestaciones de ley
- Capacitación continua
- Ambiente de trabajo seguro
- Oportunidad de crecimiento
- Descuentos en productos de la empresa',
    '+52 999 789 0123',
    'talento@labpacifico.com.mx',
    'active'
),

-- Vacante 8: Mecánico Industrial
(
    (SELECT id FROM recruiter_profiles LIMIT 1),
    'Mecánico Industrial Diesel',
    'Transportes y Maquinaria Pesada',
    'Hermosillo, Sonora',
    'Minería',
    'Mantenimiento',
    'Tiempo Completo',
    'Presencial',
    '$17,000 - $22,000 MXN',
    'Diurno',
    'Mecánico especializado en motores diesel y maquinaria pesada para sector minero.',
    'Acerca de la vacante:
Empresa de servicios para minería busca mecánico industrial especializado en mantenimiento de maquinaria pesada.

Responsabilidades principales:
- Diagnóstico y reparación de motores diesel
- Mantenimiento preventivo y correctivo de maquinaria pesada
- Reparación de sistemas hidráulicos y neumáticos
- Cambio de componentes y refacciones
- Documentación de servicios realizados

Requisitos:
- Carrera técnica en mecánica industrial o diesel
- 3+ años de experiencia con maquinaria pesada (excavadoras, cargadores, camiones mineros)
- Conocimientos en sistemas hidráulicos y eléctricos
- Capacidad para diagnóstico de fallas
- Disponibilidad para trabajar en campo

Ofrecemos:
- Sueldo muy competitivo
- Prestaciones superiores a la ley
- Transporte de personal
- Comedor
- Herramientas y equipo de trabajo
- Seguro de gastos médicos mayores
- Plan de carrera',
    '+52 662 890 1234',
    'empleos@maquinariapesada.mx',
    'active'
);

-- Verificar que las vacantes se insertaron correctamente
SELECT 
    id,
    title,
    company_name,
    location,
    salary_range,
    status,
    created_at
FROM job_postings
ORDER BY created_at DESC;
