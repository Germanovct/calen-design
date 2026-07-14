# Guía de Despliegue en Producción — Calen Design

Esta guía detalla los pasos y variables requeridos para desplegar el frontend en Netlify y el backend en Render, así como las integraciones en producción de Mercado Pago, Resend, Correo Argentino y la generación de firmas JWT RS256.

---

## 💻 Frontend (Netlify)

### 1. Configuración del Sitio
* **Build Command**: `npm run build`
* **Publish Directory**: `dist`
* **Redirects**: Crear un archivo `public/_redirects` (o configurar `netlify.toml`) para direccionar todas las rutas de la Single Page Application (SPA) al archivo `index.html`:
  ```text
  /*    /index.html   200
  ```

### 2. Variables de Entorno (Netlify UI)
* `VITE_API_URL`: La URL del backend corriendo en Render (ej. `https://calen-backend.onrender.com/api`).

---

## ⚙️ Backend (Render)

### 1. Configuración del Servicio web
* **Environment**: `Python`
* **Build Command**: `pip install -r requirements.txt` (o el script de instalación correspondiente)
* **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 2. Variables de Entorno (Render UI)

| Variable | Descripción / Valor de Producción |
|---|---|
| `SUPABASE_URL` | URL de tu proyecto en Supabase. |
| `SUPABASE_KEY` | Anon Key de Supabase. |
| `SUPABASE_SECRET_KEY` | Service Role Secret Key de Supabase (necesaria para evadir RLS en el panel admin y scripts de migración). |
| `JWT_PRIVATE_KEY` | Clave privada RSA256 (en una sola línea, reemplazando saltos de línea con `\n`). |
| `JWT_PUBLIC_KEY` | Clave pública RSA256 (en una sola línea, reemplazando saltos de línea con `\n`). |
| `MP_ACCESS_TOKEN` | Token de acceso de producción de Mercado Pago (empieza con `APP_USR-`). |
| `MP_WEBHOOK_SECRET` | Client Secret / Webhook Secret de tu aplicación de Mercado Pago para firma HMAC. |
| `RESEND_API_KEY` | API Key de producción de Resend. |
| `EMAIL_FROM` | Dirección de email verificada en tu cuenta de Resend (ej. `Calen Design <hola@calendesign.com.ar>`). |
| `CORREO_ARGENTINO_URL` | URL de la API de producción de Correo Argentino (ej. `https://api.correoargentino.com.ar/micorreo/v1`). |
| `CORREO_ARGENTINO_USER` | Usuario de producción de Correo Argentino. |
| `CORREO_ARGENTINO_PASSWORD` | Contraseña de producción de Correo Argentino. |
| `CORREO_ARGENTINO_CUSTOMER_ID` | ID de cliente provisto por Correo Argentino. |
| `CP_ORIGEN` | Código postal del depósito/despacho (ej. `1000`). |

---

## 🔑 Generación de Par de Claves RSA256 (JWT)

Para mayor seguridad en la autenticación de usuarios, el sistema utiliza firmas asimétricas RS256. Podés generar el par de llaves en tu terminal local con:

```bash
# 1. Generar la clave privada
openssl genrsa -out private.pem 2048

# 2. Generar la clave pública a partir de la privada
openssl rsa -in private.pem -pubout -out public.pem
```

#### Cómo configurarlas en Render:
Copia el contenido del archivo reemplazando los saltos de línea reales por el literal `\n`, de modo que queden en una sola línea. Ejemplo:
`-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0...\n-----END RSA PRIVATE KEY-----`

---

## 💳 Configuración de Mercado Pago Webhook (Producción)

1. Ingresá a [Mercado Pago Developers](https://developers.mercadopago.com/).
2. Ve a **Tus integraciones** y selecciona tu aplicación de producción.
3. Ve a la sección de **Webhooks** en el menú lateral.
4. En **URL de producción**, configura la siguiente ruta:
   `https://tu-backend-render.com/api/orders/webhooks/mp`
5. Marca los siguientes eventos para recibir notificaciones de transacciones:
   - [x] `payment`
6. Guarda la configuración. Copia la clave secreta generada en la interfaz y cárgala como `MP_WEBHOOK_SECRET` en las variables de entorno de Render para habilitar la validación automática de firmas HMAC.

---

## ✉️ Configuración de Dominio de Resend

1. Registrate en [Resend](https://resend.com/).
2. Ve a **Domains** -> **Add Domain**.
3. Carga tu dominio `calendesign.com.ar`.
4. Añadí los registros DNS provistos por Resend (DKIM y SPF) en el panel de tu proveedor de dominio (ej. Nic.ar o Cloudflare) para validar la identidad de envío.
5. Una vez verificado el dominio, actualizá `EMAIL_FROM` en Render para poder enviar notificaciones desde tu propio dominio.

---

## 🌐 Configuración de Dominio Custom en Netlify

1. En el panel de Netlify, ve a **Domain management** -> **Add custom domain**.
2. Escribe `calendesign.com.ar`.
3. Apunta los Name Servers (NS) de tu proveedor de dominio hacia los servidores de Netlify, o configura un registro CNAME apuntando al subdominio `.netlify.app` de tu proyecto.
4. Habilita el certificado de SSL provisto de forma gratuita por Let's Encrypt desde la misma interfaz de administración de Netlify.
