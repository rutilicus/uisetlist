package com.rutilicus.uisetlist.model

import javax.validation.constraints.NotNull

class AddSongForm {
    @NotNull
    private var movieId = ""
    @NotNull
    private var time = 0
    @NotNull
    private var songName = ""
    @NotNull
    private var writer = ""

    fun getMovieId() = movieId
    fun getTime() = time
    fun getSongName() = songName
    fun getWriter() = writer

    fun setMovieId(movieId: String) {
        this.movieId = movieId
    }
    fun setTime(time: Int?) {
        if (time != null) {
            this.time = time
        }
    }
    fun setSongName(songName: String) {
        this.songName = songName
    }
    fun setWriter(writer: String) {
        this.writer = writer
    }
}
