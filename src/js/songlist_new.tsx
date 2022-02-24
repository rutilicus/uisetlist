import { SongData } from "./types.js"
import { SongElem } from "./songelem_new.js"

interface SongListProps {
  allSongList: SongData[];
}
interface SongListState {

}

export class SongList extends React.Component<SongListProps, SongListState> {

  render() {
    return(
      <div className="songList">
        {this.props.allSongList.map((song, index) => {
          return <SongElem key={index} songName={song.songName} artist={song.artist} />;
        })}
      </div>
    );
  }
}
