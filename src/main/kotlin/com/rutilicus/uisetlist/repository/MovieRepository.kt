package com.rutilicus.uisetlist.repository

import com.rutilicus.uisetlist.model.Movie
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MovieRepository: JpaRepository<Movie, Int> {
    fun findByMovieIdIsOrderBySongs_TimeAsc(movieId: String): List<Movie>
}
