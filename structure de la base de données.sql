CREATE TABLE clubs (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100),
  logo_url TEXT,
  stade VARCHAR(100),
  ville VARCHAR(100),
  date_creation DATE
);

CREATE TABLE joueurs (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100),
  poste VARCHAR(50),
  age INT,
  club_id INT REFERENCES clubs(id),
  buts INT DEFAULT 0,
  cartons_jaunes INT DEFAULT 0,
  cartons_rouges INT DEFAULT 0
);

CREATE TABLE matchs (
  id SERIAL PRIMARY KEY,
  club_domicile INT REFERENCES clubs(id),
  club_exterieur INT REFERENCES clubs(id),
  date_match DATE,
  score_domicile INT,
  score_exterieur INT,
  stade VARCHAR(100)
);
