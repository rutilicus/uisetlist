package com.rutilicus.uisetlist.service

import com.rutilicus.uisetlist.model.Song
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
}
