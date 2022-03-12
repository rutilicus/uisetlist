import { SongData, IdSongData, NamedSongList, SongDataOld, NamedSongListOld } from "./types"
import { YTPlayer } from "./ytplayer_new"
import { SongList } from "./songlist_new"
import { ControlBar } from "./controlbar_new"
import { RepeatState } from "./constants"
import React from "react"
import ReactDOM from "react-dom"

interface SongAppProps {

}
interface SongAppState {
  songListList?: NamedSongList[];
  currentListIndex?: number;
  currentSong?: IdSongData;
  currentTime?: number;
  playerState?: number;
  isMuted?: boolean;
  repeatState?: RepeatState;
}

const SEEK_PREV_TIME_THRES = 5;

class SongApp extends React.Component<SongAppProps, SongAppState> {
  player: YT.Player;
  inervalId = 0;
  baseTitle = "";

  constructor(props) {
    super(props);

    this.setPlayerInstance = this.setPlayerInstance.bind(this);
    this.setSongIndex = this.setSongIndex.bind(this);
    this.setPlayerState = this.setPlayerState.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);
    this.getPlayerState = this.getPlayerState.bind(this);
    this.startInterval = this.startInterval.bind(this);
    this.mute = this.mute.bind(this);
    this.unMute = this.unMute.bind(this);
    this.advanceRepeatState = this.advanceRepeatState.bind(this);
    this.seekNext = this.seekNext.bind(this);
    this.seekNextForce = this.seekNextForce.bind(this);
    this.seekPrev = this.seekPrev.bind(this);
    this.seekTime = this.seekTime.bind(this);
    this.resetCurrentList = this.resetCurrentList.bind(this);
    this.convertOldUserSongListData = this.convertOldUserSongListData.bind(this);
    this.setListIndex = this.setListIndex.bind(this);
    this.saveUserSongList = this.saveUserSongList.bind(this);
    this.createList = this.createList.bind(this);
    this.editCurrentListName = this.editCurrentListName.bind(this);
    this.deleteCurrentList = this.deleteCurrentList.bind(this);
    this.addSongToList = this.addSongToList.bind(this);
    this.deleteSongFromList = this.deleteSongFromList.bind(this);

    this.state = {
      songListList: [
        {name: "", songList: []}
      ],
      currentListIndex: 0,
      repeatState: RepeatState.REPEAT_NONE,
      currentTime: -1,
      isMuted: false
    };
  }
  
  convertOldUserSongListData(oldData: SongDataOld[]): IdSongData[] {
    return oldData.map((oldSongData, index) => {
      return {
        id: index,
        time: oldSongData.time,
        endTime: oldSongData.endTime,
        songName: oldSongData.songName,
        artist: oldSongData.writer,
        movie: {
          movieId: oldSongData.movieId,
          name: oldSongData.movieName,
          date: "",
        }
      };
    });
  }

  saveUserSongList(list: NamedSongList[]) {
    // 先頭は全曲一覧のため、Trimしたものを保存
    localStorage.setItem("allSongList", JSON.stringify(list.slice(1)));
  }

  async componentDidMount(): Promise<void> {
    const response = await fetch("/api/song", {
      mode: 'no-cors',
    });
    const allSongList: SongData[] = await response.json();
    let songListList = [{
      name: "全曲一覧",
      songList: allSongList.map((songData, index) => {
        return {...songData, ...{id: index}};
      })}];
    const userSongListJson = localStorage.getItem("allSongList");
    if (typeof userSongListJson === "string") {
      let isOldDataUsed = false;
      const parsed = JSON.parse(userSongListJson) as any[];
      parsed.forEach((songList) => {
        if ("list" in songList) {
          // 旧バージョン形式のリスト
          const typed = songList as NamedSongListOld;
          songListList.push({
            name: typed.name,
            songList: this.convertOldUserSongListData(typed.list)
          });
          isOldDataUsed = true;
        } else {
          // 現行バージョンのリスト
          let typed = songList as NamedSongList;
          // 普通に使っていればIDが枯渇することはないが、一応振り直す
          for (let i = 0; i < typed.songList.length; i++) {
            typed.songList[i].id = i;
          }
          songListList.push(typed);
        }
      });
      // データのコンバート、またはID振り直しがあるため一度保存する
      this.saveUserSongList(songListList);
    }

    this.setState({songListList: songListList});

    this.baseTitle = document.title;

    return Promise.resolve();
  }

  setPlayerInstance(player) {
    this.player = player;
  }

  setPlayerState(state) {
    this.setState({
      playerState: state
    });
  }

  playVideo() {
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }

  mute() {
    this.player.mute();
  }

  unMute() {
    this.player.unMute();
  }

  setSongIndex(listIndex: number) {
    const newSong = this.state.songListList[this.state.currentListIndex].songList[listIndex];
    this.setState({
      currentTime: -1,
      currentSong: newSong
    });
    this.player.loadVideoById({
      videoId: newSong.movie.movieId,
      startSeconds: newSong.time
    });

    document.title = newSong.songName + " - " + this.baseTitle;
  }

  getPlayerState() {
    if (this.player) {
      const currentTime = this.player.getCurrentTime ? this.player.getCurrentTime() : -1;
      this.setState({
        currentTime: currentTime,
        isMuted: this.player.isMuted && this.player.isMuted()
      });
      if (this.state.currentSong) {
        if (currentTime >= this.state.currentSong.endTime) {
          this.seekNext();
        }
      }
    }
  }

  startInterval() {
    this.inervalId = window.setInterval(this.getPlayerState, 500);
  }

  advanceRepeatState() {
    this.setState({
      repeatState: (this.state.repeatState + 1) % RepeatState.REPEAT_ALL_NUM
    });
  }

  seekNext() {
    const arrayIndex = this.state.songListList[this.state.currentListIndex].songList.findIndex(
      (idSongData) => idSongData.id === this.state.currentSong.id
    );
    const songNum = this.state.songListList[this.state.currentListIndex].songList.length;
    if (arrayIndex != -1) {
      switch(this.state.repeatState) {
        case RepeatState.REPEAT_NONE:
          if (arrayIndex + 1 < songNum) {
            this.setSongIndex(arrayIndex + 1);
          }
          break;
        case RepeatState.REPEAT_ALL:
          if (arrayIndex + 1 < songNum) {
            this.setSongIndex(arrayIndex + 1);
          } else {
            this.setSongIndex(0);
          }
          break;
        case RepeatState.REPEAT_ONE:
          this.setSongIndex(arrayIndex);
          break;
        case RepeatState.REPEAT_RANDOM:
          this.setSongIndex(Math.floor(Math.random() * songNum));
          break
      }
    }
  }

  seekNextForce() {
    const arrayIndex = this.state.songListList[this.state.currentListIndex].songList.findIndex(
      (idSongData) => idSongData.id === this.state.currentSong.id
    );
    if (arrayIndex != -1) {
      if (this.state.repeatState === RepeatState.REPEAT_ONE) {
        if (arrayIndex + 1 < this.state.songListList[this.state.currentListIndex].songList.length) {
          this.setSongIndex(arrayIndex + 1);
        }
      } else {
        this.seekNext();
      }
    }
  }

  seekPrev() {
    const arrayIndex = this.state.songListList[this.state.currentListIndex].songList.findIndex(
      (idSongData) => idSongData.id === this.state.currentSong.id
    );
    if (arrayIndex != -1) {
      if (this.state.currentTime - this.state.currentSong.time <= SEEK_PREV_TIME_THRES) {
        this.setSongIndex(Math.max(0, arrayIndex - 1));
      } else {
        this.setSongIndex(arrayIndex);
      }
    }
  }

  seekTime(time: number) {
    this.player.seekTo(time, true);
  }

  resetCurrentList(list: IdSongData[]) {
    let tmp = this.state.songListList.slice();
    tmp[this.state.currentListIndex].songList = list;
    this.setState({songListList: tmp});
    if (this.state.currentListIndex != 0) {
      this.saveUserSongList(tmp);
    }
  }

  setListIndex(index: number) {
    this.setState({currentListIndex: index});
  }

  createList(listName: string) {
    let tmp = this.state.songListList.slice();
    tmp.push({name: listName, songList: []});
    this.setState({songListList: tmp});
    this.saveUserSongList(tmp);
  }

  editCurrentListName(listName: string) {
    let tmp = this.state.songListList.slice();
    tmp[this.state.currentListIndex].name = listName;
    this.setState({songListList: tmp});
    this.saveUserSongList(tmp);
  }

  deleteCurrentList() {
    let tmp = this.state.songListList.slice();
    tmp.splice(this.state.currentListIndex, 1);
    this.setState({
      songListList: tmp,
      currentListIndex: 0
    });
    this.saveUserSongList(tmp);
  }

  addSongToList(listIndex: number, newSong: IdSongData) {
    let addElem = Object.assign({}, newSong);
    addElem.movie = Object.assign({}, newSong.movie);
    let tmp = this.state.songListList.slice();
    addElem.id =
      tmp[listIndex].songList.length ? 
      Math.max(...tmp[listIndex].songList.map((e) => e.id)) + 1 :
      0;
    tmp[listIndex].songList.push(addElem);
    this.setState({songListList: tmp});
    this.saveUserSongList(tmp);
  }

  deleteSongFromList(songIndex: number) {
    let tmp = this.state.songListList.slice();
    tmp[this.state.currentListIndex].songList.splice(songIndex, 1);
    this.setState({songListList: tmp});
    this.saveUserSongList(tmp);
  }

  render() {
    return (
      <div>
        <main>
          <div className="playerMain">
            <YTPlayer
              setPlayerInstance={this.setPlayerInstance}
              setPlayerState={this.setPlayerState}
              startInterval={this.startInterval}/>
            <SongList
              songListList={this.state.songListList}
              currentListIndex={this.state.currentListIndex}
              setSongIndex={this.setSongIndex}
              resetCurrentList={this.resetCurrentList}
              setListIndex={this.setListIndex}
              createList={this.createList}
              editCurrentListName={this.editCurrentListName}
              deleteCurrentList={this.deleteCurrentList}
              addSongToList={this.addSongToList}
              deleteSongFromList={this.deleteSongFromList}/>
          </div>
          <ControlBar
            currentSong={this.state.currentSong}
            currentTime={this.state.currentTime}
            playerState={this.state.playerState}
            isMuted={this.state.isMuted}
            repeatState={this.state.repeatState}
            playVideo={this.playVideo}
            pauseVideo={this.pauseVideo}
            mute={this.mute}
            unMute={this.unMute}
            advanceRepeatState={this.advanceRepeatState}
            seekPrev={this.seekPrev}
            seekNext={this.seekNextForce}
            seekTime={this.seekTime}/>
        </main>
      </div>
    );
  }
}

ReactDOM.render(<SongApp />, document.getElementById("wrapper"));
