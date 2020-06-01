package com.rutilicus.uisetlist.controller

import com.rutilicus.uisetlist.ResourceNotFoundException
import com.rutilicus.uisetlist.service.MovieService
import com.rutilicus.uisetlist.service.SongService
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam

@Controller
@RequestMapping("song")
class SongController(val songService: SongService, val movieService: MovieService) {
    @GetMapping("/")
    fun songPage(
            @RequestParam(name = "id", required = false, defaultValue = "") id: String,
            @RequestParam(name = "time", required = false, defaultValue = "") time: String,
            model: Model): String {
        if (id.isNotEmpty()) {
            movieService.findAllByMovieId(id).getOrNull(0) ?: throw ResourceNotFoundException()
        }
        model.addAttribute("songs", songService.findAll())
        model.addAttribute("id", id)
        model.addAttribute("time", time.toIntOrNull())
        return "songApp"
    }
}
