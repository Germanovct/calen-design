# CALEN DESIGN — E-commerce Progress

**Cliente:** Cande (Calen Design)  
**Agencia:** DTS&Dog Studio  
**Stack:** React + Vite · FastAPI · Supabase · Netlify (frontend) · Render (backend)  
**Repo:** (pendiente crear en GitHub: `Germanovct/calen-design`)  
**Tienda actual:** https://calendesign.mitiendanube.com  
**Dominio objetivo:** (pendiente definir con Cande)

---

## Estado general

| Módulo | Estado |
|---|---|
| Setup inicial | ⬜ Pendiente |
| Base de datos | ⬜ Pendiente |
| Backend API | ⬜ Pendiente |
| Frontend — Tienda | ⬜ Pendiente |
| Panel Admin | ⬜ Pendiente |
| Mercado Pago | ⬜ Pendiente |
| Envíos | ⬜ Pendiente |
| Emails transaccionales | ⬜ Pendiente |
| Migración de productos | ⬜ Pendiente |
| Deploy producción | ⬜ Pendiente |

---

## Fase 1 — Setup inicial

- [ ] Crear repo `Germanovct/calen-design` en GitHub (privado)
- [ ] Crear proyecto React + Vite
- [ ] Crear proyecto FastAPI
- [ ] Crear proyecto en Supabase
- [ ] Crear DESIGN.md con branding (colores, tipografías, estética)
- [ ] Crear SECURITY.md
- [ ] Configurar Netlify (frontend) con `netlify.toml` + security headers
- [ ] Configurar Render (backend)
- [ ] Configurar variables de entorno (.env)
- [ ] Definir dominio y DNS con Cande

---

## Fase 2 — Base de datos (Supabase)

### Tablas principales

- [ ] `products` — id, name, description, category, price, images[], active
- [ ] `variants` — id, product_id, size, color, stock
- [ ] `categories` — id, name, slug (remeras, buzos, vestidos, lencería, abrigos)
- [ ] `orders` — id, user_id, status, total, shipping_address, created_at
- [ ] `order_items` — id, order_id, variant_id, quantity, unit_price
- [ ] `users` — id, email, name, phone, address (Supabase Auth)
- [ ] `shipping_labels` — id, order_id, carrier, tracking_number, label_url

### Políticas RLS

- [ ] Clientes solo ven sus propias órdenes
- [ ] Productos y variantes son públicos (read)
- [ ] Admin tiene acceso total (rol admin)

---

## Fase 3 — Backend API (FastAPI)

### Productos
- [ ] `GET /products` — listado con filtros (categoría, talle, color)
- [ ] `GET /products/{id}` — detalle de producto + variantes
- [ ] `POST /products` — crear producto (admin)
- [ ] `PUT /products/{id}` — editar producto (admin)
- [ ] `DELETE /products/{id}` — eliminar producto (admin)
- [ ] `POST /products/{id}/images` — subir imágenes a Supabase Storage

### Variantes y stock
- [ ] `GET /products/{id}/variants` — variantes disponibles
- [ ] `POST /products/{id}/variants` — crear variante (admin)
- [ ] `PUT /variants/{id}` — editar stock/variante (admin)

### Órdenes
- [ ] `POST /orders` — crear orden (checkout)
- [ ] `GET /orders` — listado de órdenes (admin)
- [ ] `GET /orders/{id}` — detalle de orden
- [ ] `PUT /orders/{id}/status` — cambiar estado (admin)
- [ ] `GET /users/me/orders` — mis pedidos (cliente)

### Auth
- [ ] `POST /auth/register` — registro cliente
- [ ] `POST /auth/login` — login cliente
- [ ] JWT con RS256 (mismo patrón TCQ)

---

## Fase 4 — Frontend Tienda (React)

### Páginas
- [ ] `/` — Home: hero, destacados, categorías
- [ ] `/productos` — Catálogo con filtros
- [ ] `/productos/:slug` — Página de producto
- [ ] `/carrito` — Carrito de compras
- [ ] `/checkout` — Checkout (datos + envío + pago)
- [ ] `/mi-cuenta` — Login / Registro
- [ ] `/mi-cuenta/pedidos` — Mis pedidos
- [ ] `/mi-cuenta/pedidos/:id` — Detalle de pedido

### Componentes clave
- [ ] Navbar con carrito flotante
- [ ] ProductCard con hover, variantes y talle
- [ ] Filtros de categoría, talle y color
- [ ] Selector de variantes en página de producto
- [ ] Carrito lateral (drawer)
- [ ] Stepper de checkout (datos → envío → pago)
- [ ] Botón WhatsApp flotante

### UX / Diseño
- [ ] Definir paleta con Cande (tipografía, colores, estética — femenino/minimalista)
- [ ] Mobile first
- [ ] Animaciones con Framer Motion

---

## Fase 5 — Panel Admin

### Acceso
- [ ] Ruta `/admin` protegida por rol admin
- [ ] Login separado o mismo sistema con rol

### Secciones
- [ ] Dashboard — resumen de ventas, pedidos pendientes, stock bajo
- [ ] Productos — listado, crear, editar, eliminar, subir fotos
- [ ] Variantes — gestión de talles, colores y stock por producto
- [ ] Pedidos — listado con filtros por estado, ver detalle, cambiar estado
- [ ] Envíos — generar etiqueta, cargar tracking
- [ ] Clientes — listado de usuarios registrados

---

## Fase 6 — Mercado Pago

- [ ] Crear aplicación en MP Developers
- [ ] Integrar Checkout Pro (mismo patrón TCQ Wallet)
- [ ] Webhook para recibir notificaciones de pago
- [ ] Actualizar estado de orden al recibir pago confirmado
- [ ] Manejo de estados: pending → approved / rejected / refunded

---

## Fase 7 — Envíos

- [ ] Evaluar Correo Argentino API vs Andreani API vs OCA
- [ ] Integrar cotización de envío en checkout (según código postal destino)
- [ ] Generar etiqueta de envío desde panel admin
- [ ] Cargar número de tracking en la orden
- [ ] Mostrar tracking al cliente en "mis pedidos"

---

## Fase 8 — Emails transaccionales

Proveedor: **Resend** (mismo patrón DTS&Dog)

- [ ] Confirmación de compra (orden creada)
- [ ] Pago aprobado
- [ ] Orden en preparación
- [ ] Orden despachada (con número de tracking)
- [ ] Orden entregada
- [ ] Templates HTML con branding Calen Design

---

## Fase 9 — Migración de productos

- [ ] Exportar catálogo actual de Tienda Nube (CSV)
- [ ] Mapear campos al schema de Supabase
- [ ] Script de migración para cargar productos + variantes
- [ ] Migrar imágenes a Supabase Storage
- [ ] Revisar precios y stock con Cande antes de publicar

---

## Fase 10 — Deploy producción

- [ ] Variables de entorno en Netlify y Render
- [ ] Dominio custom en Netlify
- [ ] SSL activo
- [ ] Security headers en `netlify.toml`
- [ ] Smoke test completo (compra end-to-end)
- [ ] Dar de baja Tienda Nube (cuando Cande confirme)
- [ ] Pendientes para cuando se compre el dominio `calendesign.com.ar`:
  - [ ] Configurar EMAIL_FROM=hola@calendesign.com.ar en Render
  - [ ] Crear cuenta en resend.com y cargar RESEND_API_KEY en Render
  - [ ] Generar par RSA y cargar JWT_PRIVATE_KEY / JWT_PUBLIC_KEY en Render
  - [ ] Configurar webhook MP en developers.mercadopago.com apuntando a https://calen-design.onrender.com/webhooks/mp
  - [ ] Apuntar dominio calendesign.com.ar a Netlify
  - [ ] Cambiar VITE_API_URL si el backend cambia de dominio
  - [ ] Activar credenciales de producción MP (reemplazar sandbox por producción)

---

## Fase 11 — Envíos express AMBA con Uber Direct (futuro)

- [ ] Registrarse como partner en developer.uber.com → Uber Direct API
- [ ] Integrar cotización de envío express same-day solo para CABA y GBA
- [ ] En el checkout: mostrar opción "Envío Express AMBA - Hoy" con precio dinámico calculado por distancia via Uber Direct
- [ ] Agregar margen sobre el costo de Uber Direct
- [ ] Restricción: solo disponible para códigos postales de CABA y GBA
- [ ] Peso mínimo del paquete: 2kg (verificar con Cande embalaje)
- [ ] Pendiente: aprobación de acceso a Uber Direct API

---


## Categorías actuales (Tienda Nube)

| Categoría | Slug |
|---|---|
| Remeras | remeras |
| Buzos | buzos |
| Vestidos | vestidos |
| Lencería | lenceria |
| Abrigos | abrigos |

---

## Decisiones pendientes con Cande

- [ ] Nombre de dominio
- [ ] Paleta de colores y estética del sitio
- [ ] Transportista preferido para envíos
- [ ] ¿Quiere que los clientes puedan registrarse o solo guest checkout?
- [ ] ¿Maneja cuotas / financiación con MP?

---

## Notas técnicas

- Mismo patrón de seguridad que TCQ: JWT RS256, httpOnly cookies, HMAC webhooks MP
- Imágenes hosteadas en Supabase Storage (bucket `calen-products`)
- Resend para emails (dominio de DTS&Dog o dominio propio de Cande)
- Panel admin en `/admin` — misma repo, rutas protegidas por rol
