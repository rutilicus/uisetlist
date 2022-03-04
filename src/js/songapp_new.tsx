import { SongData, KeySongData, NamedSongList } from "./types"
import { YTPlayer } from "./ytplayer_new"
import { SongList } from "./songlist_new"
import { ControlBar } from "./controlbar_new"
import * as Constants from "./constants"
import React from "react"
import ReactDOM from "react-dom"

interface SongAppProps {

}
interface SongAppState {
  songListList?: NamedSongList[];
  currentListIndex?: number;
  currentSong?: KeySongData;
  currentTime?: number;
  playerState?: number;
  isMuted?: boolean;
  repeatState?: number;
}

const SEEK_PREV_TIME_THRES = 5;

class SongApp extends React.Component<SongAppProps, SongAppState> {
  player: YT.Player;
  inervalId = 0;

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

    this.state = {
      songListList: [
        {name: "", songList: []}
      ],
      currentListIndex: 0,
      repeatState: Constants.REPEAT_NONE,
      currentTime: -1,
      isMuted: false
    };
  }
  
  async componentDidMount(): Promise<void> {
    const response = await fetch("/api/song", {
      mode: 'no-cors',
    });
    let allSongList: SongData[] = await response.json();
    this.setState({
      songListList: [{
        name: "全曲一覧",
        songList: allSongList.map((songData, index) => {
          return {...songData, ...{key: index}};
        })}]
    });
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

  setSongIndex(listIndex) {
    let newSong = this.state.songListList[this.state.currentListIndex].songList[listIndex];
    this.setState({
      currentTime: -1,
      currentSong: newSong
    });
    this.player.loadVideoById({
      videoId: newSong.movie.movieId,
      startSeconds: newSong.time
    });
  }

  getPlayerState() {
    if (this.player) {
      let currentTime = this.player.getCurrentTime ? this.player.getCurrentTime() : -1;
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
      repeatState: (this.state.repeatState + 1) % Constants.REPEAT_ALL_NUM
    });
  }

  seekNext() {
    let arrayIndex = this.state.songListList[this.state.currentListIndex].songList.findIndex(
      (keySongData) => keySongData.key === this.state.currentSong.key
    );
    let songNum = this.state.songListList[this.state.currentListIndex].songList.length;
    if (arrayIndex != -1) {
      switch(this.state.repeatState) {
        case Constants.REPEAT_NONE:
          if (arrayIndex + 1 < songNum) {
            this.setSongIndex(arrayIndex + 1);
          }
          break;
        case Constants.REPEAT_ALL:
          if (arrayIndex + 1 < songNum) {
            this.setSongIndex(arrayIndex + 1);
          } else {
            this.setSongIndex(0);
          }
          break;
        case Constants.REPEAT_ONE:
          this.setSongIndex(arrayIndex);
          break;
        case Constants.REPEAT_RANDOM:
          this.setSongIndex(Math.floor(Math.random() * songNum));
          break
      }
    }
  }

  seekNextForce() {
    let arrayIndex = this.state.songListList[this.state.currentListIndex].songList.findIndex(
      (keySongData) => keySongData.key === this.state.currentSong.key
    );
    if (arrayIndex != -1) {
      if (this.state.repeatState === Constants.REPEAT_ONE) {
        if (arrayIndex + 1 < this.state.songListList[this.state.currentListIndex].songList.length) {
          this.setSongIndex(arrayIndex + 1);
        }
      } else {
        this.seekNext();
      }
    }
  }

  seekPrev() {
    let arrayIndex = this.state.songListList[this.state.currentListIndex].songList.findIndex(
      (keySongData) => keySongData.key === this.state.currentSong.key
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
              allSongList={this.state.songListList[this.state.currentListIndex].songList}
              setSongIndex={this.setSongIndex}/>
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
