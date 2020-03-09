package com.rutilicus.uisetlist.service

import com.rutilicus.uisetlist.model.Movie
import com.rutilicus.uisetlist.repository.MovieRepository
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class MovieService(private val movieRepository: MovieRepository) {
    fun findAll(): List<Movie> {
        val sort = Sort.by(Sort.Direction.DESC, "date")
        return movieRepository.findAll(sort)
    }

    fun findAllByMovieId(id: String): List<Movie> {
        return movieRepository.findByMovieIdIsOrderBySongs_TimeAsc(id)
    }

    fun entryMovie(movie: Movie): Movie {
        return movieRepository.saveAndFlush(movie)
    }

    fun addMovie(movie: Movie): Movie {
        if (findAllByMovieId(movie.getMovieId()).isNotEmpty()) {
            throw Exception("Already Exists Id.")
        }
        return entryMovie(movie)
    }

    fun deleteByMovieId(id: String) {
        movieRepository.deleteById(id)
    }
}
