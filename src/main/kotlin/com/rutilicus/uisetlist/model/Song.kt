package com.rutilicus.uisetlist.model

import com.rutilicus.uisetlist.Constants.Companion.ID_LEN
import javax.persistence.*

@Entity
@Table(name = "song")
@IdClass(value = SongKey::class)
class Song {
    @Id
    @Column(name = "movieid")
    private var movieId = ""

    @Id
    @Column(name = "time")
    private var time = 0

    @Column(name = "songname")
    private var songName = ""

    @Column(name = "writer")
    private var writer = ""

    @ManyToOne
    @JoinColumn(name = "movieid", insertable = false, updatable = false)
    private var movie = Movie()

    fun getMovieId() = movieId
    fun setMovieId(id: String) {
        if (id.length == ID_LEN) {
            this.movieId = id
        }
    }

    fun getTime() = time
    fun setTime(time: Int) {
        this.time = time
    }

    fun getSongName() = songName
    fun setSongName(songName: String) {
        this.songName = songName
    }

    fun getWriter() = writer
    fun setWriter(writer: String) {
        this.writer = writer
    }

    fun getMovie() = movie
    fun setMovie(movie: Movie) {
        this.movie = movie
    }
}