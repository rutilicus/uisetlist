'use strict';

const e = React.createElement;

class SongElem extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick = (e) => {
        e.preventDefault();
        transPage(this.props.movieId, this.props.time);
    }

    render() {
        return e("tr", null,
                 e("td", null,
                   e("div", null,
                     e("a",
                       { href: "javascript:void(0)",
                         onClick: this.handleClick,
                         className: "songName"
                       },
                       this.props.songName)),
                     e("div",
                       { className: "artist" },
                       this.props.writer),
                     e("div",
                       { className: "movieName" },
                       this.props.movieName)),
                   e("td",
                     { style: {display: "none"},
                       className: "movieId"
                     },
                     this.props.movieId),
                   e("td",
                     { style: {display: "none"},
                       className: "time"
                     },
                     this.props.time),
                   e("td",
                     { style: {display: "none"},
                       className: "endTime"
                     },
                     this.props.endTime));
    }
}

// Find all DOM containers, and render Like buttons into them.
document.querySelectorAll('.song_elem_container')
    .forEach(domContainer => {
        const movieId = domContainer.dataset.movieid;
        const time = parseInt(domContainer.dataset.time, 10);
        const songName = domContainer.dataset.songname;
        const writer = domContainer.dataset.writer;
        const movieName = domContainer.dataset.moviename;
        const endTime = parseInt(domContainer.dataset.endtime, 10);
        ReactDOM.render(
            e(SongElem,
              {
                movieId: movieId,
                time: time,
                songName: songName,
                writer: writer,
                movieName: movieName,
                endTime: endTime
              }),
              domContainer
        );
    });
