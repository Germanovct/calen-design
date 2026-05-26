# Calen Design E-commerce

Este es el repositorio del proyecto e-commerce para Calen Design, una tienda de ropa de diseño independiente.

## Estructura del Proyecto

El proyecto está configurado como un monorepo con las siguientes carpetas:

- `/frontend`: Aplicación cliente desarrollada en React + Vite.
- `/backend`: API de servicios y base de datos construida con FastAPI.

## Tecnologías Utilizadas

- **Frontend:** React, Vite, React Router DOM, Framer Motion, Zustand, Axios, Mercado Pago SDK.
- **Backend:** FastAPI, Supabase (PostgreSQL), Resend (Emails), JWT RS256 para autenticación.
- **Plataformas de Deploy:** Netlify (Frontend), Render (Backend).

## Primeros Pasos

### Frontend
1. Navegar a la carpeta `frontend/`:
   ```bash
   cd frontend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Backend
1. Navegar a la carpeta `backend/`:
   ```bash
   cd backend
   ```
2. Configurar el entorno virtual:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # En macOS/Linux
   ```
3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Configurar variables de entorno copiando `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
5. Ejecutar la API:
   ```bash
   uvicorn app.main:app --reload
   ```
