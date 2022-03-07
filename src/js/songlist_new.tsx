import React from "react";
import { IdSongData, NamedSongList } from "./types"
import { SongElem } from "./songelem_new"
import { ReactSortable } from "react-sortablejs";

interface SongListProps {
  songListList?: NamedSongList[];
  currentListIndex?: number;
  setSongIndex(listInedx: number): void;
  resetCurrentList(list: IdSongData[]): void;
  setListIndex(index: number): void;
}
interface SongListState {

}

export class SongList extends React.Component<SongListProps, SongListState> {
  constructor(props) {
    super(props);

    this.onSongElemClick = this.onSongElemClick.bind(this);
    this.onListSelected = this.onListSelected.bind(this);
  }

  onSongElemClick(listIndex) {
    this.props.setSongIndex(listIndex);
  }

  onListSelected(event) {
    this.props.setListIndex(parseInt(event.target.value));
  }

  render() {
    return(
      <div className="songList">
        { this.props.songListList.length != 0 &&
          <div className="userListEdit">
            <select
              className="listSelect"
              value={this.props.currentListIndex}
              onChange={this.onListSelected}>
              {this.props.songListList.map((listElem, index) => {
                return <option
                  value={index.toString()}
                  key={index.toString()}>
                  {listElem.name}
                </option>;
              })}
            </select>
            <input
              id="editButtonCheckBox"
              className="buttonCheckBox"
              type="checkbox"></input>
              <label
                htmlFor="editButtonCheckBox"
                className="editButtonText">
                <span>
                  Edit
                </span>
              </label>
              <label
                id="editButtonCover"
                className="buttonCheckBox checkBoxCover"
                htmlFor="editButtonCheckBox">
              </label>
            <div
              id="editButtonContent"
              className="menuContent">
              <ul>
                <li>リスト名変更</li>
                <li>リスト削除</li>
                <li>新規リスト作成</li>
              </ul>
            </div>
          </div>
        }
        { this.props.songListList.length != 0 &&
          <div className="selectedList">
            <ReactSortable
              list={this.props.songListList[this.props.currentListIndex].songList}
              setList={this.props.resetCurrentList}
              delay={1000}
              delayOnTouchOnly={true}
            >
              {this.props.songListList[this.props.currentListIndex].songList.map((song, index) => {
                return <SongElem 
                  key={index}
                  songData={song}
                  index={index}
                  onClickListener={this.onSongElemClick}/>;
              })}
            </ReactSortable>
          </div>
        }
      </div>
    );
  }
}
