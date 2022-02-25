import { SongData } from "./types.js"
import { YTPlayer } from "./ytplayer_new.js"
import { SongList } from "./songlist_new.js"

interface SongAppProps {

}
interface SongAppState {
  allSongList?: SongData[];
}

class SongApp extends React.Component<SongAppProps, SongAppState> {
  player: YT.Player;
  currentSongData: SongData;

  constructor(props) {
    super(props);

    this.setPlayerInstance = this.setPlayerInstance.bind(this);
    this.setSongData = this.setSongData.bind(this);

    this.state = {
      allSongList: []
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

  setSongData(songData) {
    this.currentSongData = songData;
    this.player.loadVideoById({
      videoId: songData.movie.movieId,
      startSeconds: songData.time
    });
  }

  render() {
    return (
      <div>
        <header></header>
        <main>
          <YTPlayer setPlayerInstance={this.setPlayerInstance}/>
          <SongList
            allSongList={this.state.allSongList}
            setSongData={this.setSongData}/>
        </main>
        <footer></footer>
      </div>
    );
  }
}

ReactDOM.render(<SongApp />, document.getElementById("wrapper"));
