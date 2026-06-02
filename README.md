# Moovi — Frontend

Frontend en React del proyecto **Moovi**, basado en los mockups de diseño. Solo interfaz (sin backend).

## Pantallas

| Ruta | Descripción |
|------|-------------|
| `/home` | Catálogo en grilla 2 columnas |
| `/buscar` | Home con barra de búsqueda |
| `/novedades` | Home con tabs (Novedades, Recién agregadas, Populares) |
| `/tendencia` | Contenido en tendencia (grilla) |
| `/mi-lista` | Carrusel horizontal de tu lista |
| `/perfil` | Perfil de usuario |
| `/titulo/:id` | Detalle de título (ej. Stranger Things) |
| `/sign-in` | Inicio de sesión |
| `/join-us` | Registro |

## Desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. En móvil o DevTools, usa ancho ~390–430px para ver el layout mobile-first.

## Build

```bash
npm run build
npm run preview
```

## Stack

- React 19 + Vite
- React Router
- CSS Modules + design tokens
- react-icons (Feather / brand icons)
