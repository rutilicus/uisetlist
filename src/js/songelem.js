'use strict';

class SongElem extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        this.props.onClickListener(this.props);
    }

    render() {
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
    }
}
