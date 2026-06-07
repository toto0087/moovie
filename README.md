# Moovi — Streaming Aggregator

> Encontrá en segundos qué ver y **dónde verlo** entre Netflix, HBO Max y Disney+.

Moovi es una app mobile-first que agrega el catálogo de las tres plataformas principales de streaming, muestra tendencias en tiempo real (datos de TMDB/JustWatch) y permite al usuario guardar su lista personalizada con persistencia en backend.

---

## Índice

- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Base de datos](#base-de-datos)
- [API Reference](#api-reference)
- [Configuración de entorno](#configuración-de-entorno)
- [Cómo levantar el proyecto (paso a paso)](#cómo-levantar-el-proyecto-paso-a-paso)
- [Sincronización del catálogo con TMDB](#sincronización-del-catálogo-con-tmdb)
- [Flujo de autenticación](#flujo-de-autenticación)
- [Funcionalidades implementadas](#funcionalidades-implementadas)
- [Notas sobre JustWatch](#notas-sobre-justwatch)

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite 6, React Router v7, CSS Modules |
| Backend | NestJS 10 + TypeScript |
| Base de datos | MySQL 8.x |
| ORM | TypeORM |
| Autenticación | JWT (passport-jwt) + bcrypt |
| HTTP client | Axios (frontend) + @nestjs/axios (backend) |
| Datos de catálogo | [TMDB API](https://www.themoviedb.org/documentation/api) (gratuita) |

---

## Arquitectura

```
seminario/
├── MooviProject/      # Frontend React 19 + Vite (SPA mobile-first)
└── moovi-api/         # Backend NestJS (REST API)
```

El frontend consume el backend vía `http://localhost:3001/api`. Los datos de películas y series se obtienen de la API gratuita de TMDB (que internamente usa datos de JustWatch para streaming availability).

```
Browser ──► React SPA (port 5173)
                │
                ▼ HTTP/JSON
           NestJS API (port 3001)
                │         │
                ▼         ▼
            MySQL      TMDB API
           (moovi_db)  (sync only)
```

---

## Estructura de carpetas

### Backend (`moovi-api/`)

```
moovi-api/
├── src/
│   ├── main.ts                    # Bootstrap: CORS, global prefix /api, ValidationPipe
│   ├── app.module.ts              # Root module: TypeORM, ConfigModule, todos los módulos
│   │
│   ├── auth/                      # Autenticación JWT
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts     # POST /register, POST /login, GET /me
│   │   ├── auth.service.ts        # bcrypt hash/compare, JWT sign
│   │   ├── jwt.strategy.ts        # Passport JWT strategy
│   │   ├── jwt-auth.guard.ts      # Guard reutilizable
│   │   └── dto/
│   │       ├── register.dto.ts    # email, password (min 6), name, country?
│   │       └── login.dto.ts       # email, password
│   │
│   ├── movies/                    # Catálogo de películas/series (público)
│   │   ├── movies.module.ts
│   │   ├── movies.controller.ts   # GET /movies, /trending, /search, /platform/:slug, /:id
│   │   ├── movies.service.ts      # findAll (tabs), findTrending, search (FULLTEXT), findByPlatform
│   │   ├── movie.entity.ts        # Entidad TypeORM
│   │   └── dto/
│   │       └── movies-query.dto.ts # page, limit, tab (novedades|recientes|populares)
│   │
│   ├── users/                     # Perfil + Mi Lista (requiere JWT)
│   │   ├── users.module.ts
│   │   ├── users.controller.ts    # GET/PUT /me, GET/POST/DELETE /me/list/:movieId
│   │   ├── users.service.ts       # CRUD perfil, Mi Lista con INSERT IGNORE / DELETE
│   │   ├── user.entity.ts         # Entidad TypeORM
│   │   └── dto/
│   │       └── update-profile.dto.ts
│   │
│   ├── platforms/                 # Metadata de plataformas (público)
│   │   ├── platforms.module.ts
│   │   ├── platforms.controller.ts # GET /platforms
│   │   ├── platforms.service.ts
│   │   └── platform.entity.ts
│   │
│   └── sync/                      # Sincronización con TMDB
│       ├── sync.module.ts
│       ├── sync.controller.ts     # POST /sync/run (requiere JWT)
│       ├── sync.service.ts        # Orquesta el batch: fetch → filter → upsert
│       └── tmdb.client.ts         # Wrapper Axios para TMDB API
│
├── create_tables.sql              # Script SQL completo (ejecutar una vez)
├── .env                           # Variables de entorno (ver sección)
└── package.json
```

### Frontend (`MooviProject/`)

```
MooviProject/
├── src/
│   ├── services/
│   │   └── api.js                 # Instancia Axios con interceptor JWT
│   │
│   ├── context/
│   │   ├── AuthContext.jsx        # isAuthenticated, user, loading, login, register, logout
│   │   ├── MyListContext.jsx      # listMovies, isInList, toggleInList → persiste en backend
│   │   └── ThemeContext.jsx       # dark/light mode (localStorage)
│   │
│   ├── pages/
│   │   ├── LandingPage/           # Splash pública con posters del trending
│   │   ├── SignInPage/            # Login real (POST /auth/login)
│   │   ├── JoinUsPage/            # Registro real (POST /auth/register)
│   │   ├── HomePage/              # Carousel trending + grid con tabs
│   │   ├── SearchPage/            # Búsqueda con debounce 400ms + voice agent
│   │   ├── FavoritesPage/         # Tendencias (GET /movies/trending)
│   │   ├── MyListPage/            # Lista del usuario
│   │   ├── ProfilePage/           # Datos reales del usuario (user.name, user.plan, etc.)
│   │   └── TitleDetailPage/       # Detalle de película/serie (GET /movies/:id)
│   │
│   └── components/
│       ├── MovieCard/             # Usa movie.poster_url, movie.platform.short_name
│       ├── MovieCarousel/         # Usa movie.poster_url, movie.overview
│       ├── MyListItem/            # Usa movie.platform.slug para el badge de color
│       ├── ActionButtons/         # "Ver en N", "+ edad", "Mi Lista" (toggle via API)
│       └── ProtectedRoute/        # Maneja loading state del auth antes de redirigir
│
├── .env                           # VITE_API_URL=http://localhost:3001/api
└── package.json
```

---

## Base de datos

### Tablas

#### `platforms`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INT UNSIGNED PK | Auto-increment |
| slug | VARCHAR(50) UNIQUE | `netflix`, `hbo`, `disney-plus` |
| name | VARCHAR(100) | `Netflix`, `HBO Max`, `Disney+` |
| short_name | VARCHAR(10) | `N`, `HBO`, `D+` |
| color | VARCHAR(7) | Hex color: `#E50914` |
| logo_url | VARCHAR(500) | URL del logo (opcional) |

#### `users`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INT UNSIGNED PK | Auto-increment |
| email | VARCHAR(255) UNIQUE | Email del usuario |
| password_hash | VARCHAR(255) | bcrypt hash (cost 10) |
| name | VARCHAR(255) | Nombre completo |
| country | VARCHAR(100) | País (opcional) |
| plan | ENUM('free','premium') | Plan actual, default 'free' |
| avatar_url | VARCHAR(500) | URL del avatar (opcional) |

#### `movies`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INT UNSIGNED PK | Auto-increment |
| tmdb_id | INT UNSIGNED UNIQUE | ID en TMDB (clave de upsert) |
| slug | VARCHAR(255) UNIQUE | URL-safe: `stranger-things-66732` |
| title | VARCHAR(500) | Título localizado (es-AR) |
| overview | TEXT | Sinopsis |
| poster_url | VARCHAR(500) | `https://image.tmdb.org/t/p/w500/...` |
| backdrop_url | VARCHAR(500) | Imagen de fondo |
| age_rating | TINYINT UNSIGNED | Clasificación: 0, 7, 12, 13, 14, 16, 18 |
| platform_id | FK → platforms.id | Plataforma donde está disponible |
| trending | TINYINT(1) | ¿Está en el trending semanal? |
| badge | VARCHAR(50) | `TOP 10` o `TENDENCIA` |
| popularity_rank | SMALLINT UNSIGNED | Posición en el ranking (1 = más popular) |
| popularity_trend | ENUM('up','down') | Sube o baja respecto al sync anterior |
| genres | VARCHAR(500) | JSON array: `["Drama","Acción"]` |
| media_type | ENUM('movie','tv') | Tipo de contenido |
| runtime | SMALLINT UNSIGNED | Minutos |
| release_year | SMALLINT UNSIGNED | Año de estreno |

#### `user_lists`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| user_id | FK → users.id | PK compuesta |
| movie_id | FK → movies.id | PK compuesta |
| added_at | DATETIME | Cuándo se agregó |

### Índices
- `idx_movies_ft` — FULLTEXT en `title` + `overview` (búsqueda de texto)
- `idx_movies_trending` — en `trending`
- `idx_movies_platform` — en `platform_id`
- `idx_movies_popularity_rank` — en `popularity_rank`

---

## API Reference

> Base URL: `http://localhost:3001/api`
>
> Endpoints de movies y platforms son **públicos** (sin JWT).
> Endpoints de users y sync requieren `Authorization: Bearer <token>`.

### Auth

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| POST | `/auth/register` | `{email, password, name, country?}` | `{access_token, user}` |
| POST | `/auth/login` | `{email, password}` | `{access_token, user}` |
| GET | `/auth/me` | — (JWT) | `{id, email, name, plan}` |

### Movies (público)

| Método | Ruta | Query params | Descripción |
|--------|------|-------------|-------------|
| GET | `/movies` | `tab=novedades\|recientes\|populares`, `page=1`, `limit=20` | Lista paginada |
| GET | `/movies/trending` | — | Top 20 por popularity_rank |
| GET | `/movies/search` | `q=string` | FULLTEXT + LIKE, devuelve hasta 50 |
| GET | `/movies/platform/:slug` | — | Filtrar por plataforma (`netflix`, `hbo`, `disney-plus`) |
| GET | `/movies/:id` | — | Detalle de un título |

### Users (requiere JWT)

| Método | Ruta | Body | Descripción |
|--------|------|------|-------------|
| GET | `/users/me` | — | Perfil del usuario |
| PUT | `/users/me` | `{name?, country?, avatar_url?}` | Actualizar perfil |
| GET | `/users/me/list` | — | Mi Lista completa (objetos movie) |
| POST | `/users/me/list/:movieId` | — | Agregar a Mi Lista |
| DELETE | `/users/me/list/:movieId` | — | Quitar de Mi Lista |

### Platforms (público)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/platforms` | Lista las 3 plataformas con slug, nombre, color |

### Sync (requiere JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/sync/run` | Sincroniza catálogo desde TMDB. Tarda ~1-2 min. |

**Respuesta de sync:**
```json
{ "inserted": 45, "updated": 12, "skipped": 163 }
```

### Formato de objeto Movie

```json
{
  "id": 42,
  "tmdb_id": 66732,
  "slug": "stranger-things-66732",
  "title": "Stranger Things",
  "overview": "La historia narra la súbita desaparición de un niño...",
  "poster_url": "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDh.jpg",
  "backdrop_url": "https://image.tmdb.org/t/p/w500/rcA5r2YKHMKLM9CQKWLRPM0ODwK.jpg",
  "age_rating": 16,
  "platform": {
    "id": 1,
    "slug": "netflix",
    "name": "Netflix",
    "short_name": "N",
    "color": "#E50914"
  },
  "trending": true,
  "badge": "TOP 10",
  "popularity_rank": 1,
  "popularity_trend": "up",
  "genres": ["Drama", "Terror", "Ciencia ficción"],
  "media_type": "tv",
  "runtime": 51,
  "release_year": 2016
}
```

---

## Configuración de entorno

### Backend — `moovi-api/.env`

```env
# Servidor
PORT=3001
FRONTEND_URL=http://localhost:5173

# Base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=moovi_db

# JWT
JWT_SECRET=moovi_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# TMDB API (gratuita — ver instrucciones abajo)
TMDB_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9...   # Read Access Token (el largo)
TMDB_COUNTRY=AR
```

### Frontend — `MooviProject/.env`

```env
VITE_API_URL=http://localhost:3001/api
```

---

## Cómo levantar el proyecto (paso a paso)

### Prerrequisitos

- **Node.js** >= 18
- **MySQL** 8.x corriendo en localhost:3306 (usuario `root`, contraseña `root`)
- **Cuenta en TMDB** (gratuita) para obtener el API token

### Paso 1 — Obtener el token de TMDB

1. Creá una cuenta en [themoviedb.org](https://www.themoviedb.org/signup)
2. Ir a **Settings → API** → solicitar una API key (tipo "Developer", gratis)
3. Copiar el **API Read Access Token** (el token largo que empieza con `eyJ...`)
   - ⚠️ No uses la "API Key" corta — usá el **Read Access Token** (Bearer)

### Paso 2 — Crear la base de datos

Abrí MySQL Workbench (o cualquier cliente MySQL) y ejecutá el script:

```bash
cd C:\Users\Tobi\Desktop\seminario\moovi-api
mysql -u root -proot < create_tables.sql
```

Esto crea la base `moovi_db`, las 4 tablas, los índices, y hace el seed de las 3 plataformas.

**Verificar:**
```sql
USE moovi_db;
SHOW TABLES;
SELECT * FROM platforms;
```

Debe mostrar: `movies`, `platforms`, `user_lists`, `users` + las 3 plataformas.

### Paso 3 — Configurar y levantar el backend

```bash
cd C:\Users\Tobi\Desktop\seminario\moovi-api

# Editar .env y pegar el TMDB_ACCESS_TOKEN
# El archivo ya tiene todos los otros valores configurados

npm run start:dev
```

Verás en consola:
```
Moovi API running on http://localhost:3001/api
```

### Paso 4 — Registrar un usuario y sincronizar el catálogo

Abrí otra terminal (el backend debe seguir corriendo):

```bash
# 4a. Registrar un usuario (guarda el access_token de la respuesta)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@moovi.com\",\"password\":\"123456\",\"name\":\"Admin\"}"
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "email": "admin@moovi.com", "name": "Admin", "plan": "free" }
}
```

```bash
# 4b. Sincronizar catálogo (reemplazar <TOKEN> con el access_token de arriba)
# Esto tarda ~1-2 minutos (respeta el rate limit de TMDB)
curl -X POST http://localhost:3001/api/sync/run \
  -H "Authorization: Bearer <TOKEN>"
```

Respuesta:
```json
{ "inserted": 48, "updated": 0, "skipped": 172 }
```

Ahora tenés ~40-60 películas/series reales de Netflix, HBO Max y Disney+ disponibles en Argentina.

### Paso 5 — Levantar el frontend

```bash
cd C:\Users\Tobi\Desktop\seminario\MooviProject
npm run dev
```

Abrí [http://localhost:5173](http://localhost:5173)

### Paso 6 — Verificar end-to-end

1. **Landing page** → deben aparecer los posters reales de TMDB en el fondo
2. **Join Us** → crear una cuenta nueva (se guarda en MySQL, devuelve JWT)
3. **Home** → carousel de trending con posters reales, tabs Novedades/Recientes/Populares
4. **Buscar** → escribir "drama" o "acción" → resultados reales via FULLTEXT
5. **Tendencia** → página con los más vistos ordenados por rank
6. **Detalle de título** → click en cualquier card → detalle con sinopsis y botón "Mi Lista"
7. **Mi Lista** → agregar 2-3 títulos → ir a la sección → deben persistir al refrescar
8. **Perfil** → debe mostrar el nombre y email con el que te registraste

---

## Sincronización del catálogo con TMDB

### Cómo funciona

El sync (`POST /api/sync/run`) hace lo siguiente:

1. **Fetch** de ~220 items únicos:
   - `/trending/all/week` páginas 1-3 (60 items)
   - `/tv/popular` páginas 1-5 (100 series)
   - `/movie/popular` páginas 1-3 (60 películas)

2. **Filtrado**: para cada item, llama `/{type}/{id}/watch/providers`. Solo quedan los títulos disponibles en **Argentina** (`AR`) en **flatrate** (suscripción) en alguna de las 3 plataformas:
   - provider_id `8` → Netflix
   - provider_id `384` → HBO Max
   - provider_id `337` → Disney+

3. **Enriquecimiento**: para los que pasan el filtro, obtiene detalles completos (géneros, runtime, año) y clasificación por edad (Argentina primero, fallback US).

4. **Lógica de badges**:
   - Posición 1-10 en trending → `badge = 'TOP 10'`
   - No trending + `vote_average > 7.5` y `vote_count > 1000` → `badge = 'TENDENCIA'`

5. **popularity_trend**: compara el `popularity_rank` actual con el del sync anterior. Si mejoró (número menor) → `'up'`, si empeoró → `'down'`.

6. **UPSERT** via `INSERT ... ON DUPLICATE KEY UPDATE` en `tmdb_id`.

### Re-sync

Podés correr el sync periódicamente para actualizar tendencias. Cada vez que lo corras:
- Los rankings y trends se actualizarán
- Nuevos títulos aparecerán si están disponibles
- Los títulos que dejaron de estar disponibles **no se borran** (quedan en DB pero sin aparecer en trending)

---

## Flujo de autenticación

```
Frontend                          Backend
   │                                 │
   ├─ POST /auth/register ──────────►│ hash password con bcrypt
   │                                 │ INSERT INTO users
   │◄── { access_token, user } ──────┤ sign JWT (7d expiry)
   │                                 │
   ├─ localStorage.setItem('moovi-token', token)
   │                                 │
   ├─ GET /auth/me ─────────────────►│ verify JWT
   │    Authorization: Bearer <token>│ return payload
   │◄── { id, email, name, plan } ───┤
   │                                 │
   ├─ Cualquier ruta protegida ──────►│ JwtAuthGuard valida Bearer
   │    (users/me/list, sync/run)    │ inyecta user en request
```

El token se guarda en `localStorage` con la key `moovi-token`. El interceptor de Axios lo adjunta automáticamente en cada request. En caso de 401 (token expirado), el interceptor limpia el token y redirige al inicio.

---

## Funcionalidades implementadas

### ✅ Backend
- [x] Registro y login con JWT (bcrypt + passport-jwt)
- [x] Rehydration de sesión (`GET /auth/me`)
- [x] Catálogo de películas con paginación y tabs
- [x] Búsqueda full-text MySQL (MATCH AGAINST + fallback LIKE)
- [x] Filtrado por plataforma
- [x] Mi Lista: persistencia en MySQL por usuario
- [x] Sync automático con TMDB (trending, popular, watch providers)
- [x] Cálculo de badges y popularity_trend incremental
- [x] Clasificación de edad por país (AR/US)
- [x] Plataformas como entidades relacionadas (FK)

### ✅ Frontend
- [x] Auth context con estado real (isAuthenticated, user, loading)
- [x] ProtectedRoute con manejo de loading (sin flash de redirección)
- [x] LandingPage con posters dinámicos del trending real
- [x] Login/Register con validación y manejo de errores de API
- [x] HomePage con carousel de trending + grid con 3 tabs
- [x] SearchPage con debounce 400ms → búsqueda en backend
- [x] SearchPage con voice agent (queries van al backend)
- [x] FavoritesPage con trending real de backend
- [x] TitleDetailPage fetching por ID numérico
- [x] Mi Lista con optimistic update (toggle instantáneo, sincroniza con backend)
- [x] ProfilePage con datos reales del usuario autenticado
- [x] Todos los componentes usan la forma del objeto Movie de la API

---

## Notas sobre JustWatch

La API oficial de JustWatch (`apis.justwatch.com/contentpartner/v2`) requiere un **contrato de partner** de pago para obtener el token de acceso.

Sin embargo, **TMDB expone los mismos datos de streaming availability de forma gratuita** a través del endpoint `GET /{type}/{id}/watch/providers`, que internamente se alimenta de JustWatch. Este es exactamente el mismo dataset, sin costo.

Por eso este proyecto usa TMDB como fuente principal: es gratuita, bien documentada, y cubre 150+ países con datos de streaming availability actualizados diariamente.

Si en el futuro se obtiene acceso al partner API de JustWatch, el módulo `sync` puede extenderse para usar esa fuente directamente (mayor granularidad de precios por tipo de monetización).
