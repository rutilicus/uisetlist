package com.rutilicus.uisetlist.model

import com.rutilicus.uisetlist.Constants
import java.io.Serializable

class SongKey : Serializable {
    private var movieId = ""
    private var time = 0

    fun getMovieId() = movieId
    fun setMovieId(id: String) {
        if (id.length == Constants.ID_LEN) {
            this.movieId = id
        }
    }

    fun getTime() = time
    fun setTime(time: Int) {
        this.time = time
    }
}
