'use strict';

class SongElem extends React.Component {
    constructor(props) {
        super(props);
        this.e = React.createElement;
    }

    handleClick = (e) => {
        e.preventDefault();
        this.props.onClickListener(this.props);
    }

    render() {
        return this.e("tr", null,
                      this.e("td", null,
                             this.e("div", null,
                                    this.e("a",
                                           { href: "javascript:void(0)",
                                             onClick: this.handleClick,
                                             className: "songName"
                                           },
                                           this.props.songName)),
                             this.e("div",
                                    { className: "artist" },
                                    this.props.writer),
                             this.e("div",
                                    { className: "movieName" },
                                    this.props.movieName)),
                      this.e("td",
                             { style: {display: "none"},
                               className: "movieId"
                             },
                             this.props.movieId),
                      this.e("td",
                             { style: {display: "none"},
                               className: "time"
                             },
                             this.props.time),
                      this.e("td",
                             { style: {display: "none"},
                               className: "endTime"
                             },
                             this.props.endTime));
    }
}
