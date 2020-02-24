package com.rutilicus.uisetlist.controller

import com.rutilicus.uisetlist.model.AddMovieForm
import com.rutilicus.uisetlist.model.AddSongForm
import com.rutilicus.uisetlist.model.Movie
import com.rutilicus.uisetlist.model.Song
import com.rutilicus.uisetlist.service.MovieService
import com.rutilicus.uisetlist.service.SongService
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("admin")
class AdminController(val movieService: MovieService, val songService: SongService) {
    @GetMapping("/")
    fun adminPage(model: Model): String {
        return "admin"
    }

    @GetMapping("/addMovie")
    fun addMoviePage(model: Model): String {
        return "addMovie"
    }

    @GetMapping("/addSong")
    fun addSongPage(model: Model): String {
        return "addSong"
    }

    @PostMapping("/procAddMovie")
    fun addMovieProc(@ModelAttribute form: AddMovieForm, model: Model): String {
        val id = form.getMovieId()
        val name = form.getMovieName()
        val date = form.getDate()

        val movie = Movie()
        movie.setMovieId(id)
        movie.setName(name)
        movie.setDate(date)

        if (movie.getMovieId() == "") {
            // 動画ID不正のため失敗
            return "redirect:/admin/addMovie?error"
        }

        try {
            movieService.addMovie(movie)
        } catch (e: Exception) {
            // 登録時に例外発生(既にIDが存在する場合含む)
            return "redirect:/admin/addMovie?error"
        }

        return "redirect:/admin/addMovie?success"
    }

    @PostMapping("/procAddSong")
    fun addSongProc(@ModelAttribute form: AddSongForm, model: Model): String {
        val id = form.getMovieId()
        val songName = form.getSongName()
        val time = form.getTime()
        val writer = form.getWriter()

        val song = Song()
        song.setMovieId(id)
        song.setSongName(songName)
        song.setTime(time)
        song.setWriter(writer)

        if (song.getMovieId() == "") {
            // 動画ID不正のため失敗
            return "redirect:/admin/addSong?error"
        }

        try {
            song.setMovie(movieService.findAllByMovieId(id).first())
            songService.addSong(song)
        } catch (e: Exception) {
            // 登録済みデータまたは未登録動画データのため失敗
            return "redirect:/admin/addSong?error"
        }

        return "redirect:/admin/addSong?success"
    }
}
