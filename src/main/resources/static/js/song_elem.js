'use strict';

class SongElem extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick = (e) => {
        e.preventDefault();
        this.props.onClickListener(this.props);
    }

    render() {
/*
        return (
            <tr>
                <td>
                    <div>
                        <a href="#" onClick={this.handleClick} className="songName">
                            {this.props.songName}
                        </a>
                    </div>
                    <div className="artist">
                        {this.props.writer}
                    </div>
                    <div className="movieName">
                        {this.props.movieName}
                    </div>
                </td>
            </tr>
        );
*/
        return React.createElement("tr", null, React.createElement("td", null, React.createElement("div", null, React.createElement("a", {
                 href: "#",
                 onClick: this.handleClick,
                 className: "songName"
               }, this.props.songName)), React.createElement("div", {
                 className: "artist"
               }, this.props.writer), React.createElement("div", {
                 className: "movieName"
               }, this.props.movieName)));
    }
}
