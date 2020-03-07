package com.rutilicus.uisetlist.model

import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import javax.validation.constraints.NotNull

class AddMovieForm {
    @NotNull
    private var movieId = ""
    @NotNull
    private var movieName = ""
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private var date = LocalDate.ofEpochDay(0L)

    fun getMovieId() = movieId
    fun getMovieName() = movieName
    fun getDate() = date
    fun setMovieId(movieId: String) {
        this.movieId = movieId
    }
    fun setMovieName(movieName: String) {
        this.movieName = movieName
    }
    fun setDate(date: LocalDate?) {
        if (date != null) {
            this.date = date
        }
    }
}
