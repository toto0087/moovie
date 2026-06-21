# Moovi

Agregador de streaming y **recomendación de películas/series** (Netflix, HBO Max, Disney+, etc.), con **chatbot de IA** que recomienda en base al catálogo.

## Stack

```
moovie/
├── moovi-api/    # Backend  — NestJS + TypeORM + PostgreSQL (puerto 3001, prefix /api)
└── moovi-front/  # Frontend — React + Vite (puerto 5173)
```

- **Catálogo:** datos de [TMDB](https://www.themoviedb.org/) (sincronizados a la DB).
- **Auth:** JWT (Bearer token).
- **Chatbot:** Google **Gemini** (`gemini-2.5-flash`), grounded en el catálogo de la DB.

## Features

- Catálogo de pelis/series por plataforma, tendencias, búsqueda y filtros por género.
- Registro/login con JWT, perfil y "mi lista".
- **Chatbot IA**: recomienda títulos que existen en el catálogo (endpoint `POST /api/chatbot`, protegido). La key de Gemini vive **solo en el backend**.
- **Dictado por voz** en el buscador (Web Speech API del navegador — Chrome/Edge, requiere HTTPS o localhost).

## Requisitos

- Node.js **20.19+** o 22 LTS
- **PostgreSQL** (local o gestionado)

## Variables de entorno

### Backend (`moovi-api/.env`)

| Variable | Descripción |
|---|---|
| `PORT` | Puerto (default 3001) |
| `FRONTEND_URL` | Origin del front para CORS (ej. `http://localhost:5173`) |
| `DATABASE_URL` | Connection string de Postgres (prod). Si está, ignora las `DB_*` sueltas |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | Conexión local (default puerto 5432) |
| `DB_SSL` | `true` para conexiones que exijan TLS (DB gestionada externa). Vacío en local |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Auth (ej. `7d`) |
| `TMDB_ACCESS_TOKEN` / `TMDB_COUNTRY` | TMDB (Read Access Token; país `AR`) |
| `GEMINI_API_KEY` | Key de [Google AI Studio](https://aistudio.google.com/apikey) (free tier) |

### Frontend (`moovi-front/.env`)

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL del backend **+ `/api`** (ej. `http://localhost:3001/api`) |

> Las `VITE_*` se hornean en el build: si la cambiás, hay que **rebuildear** el front.

## Levantar el proyecto (local)

### 1. Base de datos

Creá una DB Postgres y cargá el esquema:

```bash
psql "postgresql://USER:PASS@localhost:5432/moovi_db" -f moovi-api/schema.postgres.sql
```

> `create_tables.sql` es el esquema viejo de MySQL (legacy) — usar `schema.postgres.sql`.

### 2. Backend

```bash
cd moovi-api
cp .env.example .env   # completar DB, TMDB_ACCESS_TOKEN y GEMINI_API_KEY
npm install
npm run start:dev
```

API: http://localhost:3001/api

### 3. Frontend

```bash
cd moovi-front
cp .env.example .env   # setear VITE_API_URL
npm install
npm run dev
```

App: http://localhost:5173

### 4. Poblar el catálogo

Las películas se sincronizan desde TMDB (las plataformas se auto-siembran al arrancar). Necesitás un token (registrate/logueate) y después:

```bash
curl -X POST http://localhost:3001/api/sync/run \
  -H "Authorization: Bearer <TOKEN>" --max-time 600
```

Tarda unos minutos. (También se puede correr desde la colección de Postman → `Sync > Run Sync`.)

## Deploy (Render)

Todo unificado en [Render](https://render.com): **Postgres + Web Service (back) + Static Site (front)**.

1. **Postgres**: crear la DB y correr `schema.postgres.sql` (con la *External URL* vía `psql`).
2. **Backend** (Web Service): Root Directory `moovi-api`, Build `npm install && npm run build`, Start `npm run start:prod`. Env vars: `DATABASE_URL` (Internal URL), `FRONTEND_URL`, `JWT_SECRET`, `TMDB_ACCESS_TOKEN`, `TMDB_COUNTRY`, `GEMINI_API_KEY`. No setear `NODE_ENV=production` (rompe el build de Nest).
3. **Frontend** (Static Site): Root Directory `moovi-front`, Build `npm install && npm run build`, Publish Directory `dist`. Env var: `VITE_API_URL` = URL del back + `/api`. El ruteo SPA lo maneja `moovi-front/public/_redirects`.
4. Poblar el catálogo con `POST /api/sync/run` (ver arriba).

## API / Postman

Importá `moovi.postman_collection.json` en Postman, seteá la variable `baseUrl` (`https://<back>/api` o `http://localhost:3001/api`) y corré `Auth > Login` (el token se guarda solo). Incluye todos los endpoints (auth, movies, platforms, users, chatbot, sync).

## Notas

- **No correr `npm audit fix --force`** en `moovi-api`: degrada NestJS a v7 y rompe el build. Las vulnerabilidades reportadas son de dependencias de test y no afectan producción.
- El backend usa `synchronize: false` (no auto-migra): los cambios de esquema se aplican a mano con `schema.postgres.sql`.
