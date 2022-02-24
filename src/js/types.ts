export type Movie = {
  movieId: string;
  name: string;
  date: string;
};

export type SongData = {
  time: number;
  endTime: number;
  songName: string;
  artist: string;
  movie: Movie;
};
