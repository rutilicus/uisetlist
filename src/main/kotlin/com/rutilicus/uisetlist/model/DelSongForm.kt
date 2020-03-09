package com.rutilicus.uisetlist.model

import javax.validation.constraints.NotNull

class DelSongForm {
    @NotNull
    private var movieId = ""

    @NotNull
    private var time = 0

    fun getMovieId() = movieId
    fun getTime() = time

    fun setMovieId(movieId: String) {
        this.movieId = movieId
    }

    fun setTime(time: Int) {
        this.time = time
    }
}
