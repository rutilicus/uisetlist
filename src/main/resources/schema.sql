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
    songname text NOT NULL,
    writer text NOT NULL,
    PRIMARY KEY (movieid, time),
    FOREIGN KEY (movieid) REFERENCES movie (movieid)
);
