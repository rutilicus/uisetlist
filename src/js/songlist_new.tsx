import React from "react";
import { IdSongData, NamedSongList } from "./types"
import { SongElem } from "./songelem_new"
import { ReactSortable } from "react-sortablejs";
import Modal from "react-modal";

interface SongListProps {
  songListList?: NamedSongList[];
  currentListIndex?: number;
  setSongIndex(listInedx: number): void;
  resetCurrentList(list: IdSongData[]): void;
  setListIndex(index: number): void;
}
interface SongListState {
  listMenuClicked?: boolean;
  songMenuClicked?: boolean;
  songMenuClickedIndex?: number;
  modalState?: ModalState;
}

enum ModalState {
  MODAL_NONE,
  MODAL_CREATE,
  MODAL_RENAME,
  MODAL_DELETE,
  MODAL_CREATE_NEW,
}

export class SongList extends React.Component<SongListProps, SongListState> {
  constructor(props) {
    super(props);

    this.onSongElemClick = this.onSongElemClick.bind(this);
    this.onListSelected = this.onListSelected.bind(this);
    this.onSongElemMenuClick = this.onSongElemMenuClick.bind(this);
    this.onSongElemMenuRelease = this.onSongElemMenuRelease.bind(this);
    this.displayCreateDialog = this.displayCreateDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.onListMenuClick = this.onListMenuClick.bind(this);
    this.onListMenuRelease = this.onListMenuRelease.bind(this);

    this.state = {
      listMenuClicked: false,
      songMenuClicked: false,
      songMenuClickedIndex: 0,
      modalState: ModalState.MODAL_NONE
    }
  }

  onSongElemClick(listIndex: number) {
    this.props.setSongIndex(listIndex);
  }

  onListMenuClick() {
    this.setState({ listMenuClicked: true });
  }

  onListMenuRelease() {
    this.setState({ listMenuClicked: false });
  }

  onSongElemMenuClick(listIndex: number) {
    this.setState({
      songMenuClicked: true,
      songMenuClickedIndex: listIndex,
    });
  }

  onSongElemMenuRelease() {
    this.setState({songMenuClicked: false});
  }

  onListSelected(event: React.ChangeEvent<HTMLSelectElement>) {
    this.props.setListIndex(parseInt(event.target.value));
  }

  displayCreateDialog() {
    this.setState({
      listMenuClicked: false,
      modalState: ModalState.MODAL_CREATE
    });
  }

  closeDialog() {
    this.setState({ modalState: ModalState.MODAL_NONE });
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
            <span
              className="editButtonText"
              onClick={this.onListMenuClick}>
              Edit
            </span>
            { this.state.listMenuClicked &&
              <div>
                <div
                  id="editButtonCover"
                  className="buttonCheckBox checkBoxCover"
                  onClick={this.onListMenuRelease}>
                </div>
                <div
                  id="editButtonContent"
                  className="menuContent">
                  <ul>
                    <li>リスト名変更</li>
                    <li>リスト削除</li>
                    <li onClick={this.displayCreateDialog}>新規リスト作成</li>
                  </ul>
                </div>
              </div>
            }
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
                    onMenuClickListener={this.onSongElemMenuClick} />
                  {
                    this.state.songMenuClicked &&
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
        { this.state.songMenuClicked &&
          <div
            className="checkBoxCover"
            onClick={this.onSongElemMenuRelease}></div>
        }
        <Modal
          isOpen={this.state.modalState === ModalState.MODAL_CREATE}
          onRequestClose={this.closeDialog}
          className="dialog">
          リスト名を入力してください
        </Modal>
      </div>
    );
  }
}
