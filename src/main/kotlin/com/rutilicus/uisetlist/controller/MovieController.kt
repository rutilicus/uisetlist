package com.rutilicus.uisetlist.controller

import com.rutilicus.uisetlist.ResourceNotFoundException
import com.rutilicus.uisetlist.service.MovieService
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam

@Controller
@RequestMapping("movie")
class MovieController(val service: MovieService) {
    @GetMapping("/{id}")
    fun moviePage(
            @RequestParam(name = "time", required = false, defaultValue = "") time: String,
            @PathVariable("id") id: String,
            model: Model): String {
        val data = service.findAllByMovieId(id).getOrNull(0) ?: throw ResourceNotFoundException()
        model.addAttribute("time", time.toIntOrNull())
        model.addAttribute("id", id)
        model.addAttribute("name", data.getName())
        model.addAttribute("songs", data.getSongs())
        return "movie"
    }
}
