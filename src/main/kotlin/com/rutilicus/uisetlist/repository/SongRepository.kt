package com.rutilicus.uisetlist.repository

import com.rutilicus.uisetlist.model.Song
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SongRepository: JpaRepository<Song, Int> {
    fun findByMovieIdIsOrderByTimeAsc(movieId: String): List<Song>
}