interface SongElemProps {
  songName: string;
  artist: string;
}
interface SongElemInterface {

}

export class SongElem extends React.Component<SongElemProps, SongElemInterface> {
  render() {
    return(
      <div className="songElem">
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
