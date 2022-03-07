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

export type IdSongData = SongData & {
  id: number;
}

export type NamedSongList = {
  name: string;
  songList: IdSongData[];
}

// 以下、過去バージョン互換性用の型情報
export type SongDataOld = {
  movieId: string;
  time: number;
  songName: string;
  writer: string;
  movieName: string;
  endTime: number;
  // dateは過去バージョンに要素なし
}

export type NamedSongListOld = {
  name: string;
  list: SongDataOld[];
}
