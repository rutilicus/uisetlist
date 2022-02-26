import { SongData } from "./types.js";

interface ControlBarProps {
  currentSong?: SongData;
  currentTime?: number;
}
interface ControlBarState {

}

export class ControlBar extends React.Component<ControlBarProps, ControlBarState> {
  render() {
    return (
      <div className="controlBar">
        <div className="controlIcons">
          <span className="material-icons">skip_previous</span>
          <span id="playButton" className="material-icons playButton">play_arrow</span>
          <span className="material-icons">skip_next</span>
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
          <span id="volumeButton" className="material-icons">volume_up</span>
          <span id="repeatButton" className="material-icons">repeat</span>
        </div>
      </div>
    );
  }
}
