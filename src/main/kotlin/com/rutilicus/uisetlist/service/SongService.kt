package com.rutilicus.uisetlist.service

import com.rutilicus.uisetlist.model.Song
import com.rutilicus.uisetlist.model.SongKey
import com.rutilicus.uisetlist.repository.SongRepository
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class SongService(private val songRepository: SongRepository) {
    fun findAll(): List<Song> {
        val sort = Sort.by(Sort.Direction.DESC, "movie_date").and(Sort.by(Sort.Direction.ASC, "time"))
        return songRepository.findAll(sort)
    }

    fun findAllByMovieIdAndTime(movieId: String, time: Int): List<Song> {
        return songRepository.findByMovieIdAndTime(movieId, time)
    }

    fun entrySong(song: Song): Song {
        return songRepository.saveAndFlush(song)
    }

    fun addSong(song: Song): Song {
        if (findAllByMovieIdAndTime(song.movieId, song.time).isNotEmpty()) {
            throw Exception("Already Exists Id And Time.")
        }
        return entrySong(song)
    }

    fun deleteByMovieIdAndTime(id: String, time: Int) {
        songRepository.deleteById(SongKey().apply {
            this.movieId = id
            this.time = time
        })
    }
}
