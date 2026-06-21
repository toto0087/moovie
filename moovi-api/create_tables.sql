CREATE DATABASE IF NOT EXISTS moovi_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE moovi_db;

CREATE TABLE IF NOT EXISTS platforms (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug       VARCHAR(50)  NOT NULL UNIQUE,
  name       VARCHAR(100) NOT NULL,
  short_name VARCHAR(10)  NOT NULL,
  color      VARCHAR(7)   DEFAULT NULL,
  logo_url   VARCHAR(500) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  country       VARCHAR(100) DEFAULT NULL,
  plan          ENUM('free','premium') NOT NULL DEFAULT 'free',
  avatar_url    VARCHAR(500) DEFAULT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tmdb_id          INT UNSIGNED NOT NULL UNIQUE,
  slug             VARCHAR(255) NOT NULL UNIQUE,
  title            VARCHAR(500) NOT NULL,
  overview         TEXT         DEFAULT NULL,
  poster_url       VARCHAR(500) DEFAULT NULL,
  backdrop_url     VARCHAR(500) DEFAULT NULL,
  age_rating       TINYINT UNSIGNED DEFAULT NULL,
  platform_id      INT UNSIGNED DEFAULT NULL,
  trending         TINYINT(1)   NOT NULL DEFAULT 0,
  badge            VARCHAR(50)  DEFAULT NULL,
  popularity_rank  SMALLINT UNSIGNED DEFAULT NULL,
  popularity_trend ENUM('up','down') DEFAULT NULL,
  genres           VARCHAR(500) DEFAULT NULL,
  media_type       ENUM('movie','tv') NOT NULL DEFAULT 'tv',
  runtime          SMALLINT UNSIGNED DEFAULT NULL,
  release_year     SMALLINT UNSIGNED DEFAULT NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_movie_platform FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE SET NULL
);

CREATE INDEX idx_movies_trending        ON movies (trending);
CREATE INDEX idx_movies_platform        ON movies (platform_id);
CREATE INDEX idx_movies_popularity_rank ON movies (popularity_rank);
ALTER TABLE movies ADD FULLTEXT INDEX idx_movies_ft (title, overview);

CREATE TABLE IF NOT EXISTS user_lists (
  user_id  INT UNSIGNED NOT NULL,
  movie_id INT UNSIGNED NOT NULL,
  added_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, movie_id),
  CONSTRAINT fk_list_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_list_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

INSERT IGNORE INTO platforms (slug, name, short_name, color, logo_url) VALUES
  ('netflix',        'Netflix',      'N',     '#E50914', 'https://image.tmdb.org/t/p/w92/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg'),
  ('hbo',            'HBO Max',      'HBO',   '#5822B4', 'https://image.tmdb.org/t/p/w92/jbe4gVSfRlbPTdESXhEKpornsfu.jpg'),
  ('disney-plus',    'Disney+',      'D+',    '#0063E5', 'https://image.tmdb.org/t/p/w92/97yvRBw1GzX7fXprcF80er19ot.jpg'),
  ('apple-tv',       'Apple TV+',    'TV+',   '#1D1D1F', 'https://image.tmdb.org/t/p/w92/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg'),
  ('amazon-prime',   'Prime Video',  'Prime', '#00A8E1', 'https://image.tmdb.org/t/p/w92/pvske1MyAoymrs5bguRfVqYiM9a.jpg'),
  ('paramount-plus', 'Paramount+',   'P+',    '#0064FF', 'https://image.tmdb.org/t/p/w92/h5DcR0J2EESLitnhR8xLG1QymTE.jpg'),
  ('star-plus',      'Star+',        'S+',    '#E50914', 'https://image.tmdb.org/t/p/w92/hR9vWd8hWEVQKD6eOnBneKRFEW3.jpg'),
  ('crunchyroll',    'Crunchyroll',  'CR',    '#F47521', 'https://image.tmdb.org/t/p/w92/fzN5Jok5Ig1eJ7gyNGoMhnLSCfh.jpg'),
  ('pluto-tv',       'Pluto TV',     'Pluto', '#FFD500', 'https://image.tmdb.org/t/p/w92/dB8G41Q6tSL5NBisrIeqByfepBc.jpg'),
  ('mubi',           'Mubi',         'M',     '#001489', 'https://image.tmdb.org/t/p/w92/x570VpH2C9EKDf1riP83rYc5dnL.jpg'),
  ('clarovideo',     'Claro video',  'Claro', '#E30613', 'https://image.tmdb.org/t/p/w92/21M5CpiOYGOhHj2sVPXqwt6yeTO.jpg');
