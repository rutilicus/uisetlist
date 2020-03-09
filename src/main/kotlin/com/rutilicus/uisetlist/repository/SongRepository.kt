package com.rutilicus.uisetlist.repository

import com.rutilicus.uisetlist.model.Song
import com.rutilicus.uisetlist.model.SongKey
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SongRepository: JpaRepository<Song, SongKey> {
    fun findByMovieIdIsOrderByTimeAsc(movieId: String): List<Song>
    fun findByMovieIdAndTime(movieId: String, time: Int): List<Song>
}
