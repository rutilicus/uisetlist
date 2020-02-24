package com.rutilicus.uisetlist.controller

import com.rutilicus.uisetlist.service.SongService
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("song")
class SongController(val service: SongService) {
    @GetMapping("/")
    fun songPage(model: Model): String {
        model.addAttribute("songs", service.findAll())
        return "song"
    }
}
