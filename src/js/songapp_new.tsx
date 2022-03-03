import { SongData } from "./types.js"
import { YTPlayer } from "./ytplayer_new.js"
import { SongList } from "./songlist_new.js"
import { ControlBar } from "./controlbar_new.js"
import * as Constants from "./constants.js"

interface SongAppProps {

}
interface SongAppState {
  allSongList?: SongData[];
  currentSongIndex?: number;
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
      allSongList: [],
      repeatState: Constants.REPEAT_NONE,
      currentTime: -1,
      isMuted: false
    };
  }
  
  async componentDidMount(): Promise<void> {
    const response = await fetch("/api/song", {
      mode: 'no-cors',
    });
    this.setState({
      allSongList: await response.json()
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

  setSongIndex(index) {
    this.setState({
      currentTime: -1,
      currentSongIndex: index
    });
    this.player.loadVideoById({
      videoId: this.state.allSongList[index].movie.movieId,
      startSeconds: this.state.allSongList[index].time
    });
  }

  getPlayerState() {
    if (this.player) {
      let currentTime = this.player.getCurrentTime ? this.player.getCurrentTime() : -1;
      this.setState({
        currentTime: currentTime,
        isMuted: this.player.isMuted && this.player.isMuted()
      });
      if (this.state.currentSongIndex) {
        let currentSong = this.state.allSongList[this.state.currentSongIndex];
        if (currentTime >= currentSong.endTime) {
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
    let currentIndex = this.state.currentSongIndex;
    let songNum = this.state.allSongList.length;
    switch(this.state.repeatState) {
      case Constants.REPEAT_NONE:
        if (currentIndex + 1 < songNum) {
          this.setSongIndex(currentIndex + 1);
        }
        break;
      case Constants.REPEAT_ALL:
        if (currentIndex + 1 < songNum) {
          this.setSongIndex(currentIndex + 1);
        } else {
          this.setSongIndex(0);
        }
        break;
      case Constants.REPEAT_ONE:
        this.setSongIndex(currentIndex);
        break;
      case Constants.REPEAT_RANDOM:
        this.setSongIndex(Math.floor(Math.random() * songNum));
        break
    }
  }

  seekNextForce() {
    let currentIndex = this.state.currentSongIndex;
    if (currentIndex) {
      if (this.state.repeatState === Constants.REPEAT_ONE) {
        if (currentIndex + 1 < this.state.allSongList.length) {
          this.setSongIndex(currentIndex + 1);
        }
      } else {
        this.seekNext();
      }
    }
  }

  seekPrev() {
    let currentTime = this.state.currentTime
    let currentIndex = this.state.currentSongIndex;
    if (currentIndex) {
      let currentSong = this.state.allSongList[currentIndex];
      if (currentTime - currentSong.time <= SEEK_PREV_TIME_THRES) {
        this.setSongIndex(Math.max(0, currentIndex - 1));
      } else {
        this.setSongIndex(currentIndex);
      }
    }
  }

  seekTime(time: number) {
    this.player.seekTo(time);
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
              allSongList={this.state.allSongList}
              setSongIndex={this.setSongIndex}/>
          </div>
          <ControlBar
            currentSong={this.state.allSongList[this.state.currentSongIndex]}
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
