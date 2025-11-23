# Configuración de Google OAuth en Supabase

## Error actual
```json
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

Este error indica que Google OAuth **NO está habilitado** en Supabase.

---

## PASO 1: Crear credenciales en Google Cloud Console

1. Ve a: https://console.cloud.google.com/
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs & Services** → **Credentials**
4. Click en **Create Credentials** → **OAuth 2.0 Client ID**
5. Si es la primera vez, configura la pantalla de consentimiento:
   - **User Type**: External
   - **App name**: Meetwork
   - **User support email**: tu email
   - **Developer contact**: tu email
   - **Scopes**: Agregar `.../auth/userinfo.email` y `.../auth/userinfo.profile`
   - **Test users**: Agregar tu email de Google para pruebas

6. Crear OAuth Client ID:
   - **Application type**: Web application
   - **Name**: Meetwork Production
   - **Authorized JavaScript origins**:
     ```
     http://localhost:8000
     https://meetwork-ligh-jp8hw998x-jovanigits-projects.vercel.app
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:8000/auth/callback
     https://meetwork-ligh-jp8hw998x-jovanigits-projects.vercel.app/auth/callback
     https://fvqaczvjimslzupfrjrm.supabase.co/auth/v1/callback
     ```

7. **Guardar** y copiar:
   - ✅ Client ID
   - ✅ Client Secret

---

## PASO 2: Configurar en Supabase Dashboard

1. Ve a: https://supabase.com/dashboard/project/fvqaczvjimslzupfrjrm

2. Navega a: **Authentication** → **Providers**

3. Busca **Google** en la lista

4. **Enable Google provider**:
   - Toggle ON el switch de Google
   - Pega el **Client ID** de Google
   - Pega el **Client Secret** de Google
   - Click en **Save**

5. Verifica que aparezca como "Enabled" ✅

---

## PASO 3: Configurar Site URL (importante)

1. En Supabase Dashboard: **Authentication** → **URL Configuration**

2. Configurar:
   - **Site URL**: `https://meetwork-ligh-jp8hw998x-jovanigits-projects.vercel.app`
   - **Redirect URLs**: Agregar:
     ```
     http://localhost:8000/**
     https://meetwork-ligh-jp8hw998x-jovanigits-projects.vercel.app/**
     ```

3. **Save**

---

## PASO 4: Probar OAuth

1. Ve a: https://meetwork-ligh-jp8hw998x-jovanigits-projects.vercel.app/auth/login

2. Click en **"Continuar con Google"**

3. Deberías ver la pantalla de consentimiento de Google

4. Selecciona tu cuenta Google

5. Autoriza permisos

6. Deberías ser redirigido a `/auth/choose-role` (si es nuevo usuario)

---

## ¿Por qué solo Google y no Facebook/Instagram?

**Decisión de Iteración 5:**
- Solo implementamos **Google OAuth** como MVP
- Es el proveedor más usado y confiable
- Simplifica la configuración inicial

**Para agregar más providers en el futuro:**

### Facebook OAuth (Iteración 6 - futuro)
```tsx
const handleFacebookLogin = async () => {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};
```

### GitHub OAuth (alternativa popular)
```tsx
const handleGitHubLogin = async () => {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};
```

**Providers soportados por Supabase:**
- ✅ Google (implementado)
- ⏳ Facebook (requiere Facebook App ID)
- ⏳ GitHub (requiere GitHub OAuth App)
- ⏳ Twitter/X
- ⏳ LinkedIn
- ⏳ Azure (Microsoft)
- ⏳ Apple

---

## Logs esperados después de configurar

Cuando Google OAuth esté configurado correctamente, deberías ver en la consola del navegador:

```
[OAuth Callback] Usuario autenticado: user@gmail.com
[OAuth Callback] Usuario sin rol, redirigiendo a choose-role
```

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Verifica que los Redirect URIs en Google Console coincidan exactamente
- Debe incluir: `https://fvqaczvjimslzupfrjrm.supabase.co/auth/v1/callback`

### Error: "Access blocked: This app's request is invalid"
- Ve a Google Cloud Console → OAuth consent screen
- Asegúrate de estar en la lista de **Test users**
- O publica la app (cambiar de Testing a Production)

### Error: "Email not confirmed"
- Google OAuth confirma el email automáticamente
- No deberías ver la pantalla `/auth/check-email`
- Si aparece, revisa el middleware

---

## Siguiente paso después de configurar

Una vez configurado Google OAuth:

1. Probar registro con Google (nuevo usuario)
2. Probar login con Google (usuario existente)
3. Verificar que no pida confirmar email
4. Verificar flujo: choose-role → terms → profile → jobs

