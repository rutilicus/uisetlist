'use strict';

/*
 * dependencies: song_elem.js
 */

class SongList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
/*
        return (
            <table border="1" className="songTbl">
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
                    {this.props.allSongList[0].list.map((song, index) => {
                        const props = Object.assign(song,
                                                    { index: index,
                                                      onClickListener: this.props.onClickListener });
                        return <SongElem {...props } />;
                        })}
                </tbody>
            </table>
        );
*/
        return React.createElement("table", {
                 border: "1",
                 className: "songTbl"
               }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, React.createElement("div", {
                 className: "songName"
               }, "Song Name"), React.createElement("div", {
                 className: "artist"
               }, "Original Artist"), React.createElement("div", {
                 className: "movieName"
               }, "Movie Name")))), React.createElement("tbody", null, this.props.allSongList[0].list.map((song, index) => {
                 const props = Object.assign(song, {
                   index: index,
                   onClickListener: this.props.onClickListener
                 });
                 return React.createElement(SongElem, props);
               })));
    }
}
