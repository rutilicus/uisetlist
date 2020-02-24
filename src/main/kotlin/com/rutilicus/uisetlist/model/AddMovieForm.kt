package com.rutilicus.uisetlist.model

import java.sql.Date

class AddMovieForm {
    private var movieId = ""
    private var movieName = ""
    private var date = Date(0L)

    fun getMovieId() = movieId
    fun getMovieName() = movieName
    fun getDate() = date
    fun setMovieId(movieId: String) {
        this.movieId = movieId
    }
    fun setMovieName(movieName: String) {
        this.movieName = movieName
    }
    fun setDate(date: Date) {
        this.date = date
    }
}
