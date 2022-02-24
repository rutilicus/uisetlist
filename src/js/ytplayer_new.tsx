interface YTPlayerProps {
  setPlayerInstance(player: YT.Player): void;
}
interface YTPlayerState {

}

export class YTPlayer extends React.Component<YTPlayerProps, YTPlayerState> {
  constructor(props) {
    super(props);

    this.loadVideo = this.loadVideo.bind(this);
  }

  componentDidMount() {
    if (!window.YT) {
      let tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = this.loadVideo;
    } else {
      this.loadVideo();
    }
  }

  loadVideo() {
    const player = new YT.Player('ytplayer', {});
   this.props.setPlayerInstance(player);
  }

  render() {
    return (
      <div id="ytplayer"></div>
    );
  }
}
