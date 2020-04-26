CREATE TABLE IF NOT EXISTS movie
(
    movieid varchar(11) PRIMARY KEY,
    name text NOT NULL,
    date date NOT NULL
);

CREATE TABLE IF NOT EXISTS song
(
    movieid varchar(11),
    time integer,
    endtime integer NOT NULL,
    songname text NOT NULL,
    writer text NOT NULL,
    PRIMARY KEY (movieid, time),
    FOREIGN KEY (movieid) REFERENCES movie (movieid)
);

CREATE TABLE IF NOT EXISTS userdata
(
    username text PRIMARY KEY,
    password text NOT NULL
);

CREATE TABLE IF NOT EXISTS metatags
(
    name text PRIMARY KEY,
    content text NOT NULL
);

ALTER TABLE song ADD COLUMN IF NOT EXISTS endtime integer DEFAULT 0 NOT NULL;
