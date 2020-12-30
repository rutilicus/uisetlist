'use strict';

/*
 * dependencies: song_elem.js
 */

class SongList extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.props.setListIndex(event.target.value);
    }

    render() {
        return (
            <div>
                {(this.props.mode == "play") &&
                 (<select className="songListSelect"
                          onChange={this.onChange}
                          defaultValue={this.props.listIndex}>
                  {this.props.allSongList.map((list, index) => {
                    return <option key={index} value={index}>{list.name}</option>
                  })}
                  </select>)}
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
                        {this.props.allSongList[this.props.mode == "play" ? this.props.listIndex : 0].list.map((song, index) => {
                            const props = Object.assign(song,
                                                        { key: index,
                                                          index: index,
                                                          onClickListener: this.props.onClickListener,
                                                          buttonList: this.props.mode == "edit" ? [{text: "Add", onClick: this.props.addSong}] : [],
                                                          linkEnable: true });
                            return <SongElem {...props } />;
                            })}
                    </tbody>
                </table>
            </div>
        );
    }
}
