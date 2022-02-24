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

  constructor(props) {
    super(props);

    this.setPlayerInstance = this.setPlayerInstance.bind(this);

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

  render() {
    return (
      <div>
        <header></header>
        <main>
          <YTPlayer setPlayerInstance={this.setPlayerInstance}/>
          <SongList allSongList={this.state.allSongList}/>
        </main>
        <footer></footer>
      </div>
    );
  }
}

ReactDOM.render(<SongApp />, document.getElementById("wrapper"));
