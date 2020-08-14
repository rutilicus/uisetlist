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
                        {this.props.linkEnable &&
                         <a href="#" onClick={this.handleClick} className="songName">
                            {this.props.songName}
                         </a>}
                        {!this.props.linkEnable && this.props.songName}
                    </div>
                    <div className="artist">
                        {this.props.writer}
                    </div>
                    <div className="movieName">
                        {this.props.movieName}
                    </div>
                    {this.props.buttonList.map((button, index) => {
                        return <button key={index}
                                       type="button"
                                       onClick={(e) => button.onClick(this.props.index)}>
                            {button.text}
                        </button>;
                    })}
                </td>
            </tr>
        );
*/
        return React.createElement("tr", null, React.createElement("td", null, React.createElement("div", null, this.props.linkEnable && React.createElement("a", {
                 href: "#",
                 onClick: this.handleClick,
                 className: "songName"
               }, this.props.songName), !this.props.linkEnable && this.props.songName), React.createElement("div", {
                 className: "artist"
               }, this.props.writer), React.createElement("div", {
                 className: "movieName"
               }, this.props.movieName), this.props.buttonList.map((button, index) => {
                 return React.createElement("button", {
                   key: index,
                   type: "button",
                   onClick: e => button.onClick(this.props.index)
                 }, button.text);
               })));
    }
}
