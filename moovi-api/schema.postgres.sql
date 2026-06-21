-- ============================================================
-- Moovi — Esquema PostgreSQL (para Render Postgres / cualquier Postgres)
-- Reemplaza a create_tables.sql (que es MySQL y ya no se usa).
--
-- Cómo usarlo:
--   Conectá a la DB de Render con psql (External Connection String) y corré:
--     psql "<EXTERNAL_DATABASE_URL>" -f schema.postgres.sql
--   o pegá este contenido en cualquier cliente SQL (DBeaver, TablePlus, etc.).
-- ============================================================

-- ---------- platforms ----------
CREATE TABLE IF NOT EXISTS platforms (
  id         SERIAL PRIMARY KEY,
  slug       VARCHAR(50)  NOT NULL UNIQUE,
  name       VARCHAR(100) NOT NULL,
  short_name VARCHAR(10)  NOT NULL,
  color      VARCHAR(7),
  logo_url   VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- users ----------
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  country       VARCHAR(100),
  plan          VARCHAR(10) NOT NULL DEFAULT 'free' CHECK (plan IN ('free','premium')),
  avatar_url    VARCHAR(500),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- movies ----------
CREATE TABLE IF NOT EXISTS movies (
  id               SERIAL PRIMARY KEY,
  tmdb_id          INTEGER NOT NULL UNIQUE,
  slug             VARCHAR(255) NOT NULL UNIQUE,
  title            VARCHAR(500) NOT NULL,
  overview         TEXT,
  poster_url       VARCHAR(500),
  backdrop_url     VARCHAR(500),
  age_rating       SMALLINT,
  platform_id      INTEGER REFERENCES platforms(id) ON DELETE SET NULL,
  trending         BOOLEAN NOT NULL DEFAULT false,
  badge            VARCHAR(50),
  popularity_rank  INTEGER,
  popularity_trend VARCHAR(10) CHECK (popularity_trend IN ('up','down')),
  genres           VARCHAR(500),
  media_type       VARCHAR(10) NOT NULL DEFAULT 'tv' CHECK (media_type IN ('movie','tv')),
  runtime          INTEGER,
  release_year     INTEGER,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_movies_trending        ON movies (trending);
CREATE INDEX IF NOT EXISTS idx_movies_platform        ON movies (platform_id);
CREATE INDEX IF NOT EXISTS idx_movies_popularity_rank ON movies (popularity_rank);

-- ---------- user_lists (mi lista) ----------
CREATE TABLE IF NOT EXISTS user_lists (
  user_id  INTEGER NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, movie_id)
);

-- ---------- updated_at automático (equiv. ON UPDATE CURRENT_TIMESTAMP de MySQL) ----------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_platforms_updated ON platforms;
CREATE TRIGGER trg_platforms_updated BEFORE UPDATE ON platforms
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_users_updated ON users;
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_movies_updated ON movies;
CREATE TRIGGER trg_movies_updated BEFORE UPDATE ON movies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Seed de plataformas (opcional: el backend también las auto-siembra
-- al arrancar, vía PlatformsService.onModuleInit).
-- ============================================================
INSERT INTO platforms (slug, name, short_name, color, logo_url) VALUES
  ('netflix',        'Netflix',     'N',     '#E50914', 'https://image.tmdb.org/t/p/w92/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg'),
  ('hbo',            'HBO Max',     'HBO',   '#5822B4', 'https://image.tmdb.org/t/p/w92/jbe4gVSfRlbPTdESXhEKpornsfu.jpg'),
  ('disney-plus',    'Disney+',     'D+',    '#0063E5', 'https://image.tmdb.org/t/p/w92/97yvRBw1GzX7fXprcF80er19ot.jpg'),
  ('apple-tv',       'Apple TV+',   'TV+',   '#1D1D1F', 'https://image.tmdb.org/t/p/w92/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg'),
  ('amazon-prime',   'Prime Video', 'Prime', '#00A8E1', 'https://image.tmdb.org/t/p/w92/pvske1MyAoymrs5bguRfVqYiM9a.jpg'),
  ('paramount-plus', 'Paramount+',  'P+',    '#0064FF', 'https://image.tmdb.org/t/p/w92/h5DcR0J2EESLitnhR8xLG1QymTE.jpg'),
  ('star-plus',      'Star+',       'S+',    '#E50914', 'https://image.tmdb.org/t/p/w92/hR9vWd8hWEVQKD6eOnBneKRFEW3.jpg'),
  ('crunchyroll',    'Crunchyroll', 'CR',    '#F47521', 'https://image.tmdb.org/t/p/w92/fzN5Jok5Ig1eJ7gyNGoMhnLSCfh.jpg'),
  ('pluto-tv',       'Pluto TV',    'Pluto', '#FFD500', 'https://image.tmdb.org/t/p/w92/dB8G41Q6tSL5NBisrIeqByfepBc.jpg'),
  ('mubi',           'Mubi',        'M',     '#001489', 'https://image.tmdb.org/t/p/w92/x570VpH2C9EKDf1riP83rYc5dnL.jpg'),
  ('clarovideo',     'Claro video', 'Claro', '#E30613', 'https://image.tmdb.org/t/p/w92/21M5CpiOYGOhHj2sVPXqwt6yeTO.jpg')
ON CONFLICT (slug) DO NOTHING;
