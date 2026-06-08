# Moovi

Agregador de streaming (Netflix, HBO Max, Disney+).

## Estructura

```
moovi project/
├── moovi-api/    # Backend — NestJS + MySQL (puerto 3001)
└── moovi-front/  # Frontend — React + Vite (puerto 5173)
```

## Levantar el proyecto

### Backend

```bash
cd moovi-api
cp .env.example .env   # configurar DB y TMDB_ACCESS_TOKEN
npm install
npm run start:dev
```

API: http://localhost:3001/api

### Frontend

```bash
cd moovi-front
npm install
npm run dev
```

App: http://localhost:5173

### Base de datos (primera vez)

```bash
mysql -u root -p < moovi-api/create_tables.sql
```

El frontend consume la API del backend para catálogo, auth, perfil y mi lista.
