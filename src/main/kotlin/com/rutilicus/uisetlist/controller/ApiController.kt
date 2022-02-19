package com.rutilicus.uisetlist.controller

import com.rutilicus.uisetlist.service.MovieService
import com.rutilicus.uisetlist.service.SongService
import org.springframework.http.MediaType
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import java.sql.Date

@Controller
@RequestMapping("api")
@CrossOrigin
class ApiController(val movieService: MovieService,
                    val songService: SongService) {
    data class Movie(val movieId: String,
                     val name: String,
                     val date: Date)
    data class Song(val time: Int,
                    val endTime: Int,
                    val songName: String,
                    val artist: String,
                    val movie: Movie)

    @GetMapping("/movie", produces = [MediaType.APPLICATION_JSON_VALUE])
    @ResponseBody
    fun getMovie(): List<Movie> {
        return movieService.findAll().map {
            Movie(it.movieId, it.name, it.date)
        }
    }

    @GetMapping("/song", produces = [MediaType.APPLICATION_JSON_VALUE])
    @ResponseBody
    fun getSong(): List<Song> {
        return songService.findAll().map {
            Song(it.time, it.endTime, it.songName, it.writer,
                 Movie(it.movie.movieId, it.movie.name, it.movie.date)
            )
        }
    }
}
