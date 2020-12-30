'use strict';

/*
 * dependencies: player.js, songelem.js, songlist.js, editlist.js
 */

const storageKey = "allSongList";

class SongApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allSongList:
                [{name: "全曲一覧", list: this.props.allSongs}].concat(
                    JSON.parse(localStorage[storageKey] || "[]")
                ),
            mode: "play",
            listIndex: 0,
            editIndex: 1
        };

        this.jumpTo = this.jumpTo.bind(this);
        this.transPage = this.transPage.bind(this);
        this.setPlayerInstance = this.setPlayerInstance.bind(this);
        this.getPlayerInstance = this.getPlayerInstance.bind(this);
        this.onPopState = this.onPopState.bind(this);
        this.setControl = this.setControl.bind(this);
        this.stopControl = this.stopControl.bind(this);
        this.getCurrentSongList = this.getCurrentSongList.bind(this);
        this.getPlayerController = this.getPlayerController.bind(this);
        this.setPlayerController = this.setPlayerController.bind(this);
        this.checkSeek = this.checkSeek.bind(this);
        this.setListIndex = this.setListIndex.bind(this);
        this.getSongIndex = this.getSongIndex.bind(this);
        this.changeMode = this.changeMode.bind(this);
        this.addNewSongList = this.addNewSongList.bind(this);
        this.addSong2CurrentEditList = this.addSong2CurrentEditList.bind(this);
        this.setEditIndex = this.setEditIndex.bind(this);
        this.setSticky = this.setSticky.bind(this);
        this.setCurrentListName = this.setCurrentListName.bind(this);
        this.removeCurrentSongList = this.removeCurrentSongList.bind(this);
        this.swapUp = this.swapUp.bind(this);
        this.swapDown = this.swapDown.bind(this);
        this.removeSongFromCurrentEditList = this.removeSongFromCurrentEditList.bind(this);

        window.onpopstate = this.onPopState;

        this.player = null;

        this.seekPollingIntervalId = null;
        this.loopTimeoutId = null;

        this.lastPollingTime = -1;

        this.songIndex = -1;

        this.playerController = null;
    }

    jumpTo(index) {
        const currentList = this.state.allSongList[this.state.listIndex].list;
        const currentIndex = this.songIndex;
        this.songIndex = index;
        this.stopControl();

        if (0 <= index && index < currentList.length) {
            if (currentIndex == -1 ||
                currentList[currentIndex].movieId != currentList[index].movieId) {
                this.player.loadVideoById(currentList[index].movieId, currentList[index].time);
            } else {
                this.player.seekTo(currentList[index].time, true);
                this.player.playVideo();
                this.setControl();
            }
        }
    }

    setControl() {
        this.stopControl();

        const currentList = this.state.allSongList[this.state.listIndex].list;

        if (0 <= this.songIndex && this.songIndex < currentList.length) {
            const currentSong = currentList[this.songIndex];
            const currentTime = this.player.getCurrentTime();

            this.lastPollingTime = currentTime;
            this.loopTimeoutId =
                window.setTimeout(this.playerController,
                                  (currentSong.endTime - currentTime) * 1000 / this.player.getPlaybackRate());
            this.seekPollingIntervalId = window.setInterval(this.checkSeek, 1000);
        }
    }

    stopControl() {
        window.clearInterval(this.seekPollingIntervalId);
        window.clearTimeout(this.loopTimeoutId);
        this.lastPollingTime = -1;
    }

    transPage(props) {
        history.pushState(null, null, '?id=' + props.movieId + '&time=' + props.time + '&index=' + props.index);
        this.jumpTo(props.index);
    }

    setPlayerInstance(player) {
        this.player = player;
    }

    getPlayerInstance(player) {
        return this.player
    }

    onPopState(event) {
        let params = location.search.substr(1).split('&');
        let index = -1;
        let mode = "play";

        for (let i = 0; i < params.length; i++) {
            let kv = params[i].split('=');
            if (kv.length != 2) {
                break;
            }
            switch(kv[0]) {
                case "index":
                    index = parseInt(kv[1], 10);
                    if (isNaN(index)) {
                        index = -1;
                    }
                    break;
                case "mode":
                    mode = kv[1];
                    this.setState({editIndex: 1});
                    if (mode == "play") {
                        this.stopControl();
                    }
                    this.setSticky(mode);
                    break;
            }
        }
        this.setState({mode: mode});
        this.jumpTo(index);
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
        return this.state.allSongList[this.state.listIndex].list;
    }

    setListIndex(index) {
        this.setState({listIndex: index});
        this.stopControl();
    }

    getSongIndex() {
        return this.songIndex;
    }

    changeMode(event, mode) {
        event.preventDefault();
        history.pushState(null, null, "?mode=" + mode);
        this.setState({mode: mode});
        this.setSticky(mode);
    }

    addNewSongList(newList) {
        let tmp = this.state.allSongList.slice();
        tmp.push(newList);
        this.setState({allSongList: tmp});
        localStorage[storageKey] = JSON.stringify(tmp.slice(1));
    }

    addSong2CurrentEditList(index) {
        const editIndex = this.state.editIndex;
        let tmp = this.state.allSongList.slice();
        if (0 < editIndex && editIndex < tmp.length) {
            tmp[this.state.editIndex].list.push(this.state.allSongList[0].list[index]);
            this.setState({allSongList: tmp});
            localStorage[storageKey] = JSON.stringify(tmp.slice(1));
        }
    }

    setEditIndex(index) {
        this.setState({editIndex: index});
    }

    setSticky(mode) {
        const main = document.getElementById("main");
        switch(mode) {
            case "play":
                // mainにposition: sticky付与
                main.className = "mainSticky";
                break;
            case "edit":
                // mainのposition: sticky削除
                main.className = "mainNonSticky";
                break;
        }
    }

    setCurrentListName(newName) {
        let tmp = this.state.allSongList.slice();
        const currentIndex = this.state.editIndex;
        if (0 < currentIndex && currentIndex < tmp.length) {
            tmp[currentIndex].name = newName;
            this.setState({allSongList: tmp});
            localStorage[storageKey] = JSON.stringify(tmp.slice(1));
        }
    }

    removeCurrentSongList() {
        const index = this.state.editIndex;
        if (0 < index && index < this.state.allSongList.length) {
            let tmp = this.state.allSongList.slice();
            tmp.splice(index, 1);
            const currentIndex = this.state.editIndex;
            this.setState({allSongList: tmp, editIndex: currentIndex - 1});
            localStorage[storageKey] = JSON.stringify(tmp.slice(1));
        }
    }

    swapUp(index) {
        let tmp = this.state.allSongList.slice();
        const currentIndex = this.state.editIndex;
        if (0 < currentIndex && currentIndex < tmp.length
            && 0 < index && index < tmp[currentIndex].list.length) {
            const tmpElem = tmp[currentIndex].list[index - 1];
            tmp[currentIndex].list[index - 1] = tmp[currentIndex].list[index];
            tmp[currentIndex].list[index] = tmpElem;
            this.setState({allSongList: tmp});
            localStorage[storageKey] = JSON.stringify(tmp.slice(1));
        }
    }

    swapDown(index) {
        let tmp = this.state.allSongList.slice();
        const currentIndex = this.state.editIndex;
        if (0 < currentIndex && currentIndex < tmp.length
            && 0 <= index && index < tmp[currentIndex].list.length - 1) {
            const tmpElem = tmp[currentIndex].list[index + 1];
            tmp[currentIndex].list[index + 1] = tmp[currentIndex].list[index];
            tmp[currentIndex].list[index] = tmpElem;
            this.setState({allSongList: tmp});
            localStorage[storageKey] = JSON.stringify(tmp.slice(1));
        }
    }

    removeSongFromCurrentEditList(index) {
        let tmp = this.state.allSongList.slice();
        const currentIndex = this.state.editIndex;
        if (0 < currentIndex && currentIndex < tmp.length
            && 0 <= index && index < tmp[currentIndex].list.length) {
            tmp[currentIndex].list.splice(index, 1);
            this.setState({allSongList: tmp});
            localStorage[storageKey] = JSON.stringify(tmp.slice(1));
        }
    }

    render() {
/*
        return (
            <div className="wrapper">
                <div className="mainSticky" id="main">
                    <main>
                        {<Player control={this.state.mode=="play"}
                                 setInstance={this.setPlayerInstance}
                                 getInstance={this.getPlayerInstance}
                                 defaultId={this.props.defaultId}
                                 defaultTime={this.props.defaultTime}
                                 jumpTo={this.jumpTo}
                                 setControl={this.setControl}
                                 stopControl={this.stopControl}
                                 setPlayerController={this.setPlayerController}
                                 getCurrentSongList={this.getCurrentSongList}
                                 getSongIndex={this.getSongIndex} />}
                        {this.state.mode == "edit" &&
                         <EditList addNewSongList={this.addNewSongList}
                                   allSongList={this.state.allSongList}
                                   editIndex={this.state.editIndex}
                                   setEditIndex={this.setEditIndex}
                                   setCurrentListName={this.setCurrentListName}
                                   removeCurrentSongList={this.removeCurrentSongList}
                                   swapUp={this.swapUp}
                                   swapDown={this.swapDown}
                                   removeSongFromCurrentEditList={this.removeSongFromCurrentEditList} />}
                    </main>
                </div>
                <div className="aside">
                    <aside>
                        <table cellPadding="15" className="modeTbl">
                            <thead>
                                <tr>
                                    <td><a href="#" onClick={(e) => this.changeMode(e, "play")}>リスト再生</a></td>
                                    <td><a href="#" onClick={(e) => this.changeMode(e, "edit")}>リスト編集</a></td>
                                </tr>
                            </thead>
                        </table>
                        {<SongList allSongList={this.state.allSongList}
                                   listIndex={this.state.listIndex}
                                   onClickListener={this.transPage}
                                   mode={this.state.mode}
                                   setListIndex={this.setListIndex}
                                   addSong={this.addSong2CurrentEditList} />}
                    </aside>
                </div>
            </div>
        );
*/
        return React.createElement("div", {
                 className: "wrapper"
               }, React.createElement("div", {
                 className: "mainSticky",
                 id: "main"
               }, React.createElement("main", null, React.createElement(Player, {
                 control: this.state.mode == "play",
                 setInstance: this.setPlayerInstance,
                 getInstance: this.getPlayerInstance,
                 defaultId: this.props.defaultId,
                 defaultTime: this.props.defaultTime,
                 jumpTo: this.jumpTo,
                 setControl: this.setControl,
                 stopControl: this.stopControl,
                 setPlayerController: this.setPlayerController,
                 getCurrentSongList: this.getCurrentSongList,
                 getSongIndex: this.getSongIndex
               }), this.state.mode == "edit" && React.createElement(EditList, {
                 addNewSongList: this.addNewSongList,
                 allSongList: this.state.allSongList,
                 editIndex: this.state.editIndex,
                 setEditIndex: this.setEditIndex,
                 setCurrentListName: this.setCurrentListName,
                 removeCurrentSongList: this.removeCurrentSongList,
                 swapUp: this.swapUp,
                 swapDown: this.swapDown,
                 removeSongFromCurrentEditList: this.removeSongFromCurrentEditList
               }))), React.createElement("div", {
                 className: "aside"
               }, React.createElement("aside", null, React.createElement("table", {
                 cellPadding: "15",
                 className: "modeTbl"
               }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("td", null, React.createElement("a", {
                 href: "#",
                 onClick: e => this.changeMode(e, "play")
               }, "\u30EA\u30B9\u30C8\u518D\u751F")), React.createElement("td", null, React.createElement("a", {
                 href: "#",
                 onClick: e => this.changeMode(e, "edit")
               }, "\u30EA\u30B9\u30C8\u7DE8\u96C6"))))), React.createElement(SongList, {
                 allSongList: this.state.allSongList,
                 listIndex: this.state.listIndex,
                 onClickListener: this.transPage,
                 mode: this.state.mode,
                 setListIndex: this.setListIndex,
                 addSong: this.addSong2CurrentEditList
               }))));
    }
}
