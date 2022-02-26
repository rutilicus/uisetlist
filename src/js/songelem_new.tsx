import { SongData } from "./types.js"

interface SongElemProps {
  songData: SongData
  index: number;
  onClickListener(number): void;
}
interface SongElemInterface {

}

export class SongElem extends React.Component<SongElemProps, SongElemInterface> {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }
 
  handleClick(e) {
    e.preventDefault();
    this.props.onClickListener(this.props.index);
  }

  render() {
    return(
      <div className="songElem" onClick={this.handleClick}>
        <img
          className="thumbnail" 
          src={`https://i.ytimg.com/vi/${this.props.songData.movie.movieId}/hqdefault.jpg`} />
        <div className="songInfo">
          <div className="songName"> 
            {this.props.songData.songName}
          </div>
          <div className="artist"> 
            {this.props.songData.artist}
          </div>
        </div>
      </div>
    );
  }
}
