import { SongData } from "./types.js"
import { SongElem } from "./songelem_new.js"

interface SongListProps {
  allSongList: SongData[];
  setSongData(songData: SongData): void;
}
interface SongListState {

}

export class SongList extends React.Component<SongListProps, SongListState> {
  constructor(props) {
    super(props);

    this.onSongElemClick = this.onSongElemClick.bind(this);
  }

  onSongElemClick(index) {
    this.props.setSongData(this.props.allSongList[index]);
  }

  render() {
    return(
      <div className="songList">
        {this.props.allSongList.map((song, index) => {
          return <SongElem 
            key={index}
            songData={song}
            index={index}
            onClickListener={this.onSongElemClick}/>;
        })}
      </div>
    );
  }
}
