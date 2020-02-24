package com.rutilicus.uisetlist.controller

import com.rutilicus.uisetlist.service.MovieService
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/")
class IndexController(val service: MovieService) {
    @GetMapping("/")
    fun movie(model: Model): String {
        model.addAttribute("movies", service.findAll())
        return "index"
    }
}
