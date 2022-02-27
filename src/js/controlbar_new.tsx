import { SongData } from "./types.js";
import * as Constants from "./constants.js"

interface ControlBarProps {
  currentSong?: SongData;
  currentTime?: number;
  playerState?: number;
  isMuted?: boolean;
  repeatState: number;
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  advanceRepeatState(): void;
  seekPrev(): void;
  seekNext(): void;
}
interface ControlBarState {

}

export class ControlBar extends React.Component<ControlBarProps, ControlBarState> {
  constructor(props) {
    super(props);

    this.advanceRepeatState = this.advanceRepeatState.bind(this);
  }

  advanceRepeatState() {
    this.props.advanceRepeatState();
  }

  render() {
    return (
      <div className="controlBar">
        <div className="controlIcons">
          <span
            className="material-icons"
            onClick={this.props.seekPrev}>skip_previous</span>
          {this.props.playerState === Constants.YT_PLAYING &&
            <span
              className="material-icons playButton"
              onClick={this.props.pauseVideo}>pause</span>          
          }
          {this.props.playerState !== Constants.YT_PLAYING &&
            <span
              className="material-icons playButton"
              onClick={this.props.playVideo}>play_arrow</span>          
          }
          <span
            className="material-icons"
            onClick={this.props.seekNext}>skip_next</span>
        </div>
        {this.props.currentSong && 
          <div className="playSongInfo">
            <img
              className="thumbnail" 
              src={`https://i.ytimg.com/vi/${this.props.currentSong.movie.movieId}/hqdefault.jpg`} />
            <div>
              <div className="songName">
                {this.props.currentSong.songName}
              </div>
              <div>
                <span className="artist">
                  {this.props.currentSong.artist}
                </span>
                {this.props.currentSong.artist &&
                  <span>・</span>
                }
                <span className="movieName">
                  {this.props.currentSong.movie.name}
                </span>
              </div>
            </div>
          </div>
        }
        <div className="controlIcons controlRight">
          {this.props.isMuted &&
            <span
              className="material-icons"
              onClick={this.props.unMute}>volume_off</span>
          }
          {!this.props.isMuted &&
            <span
              className="material-icons"
              onClick={this.props.mute}>volume_up</span>
          }
          {this.props.repeatState === Constants.REPEAT_NONE &&
            <span
              className="material-icons disable"
              onClick={this.advanceRepeatState}>repeat</span>
          }
          {this.props.repeatState === Constants.REPEAT_ALL &&
            <span
              className="material-icons"
              onClick={this.advanceRepeatState}>repeat</span>
          }
          {this.props.repeatState === Constants.REPEAT_ONE &&
            <span
              className="material-icons"
              onClick={this.advanceRepeatState}>repeat_one</span>
          }
          {this.props.repeatState === Constants.REPEAT_RANDOM &&
            <span
              className="material-icons"
              onClick={this.advanceRepeatState}>shuffle</span>
          }
        </div>
      </div>
    );
  }
}
