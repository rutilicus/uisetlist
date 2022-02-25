interface SongElemProps {
  songName: string;
  artist: string;
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
        <div className="songName"> 
          {this.props.songName}
        </div>
        <div className="artist"> 
          {this.props.artist}
        </div>
      </div>
    );
  }
}
