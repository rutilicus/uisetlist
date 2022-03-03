import React from "react";
import { SongData } from "./types"
import { SongElem } from "./songelem_new"

interface SongListProps {
  allSongList: SongData[];
  setSongIndex(inedx: number): void;
}
interface SongListState {

}

export class SongList extends React.Component<SongListProps, SongListState> {
  constructor(props) {
    super(props);

    this.onSongElemClick = this.onSongElemClick.bind(this);
  }

  onSongElemClick(index) {
    this.props.setSongIndex(index);
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
