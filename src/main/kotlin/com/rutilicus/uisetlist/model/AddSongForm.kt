package com.rutilicus.uisetlist.model

class AddSongForm {
    private var movieId = ""
    private var time = 0
    private var songName = ""
    private var writer = ""

    fun getMovieId() = movieId
    fun getTime() = time
    fun getSongName() = songName
    fun getWriter() = writer

    fun setMovieId(movieId: String) {
        this.movieId = movieId
    }
    fun setTime(time: Int) {
        this.time = time
    }
    fun setSongName(songName: String) {
        this.songName = songName
    }
    fun setWriter(writer: String) {
        this.writer = writer
    }
}
