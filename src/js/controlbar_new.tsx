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
          <div className="songInfo">
            <img
              className="thumbnail" 
              src={`https://i.ytimg.com/vi/${this.props.currentSong.movie.movieId}/hqdefault.jpg`} />
            <div className="songName">
              {this.props.currentSong.songName}
            </div>
            <div className="artist">
            {this.props.currentSong.artist}
            </div>
            <div className="movieName">
              {this.props.currentSong.movie.name}
            </div>
          </div>
        }
        <div className="controlIcons">
          <span id="volumeButton" className="material-icons">volume_up</span>
          <span id="repeatButton" className="material-icons playButton">repeat</span>
        </div>
      </div>
    );
  }
}
