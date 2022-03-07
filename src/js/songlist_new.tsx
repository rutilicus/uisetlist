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
  songMenuClecked?: boolean;
  songMenuClickedIndex?: number;
}

export class SongList extends React.Component<SongListProps, SongListState> {
  constructor(props) {
    super(props);

    this.onSongElemClick = this.onSongElemClick.bind(this);
    this.onListSelected = this.onListSelected.bind(this);
    this.onElemMenuClick = this.onElemMenuClick.bind(this);
    this.onReleaseMenuClicked = this.onReleaseMenuClicked.bind(this);

    this.state = {
      songMenuClecked: false,
      songMenuClickedIndex: 0,
    }
  }

  onSongElemClick(listIndex: number) {
    this.props.setSongIndex(listIndex);
  }

  onElemMenuClick(listIndex: number) {
    this.setState({
      songMenuClecked: true,
      songMenuClickedIndex: listIndex,
    });
  }

  onReleaseMenuClicked() {
    this.setState({songMenuClecked: false});
  }

  onListSelected(event: React.ChangeEvent<HTMLSelectElement>) {
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
                return <div className="songElemWrapper">
                  <SongElem
                    key={index}
                    songData={song}
                    index={index}
                    onItemClickListener={this.onSongElemClick}
                    onMenuClickListener={this.onElemMenuClick} />
                  {
                    this.state.songMenuClecked &&
                    this.state.songMenuClickedIndex == index &&
                    <div
                      className="menuContent songListElemMenu">
                      <ul>
                        <li>リストに追加</li>
                      </ul>
                    </div>
                  }
                  </div>;
              })}
            </ReactSortable>
          </div>
        }
        { this.state.songMenuClecked &&
          <div
            className="checkBoxCover"
            onClick={this.onReleaseMenuClicked}></div>
        }
      </div>
    );
  }
}
