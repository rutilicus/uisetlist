import React from "react";
import { IdSongData } from "./types"
import { SongElem } from "./songelem_new"
import { ReactSortable } from "react-sortablejs";

interface SongListProps {
  allSongList: IdSongData[];
  setSongIndex(listInedx: number): void;
  resetCurrentList(list: IdSongData[]): void;
}
interface SongListState {

}

export class SongList extends React.Component<SongListProps, SongListState> {
  constructor(props) {
    super(props);

    this.onSongElemClick = this.onSongElemClick.bind(this);
  }

  onSongElemClick(listIndex) {
    this.props.setSongIndex(listIndex);
  }

  render() {
    return(
      <div className="songList">
        <ReactSortable
          list={this.props.allSongList}
          setList={this.props.resetCurrentList}
          delay={1000}
          delayOnTouchOnly={true}
        >
          {this.props.allSongList.map((song, index) => {
            return <SongElem 
              key={index}
              songData={song}
              index={index}
              onClickListener={this.onSongElemClick}/>;
          })}
        </ReactSortable>
      </div>
    );
  }
}
