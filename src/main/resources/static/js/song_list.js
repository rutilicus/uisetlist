'use strict';

/* HTMLファイル側でsong_elem.jsを事前読み込みの必要あり。 */

class SongList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { songs: [] };
        this.e = React.createElement;
    }

    initSongs(songInfoList) {
        this.setState( { songs: songInfoList });
    }

    addSong(songInfo) {
        let newArr = this.state.songs.slice();
        newArr.push(songInfo);
        this.setState({ songs: newArr });
    }

    setOnClickListener(listener) {
        this.listener = listener;
    }

    render() {
        return this.e("table",
                      { border: 1, id: this.props.idName, class: this.props.className},
                      this.e("thead", null,
                             this.e("tr", null,
                                    this.e("th", null,
                                           this.e("div", { class: "songName" },
                                                  "Song Name"),
                                           this.e("div", { class: "artist" },
                                                  "Original Artist"),
                                           this.e("div", { class: "movieName" },
                                                  "Movie Name")))),
                             this.e("tbody", null,
                                    this.state.songs.map((song, index) => {
                                        return this.e(
                                            SongElem,
                                            Object.assign(song,
                                                          { index: index,
                                                            onClickListener: this.listener })
                                        );
                                    })));
    }
}
