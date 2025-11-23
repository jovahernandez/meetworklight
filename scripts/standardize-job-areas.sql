-- Script para estandarizar áreas de trabajo a singular
-- Actualiza todas las vacantes existentes para usar nombres en singular

UPDATE job_postings
SET job_area = 'Ayudante general'
WHERE job_area = 'Ayudantes generales';

UPDATE job_postings
SET job_area = 'Cabo'
WHERE job_area = 'Cabos';

UPDATE job_postings
SET job_area = 'Sobrestante'
WHERE job_area = 'Sobrestantes';

UPDATE job_postings
SET job_area = 'Ingeniero'
WHERE job_area = 'Ingenieros';

UPDATE job_postings
SET job_area = 'Técnico'
WHERE job_area = 'Técnicos';

UPDATE job_postings
SET job_area = 'Supervisor de Seguridad'
WHERE job_area = 'Supervisores de Seguridad';

UPDATE job_postings
SET job_area = 'Auxiliar de seguridad'
WHERE job_area = 'Auxiliares de seguridad';

UPDATE job_postings
SET job_area = 'Paramédico'
WHERE job_area = 'Paramédicos';

UPDATE job_postings
SET job_area = 'Asesor'
WHERE job_area = 'Asesores';

UPDATE job_postings
SET job_area = 'Auditor'
WHERE job_area = 'Auditores';

UPDATE job_postings
SET job_area = 'Ingeniero ambiental'
WHERE job_area = 'Ingenieros ambientales';

UPDATE job_postings
SET job_area = 'Biólogo'
WHERE job_area = 'Biólogos';

UPDATE job_postings
SET job_area = 'Gerente'
WHERE job_area = 'Gerentes';

-- Verificar que todas las áreas estén estandarizadas
SELECT DISTINCT job_area 
FROM job_postings 
ORDER BY job_area;
