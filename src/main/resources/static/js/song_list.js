'use strict';

/*
 * dependencies: song_elem.js
 */

class SongList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { songs: [] };
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
/*
        return (
            <table border="1" id={this.props.idName} className={this.props.className}>
                <thead>
                    <tr>
                        <th>
                            <div className="songName">Song Name</div>
                            <div className="artist">Original Artist</div>
                            <div className="movieName">Movie Name</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.songs.map((song, index) => {
                        return React.createElement(
                             SongElem,
                             Object.assign(song,
                                           { index: index,
                                             onClickListener: this.listener })
                        );})}
                </tbody>
            </table>
        );
*/
        return React.createElement("table", {
                 border: "1",
                 id: this.props.idName,
                 className: this.props.className
               }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, React.createElement("div", {
                 className: "songName"
               }, "Song Name"), React.createElement("div", {
                 className: "artist"
               }, "Original Artist"), React.createElement("div", {
                 className: "movieName"
               }, "Movie Name")))), React.createElement("tbody", null, this.state.songs.map((song, index) => {
                 return React.createElement(SongElem, Object.assign(song, {
                   index: index,
                   onClickListener: this.listener
                 }));
               })));
    }
}
