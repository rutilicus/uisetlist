package com.rutilicus.uisetlist.controller

import com.rutilicus.uisetlist.Commons
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.util.UriComponentsBuilder

@Controller
@RequestMapping("song")
class SongController() {
    @GetMapping("/**")
    fun songPage(builder: UriComponentsBuilder): String {
        return "redirect:" + Commons.getPathUriString(builder, "/")
    }
}
