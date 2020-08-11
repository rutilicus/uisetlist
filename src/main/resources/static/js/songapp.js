'use strict';

/*
 * dependencies: player.js, songelem.js, songlist.js
 */

class SongApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allSongList: [{name: "全曲一覧", list: this.props.allSongs}]
        };

        this.jumpTo = this.jumpTo.bind(this);
        this.transPage = this.transPage.bind(this);
        this.setPlayerInstance = this.setPlayerInstance.bind(this);
        this.getPlayerInstance = this.getPlayerInstance.bind(this);
        this.onPopState = this.onPopState.bind(this);
        this.setTime = this.setTime.bind(this);
        this.getTime = this.getTime.bind(this);
        this.setControl = this.setControl.bind(this);
        this.stopControl = this.stopControl.bind(this);
        this.getCurrentSongList = this.getCurrentSongList.bind(this);
        this.getCurrentMovieId = this.getCurrentMovieId.bind(this);
        this.setCurrentMovieId = this.setCurrentMovieId.bind(this);
        this.getPlayerController = this.getPlayerController.bind(this);
        this.setPlayerController = this.setPlayerController.bind(this);
        this.checkSeek = this.checkSeek.bind(this);

        window.onpopstate = this.onPopState;

        this.player = null;

        this.seekPollingIntervalId = null;
        this.loopTimeoutId = null;

        this.lastPollingTime = -1;
        this.startTime = -1;
        this.endTime = -1;

        this.currentMovieId = this.props.defaultId;

        this.playerController = null;
    }

    jumpTo(movieId, time) {
        if (movieId != this.currentMovieId) {
            this.player.loadVideoById(movieId, time);
            this.currentMovieId = movieId;
        } else {
            this.player.seekTo(time, true);
            this.player.playVideo();

            this.setControl();
        }
    }

    setControl() {
        this.stopControl();

        const currentTime = this.player.getCurrentTime();

        for (let i = 0; i < this.state.allSongList[0].list.length; i++) {
            if (this.currentMovieId == this.state.allSongList[0].list[i].movieId &&
                this.state.allSongList[0].list[i].time <= currentTime &&
                currentTime < this.state.allSongList[0].list[i].endTime) {
                this.startTime = this.state.allSongList[0].list[i].time;
                this.endTime = this.state.allSongList[0].list[i].endTime;

                this.loopTimeoutId = window.setTimeout(this.playerController,
                                                  (this.endTime - currentTime) * 1000 / this.player.getPlaybackRate());
                this.seekPollingIntervalId = window.setInterval(this.checkSeek, 1000);

                break;
            }
        }
    }

    stopControl() {
        window.clearInterval(this.seekPollingIntervalId);
        window.clearTimeout(this.loopTimeoutId);
        this.lastPollingTime = -1;
        this.startTime = -1;
        this.endTime = -1;
    }

    transPage(props) {
        history.pushState(null, null, '?id=' + props.movieId + '&time=' + props.time);
        this.jumpTo(props.movieId, props.time);
    }

    setPlayerInstance(player) {
        this.player = player;
    }

    getPlayerInstance(player) {
        return this.player
    }

    renderSongList() {
        this.allSongListComponent = React.createElement(SongList, {
            allSongList: this.state.allSongList,
            onClickListener: this.transPage
        });
        return this.allSongListComponent;
    }

    onPopState(event) {
        let params = location.search.substr(1).split('&');
        let movieId = "";
        let time = 0;

        for (let i = 0; i < params.length; i++) {
            let kv = params[i].split('=');
            if (kv.length != 2) {
                break;
            }
            switch (kv[0]) {
                case 'id':
                    movieId = kv[1];
                    break;
                case 'time':
                    time = parseInt(kv[1]) || 0;
                    break;
            }
        }
        this.jumpTo(movieId, time);
    }

    setTime(timeData) {
        if ("lastPollingTime" in timeData) {
            this.lastPollingTime = timeData.lastPollingTime;
        }
        if ("startTime" in timeData) {
            this.startTime = timeData.startTime;
        }
        if ("endTime" in timeData) {
            this.endTime = timeData.endTime;
        }
    }

    getTime() {
        return {
            lastPollingTime: this.lastPollingTime,
            startTime: this.startTime,
            endTime: this.endTime
        };
    }

    getCurrentMovieId() {
        return this.currentMovieId;
    }

    setCurrentMovieId(movieId) {
        this.currentMovieId = movieId;
    }

    getPlayerController() {
        return this.playerController;
    }

    setPlayerController(controller) {
        this.playerController = controller;
    }

    checkSeek() {
        const eps = 0.5;
        const currentTime = this.player.getCurrentTime();

        if (this.lastPollingTime != -1) {
            if (this.player.getPlayerState() == YT.PlayerState.PLAYING) {
                if (Math.abs(currentTime - this.lastPollingTime - 1 * this.player.getPlaybackRate()) > eps) {
                    this.setControl();
                    return;
                }
            }
        }
        this.lastPollingTime = currentTime;
    }

    getCurrentSongList() {
        return this.state.allSongList[0].list;
    }

    render() {
/*
        return (
            <div className="wrapper">
                <div className="main">
                    <main>
                        {<Player control="true"
                                 setInstance={this.setPlayerInstance}
                                 getInstance={this.getPlayerInstance}
                                 defaultId={this.props.defaultId}
                                 defaultTime={this.props.defaultTime}
                                 jumpTo={this.jumpTo}
                                 setTime={this.setTime}
                                 getTime={this.getTime}
                                 setControl={this.setControl}
                                 stopControl={this.stopControl}
                                 getCurrentMovieId={this.getCurrentMovieId}
                                 setCurrentMovieId={this.setCurrentMovieId}
                                 getPlayerController={this.getPlayerController}
                                 setPlayerController={this.setPlayerController}
                                 getCurrentSongList={this.getCurrentSongList} />}
                    </main>
                </div>
                <div className="aside">
                    <aside>
                        {this.renderSongList()}
                    </aside>
                </div>
            </div>
        );
*/
        return React.createElement("div", {
                 className: "wrapper"
               }, React.createElement("div", {
                 className: "main"
               }, React.createElement("main", null, React.createElement(Player, {
                 control: "true",
                 setInstance: this.setPlayerInstance,
                 getInstance: this.getPlayerInstance,
                 defaultId: this.props.defaultId,
                 defaultTime: this.props.defaultTime,
                 jumpTo: this.jumpTo,
                 setTime: this.setTime,
                 getTime: this.getTime,
                 setControl: this.setControl,
                 stopControl: this.stopControl,
                 getCurrentMovieId: this.getCurrentMovieId,
                 setCurrentMovieId: this.setCurrentMovieId,
                 getPlayerController: this.getPlayerController,
                 setPlayerController: this.setPlayerController,
                 getCurrentSongList: this.getCurrentSongList
               }))), React.createElement("div", {
                 className: "aside"
               }, React.createElement("aside", null, this.renderSongList())));
    }
}
