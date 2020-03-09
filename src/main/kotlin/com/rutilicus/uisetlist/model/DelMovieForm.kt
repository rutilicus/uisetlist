package com.rutilicus.uisetlist.model

import javax.validation.constraints.NotNull

class DelMovieForm {
    @NotNull
    private var movieId = ""

    fun getMovieId() = movieId
    fun setMovieId(movieId: String) {
        this.movieId = movieId
    }
}
