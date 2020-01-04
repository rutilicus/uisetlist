package com.rutilicus.uisetlist.model

import com.rutilicus.uisetlist.Constants.Companion.ID_LEN
import java.sql.Date
import javax.persistence.*

@Entity
@Table(name = "movie")
class Movie {

    @Id
    @Column(name = "movieid")
    private var movieId = ""

    @Column(name = "name")
    private var name = ""

    @Column(name = "date")
    private var date = Date(0L)

    @OneToMany(mappedBy = "movie")
    private var songs = listOf<Song>()

    fun getMovieId() = movieId
    fun setMovieId(id: String) {
        if (id.length == ID_LEN) {
            this.movieId = id
        }
    }

    fun getName() = name
    fun setName(name: String) {
        this.name = name
    }

    fun getDate() = date
    fun setDate(date: Date) {
        this.date = date
    }

    fun getSongs() = songs
}