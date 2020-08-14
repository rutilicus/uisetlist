'use strict';

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.loadVideo = this.loadVideo.bind(this);
        this.onPlayerReady = this.onPlayerReady.bind(this);
        this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
        this.onControlFuncChanged = this.onControlFuncChanged.bind(this);
        this.onPlaybackRateChange = this.onPlaybackRateChange.bind(this);
        this.loop = this.loop.bind(this);
        this.nextSeek = this.nextSeek.bind(this);
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
        const player = new YT.Player('player', {
           height: '315',
           width: '560',
           videoId: this.props.defaultId,
           events: {
               'onReady': this.onPlayerReady,
               'onStateChange': this.onPlayerStateChange,
               'onPlaybackRateChange': this.onPlaybackRateChange
           }
       });
       this.props.setInstance(player);
    }

    onPlayerReady(event) {
        if (this.props.defaultTime != null) {
            event.target.seekTo(this.props.defaultTime, true);
            event.target.playVideo();
        }
    }

    onPlayerStateChange(event) {
        switch(event.data) {
            case YT.PlayerState.PLAYING:
            case YT.PlayerState.PAUSED:
                this.onControlFuncChanged();
                break;
        }
    }

    onControlFuncChanged() {
        let radioElements = document.getElementsByName("playerControl");
        let select = "none";
        let isPlayerControlEnable = false;
        for (let i = 0; i < radioElements.length; i++) {
            if (radioElements[i].checked) {
                select = radioElements[i].value;
                break;
            }
        }

        switch (select) {
            case "loop":
                this.props.setPlayerController(this.loop);
                isPlayerControlEnable = true;
                break;

            case "next":
                this.props.setPlayerController(this.nextSeek);
                isPlayerControlEnable = true;
                break;

            default:
                this.props.setPlayerController(null);
                break;
        }

        if (isPlayerControlEnable &&
            this.props.getInstance().getPlayerState() == YT.PlayerState.PLAYING) {
            this.props.setControl();
        } else {
            this.props.stopControl();
        }
    }

    onPlaybackRateChange() {
        /* 再生速度変更はループ機能変更同様、ループ設定を変えるだけなのでonControlFuncChangedに流す */
        this.onControlFuncChanged();
    }

    loop() {
        this.props.jumpTo(this.props.getSongIndex());
    }

    nextSeek() {
        const currentIndex = this.props.getSongIndex();
        const songList = this.props.getCurrentSongList();

        if (currentIndex < songList.length - 1) {
            this.props.jumpTo(currentIndex + 1);
        }
    }

    setAllSongList(newList) {
        this.setState({allSongList: newList});
    }

    render() {
/*
        return(
            <div className="player">
                <div id="player"></div>
                {this.props.control &&
                    <fieldset className="controlButtons">
                        <legend>曲終了後プレーヤー制御</legend>
                        <p>
                            <input type="radio" id="none" name="playerControl"
                                   value="none" onClick={this.onControlFuncChanged}
                                   defaultChecked/>
                            <label htmlFor="none">制御なし</label>
                        </p>
                        <p>
                            <input type="radio" id="loop" name="playerControl"
                                   value="loop" onClick={this.onControlFuncChanged}/>
                            <label htmlFor="loop">1曲ループ</label>
                        </p>
                        <p>
                            <input type="radio" id="next" name="playerControl"
                                   value="next" onClick={this.onControlFuncChanged}/>
                            <label htmlFor="next">次の曲に移動</label>
                        </p>
                    </fieldset>
                }
            </div>
        );
*/
        return React.createElement("div", {
                 className: "player"
               }, React.createElement("div", {
                 id: "player"
               }), this.props.control && React.createElement("fieldset", {
                 className: "controlButtons"
               }, React.createElement("legend", null, "\u66F2\u7D42\u4E86\u5F8C\u30D7\u30EC\u30FC\u30E4\u30FC\u5236\u5FA1"), React.createElement("p", null, React.createElement("input", {
                 type: "radio",
                 id: "none",
                 name: "playerControl",
                 value: "none",
                 onClick: this.onControlFuncChanged,
                 defaultChecked: true
               }), React.createElement("label", {
                 htmlFor: "none"
               }, "\u5236\u5FA1\u306A\u3057")), React.createElement("p", null, React.createElement("input", {
                 type: "radio",
                 id: "loop",
                 name: "playerControl",
                 value: "loop",
                 onClick: this.onControlFuncChanged
               }), React.createElement("label", {
                 htmlFor: "loop"
               }, "1\u66F2\u30EB\u30FC\u30D7")), React.createElement("p", null, React.createElement("input", {
                 type: "radio",
                 id: "next",
                 name: "playerControl",
                 value: "next",
                 onClick: this.onControlFuncChanged
               }), React.createElement("label", {
                 htmlFor: "next"
               }, "\u6B21\u306E\u66F2\u306B\u79FB\u52D5"))));
    }
}
