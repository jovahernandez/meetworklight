# Configuración de Templates de Email en Supabase

Este documento explica cómo personalizar los emails que Supabase envía automáticamente a los usuarios de Meetwork durante el proceso de autenticación.

## ¿Dónde Configurar?

1. Navega al **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecciona tu proyecto: `meetworklight` (o el proyecto correspondiente)
3. En el menú lateral, ve a: **Authentication** → **Email Templates**

## Templates Disponibles

Supabase ofrece varios templates de email. Para Meetwork, nos enfocamos en:

### 1. **Confirm Signup** (Confirmación de Registro)

Este es el email más importante. Se envía cuando un usuario se registra con email + password.

**Cuándo se envía:**
- Cuando un usuario completa el formulario de registro en `/auth/register`
- Inmediatamente después de hacer clic en "Crear Cuenta"

**Qué debe hacer el usuario:**
- Abrir el email
- Hacer clic en el enlace de confirmación
- Esto activa su cuenta y le permite iniciar sesión

**Variables disponibles:**
- `{{ .ConfirmationURL }}` - URL con token para confirmar la cuenta
- `{{ .SiteURL }}` - URL base de tu aplicación
- `{{ .Token }}` - Token de confirmación (si quieres construir URL custom)

**Template recomendado (español, branding Meetwork):**

```
Asunto: Bienvenido a Meetwork – Confirma tu cuenta

Cuerpo (HTML):

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; text-align: center;">
        <h1 style="color: #2563eb; margin-bottom: 20px;">¡Bienvenido a Meetwork!</h1>
        
        <p style="font-size: 16px; margin-bottom: 25px;">
            Estás a un paso de conectar con oportunidades laborales o encontrar el talento que necesitas.
        </p>
        
        <p style="font-size: 16px; margin-bottom: 30px;">
            Haz clic en el botón de abajo para confirmar tu correo electrónico y activar tu cuenta:
        </p>
        
        <a href="{{ .ConfirmationURL }}" 
           style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            Confirmar mi cuenta
        </a>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Si no creaste una cuenta en Meetwork, puedes ignorar este correo.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #999;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
            <span style="color: #2563eb;">{{ .ConfirmationURL }}</span>
        </p>
        
        <p style="font-size: 12px; color: #999; margin-top: 20px;">
            © 2025 Meetwork. Todos los derechos reservados.
        </p>
    </div>
</body>
</html>
```

**Template recomendado (texto plano - fallback):**

```
Bienvenido a Meetwork

Estás a un paso de conectar con oportunidades laborales o encontrar el talento que necesitas.

Haz clic en el siguiente enlace para confirmar tu correo electrónico y activar tu cuenta:

{{ .ConfirmationURL }}

Si no creaste una cuenta en Meetwork, puedes ignorar este correo.

---
© 2025 Meetwork
```

---

### 2. **Invite User** (Invitación de Usuario)

Este template se usa si decides implementar un sistema de invitaciones en el futuro.

**Cuándo se envía:**
- Cuando un admin o reclutador invita a alguien a unirse a Meetwork (funcionalidad futura)

**Variables disponibles:**
- `{{ .ConfirmationURL }}` - URL para aceptar la invitación
- `{{ .Email }}` - Email del usuario invitado
- `{{ .SiteURL }}` - URL base de tu aplicación

**Template recomendado (breve):**

```
Asunto: Has sido invitado a unirte a Meetwork

Has sido invitado a unirte a Meetwork, la plataforma que conecta talento con oportunidades.

Haz clic en el siguiente enlace para crear tu cuenta:

{{ .ConfirmationURL }}

¡Bienvenido a bordo!

---
© 2025 Meetwork
```

---

### 3. **Magic Link** (Enlace Mágico)

Este template se usa si implementas login sin contraseña (magic link).

**Cuándo se envía:**
- Cuando un usuario solicita iniciar sesión con un enlace enviado por email (funcionalidad opcional)

**Variables disponibles:**
- `{{ .ConfirmationURL }}` - URL con token de autenticación
- `{{ .Token }}` - Token de autenticación

**Template recomendado:**

```
Asunto: Tu enlace para iniciar sesión en Meetwork

Haz clic en el siguiente enlace para iniciar sesión en Meetwork:

{{ .ConfirmationURL }}

Este enlace expira en 1 hora y solo puede usarse una vez.

Si no solicitaste este enlace, ignora este correo.

---
© 2025 Meetwork
```

---

### 4. **Change Email Address** (Cambiar Correo Electrónico)

Este template se usa cuando un usuario cambia su email.

**Cuándo se envía:**
- Cuando un usuario actualiza su correo electrónico en su perfil (funcionalidad futura)

**Variables disponibles:**
- `{{ .ConfirmationURL }}` - URL para confirmar el nuevo email
- `{{ .NewEmail }}` - Nuevo email a confirmar
- `{{ .SiteURL }}` - URL base de tu aplicación

**Template recomendado:**

```
Asunto: Confirma tu nuevo correo electrónico en Meetwork

Has solicitado cambiar tu correo electrónico en Meetwork.

Nuevo correo: {{ .NewEmail }}

Haz clic en el siguiente enlace para confirmar el cambio:

{{ .ConfirmationURL }}

Si no solicitaste este cambio, contacta a soporte inmediatamente.

---
© 2025 Meetwork
```

---

## Configuración de Remitente (Sender)

Por defecto, Supabase envía emails desde `noreply@mail.app.supabase.io`. Esto funciona, pero para mejor branding:

### Opción A: Usar dominio de Supabase (temporal)
- Ya está configurado por defecto
- Aparecerá como: `noreply@mail.app.supabase.io`
- **Ventaja:** Funciona de inmediato
- **Desventaja:** No tiene tu branding

### Opción B: Configurar dominio propio (recomendado para producción)
1. Ve a: **Project Settings** → **Auth** → **SMTP Settings**
2. Configura tu propio servidor SMTP o usa un servicio como:
   - **Resend** (recomendado, fácil setup)
   - **SendGrid** (popular, plan gratis disponible)
   - **Amazon SES** (económico para gran volumen)
   - **Mailgun** (robusto, buena deliverability)

3. Ejemplo con Resend:
   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 587
   SMTP User: resend
   SMTP Password: [tu API key de Resend]
   Sender Email: noreply@meetwork.com (o tu dominio)
   Sender Name: Meetwork
   ```

4. Verifica tu dominio en el servicio SMTP (DNS records: SPF, DKIM, DMARC)

---

## Pruebas

### Cómo probar los emails:

1. **Registro con email + password:**
   - Ve a `/auth/register`
   - Regístrate con un email de prueba
   - Revisa tu bandeja de entrada
   - Verifica que el email tenga el formato correcto
   - Haz clic en el enlace de confirmación
   - Confirma que te redirige correctamente

2. **Usar emails temporales para testing:**
   - https://temp-mail.org
   - https://10minutemail.com
   - https://guerrillamail.com

3. **Revisar logs de Supabase:**
   - Dashboard → Authentication → Users
   - Verifica que el campo `email_confirmed_at` se llena después de confirmar

---

## Solución de Problemas

### Email no llega
- Revisar bandeja de spam/promociones
- Verificar que el email del usuario está bien escrito
- Comprobar logs en Supabase Dashboard → Authentication → Email Rate Limits
- Si usas SMTP propio, verificar credenciales

### Link de confirmación no funciona
- Verificar que `Site URL` en Project Settings esté correcto
- Para desarrollo: `http://localhost:3000`
- Para producción: `https://meetwork.vercel.app` (o tu dominio)

### Email llega en inglés
- Asegurarse de que cambiaste el template en el Dashboard
- Hacer clic en "Save" después de editar

---

## Notas Importantes

1. **NO** puedes cambiar los templates desde código. Solo desde el Dashboard.

2. Los cambios en templates se aplican **inmediatamente** a nuevos emails.

3. Supabase tiene **rate limits** en emails:
   - Plan gratis: ~100 emails/hora
   - Para producción, considera usar SMTP propio

4. Variables como `{{ .ConfirmationURL }}` son generadas automáticamente por Supabase.

5. El email de confirmación expira en **24 horas** por defecto.

6. Si un usuario no confirma su email, no podrá iniciar sesión (gating implementado en middleware).

---

## Checklist de Configuración

Para poner Meetwork en producción con emails personalizados:

- [ ] Cambiar template de "Confirm Signup" al recomendado en español
- [ ] Cambiar asunto a "Bienvenido a Meetwork – Confirma tu cuenta"
- [ ] Configurar SMTP propio (Resend recomendado)
- [ ] Establecer Sender Name: "Meetwork"
- [ ] Establecer Sender Email: "noreply@meetwork.com" (o tu dominio)
- [ ] Verificar dominio en servicio SMTP (SPF, DKIM, DMARC)
- [ ] Probar registro completo con email de prueba
- [ ] Confirmar que email llega en menos de 1 minuto
- [ ] Verificar que link de confirmación funciona correctamente
- [ ] Revisar visualización en diferentes clientes (Gmail, Outlook, etc.)

---

## Recursos Adicionales

- **Documentación oficial de Supabase Auth:** https://supabase.com/docs/guides/auth
- **Email Templates:** https://supabase.com/docs/guides/auth/auth-email-templates
- **SMTP Configuration:** https://supabase.com/docs/guides/auth/auth-smtp

---

**Última actualización:** Iteración 5 - Enero 2025
