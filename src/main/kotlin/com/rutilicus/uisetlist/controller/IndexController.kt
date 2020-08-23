package com.rutilicus.uisetlist.controller

import com.rutilicus.uisetlist.Commons
import com.rutilicus.uisetlist.service.MetaTagsService
import com.rutilicus.uisetlist.service.MovieService
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.util.UriComponentsBuilder

@Controller
@RequestMapping("/")
class IndexController(val movieService: MovieService, val metaTagsService: MetaTagsService) {
    @GetMapping("/")
    fun movie(model: Model): String {
        model.addAttribute("movies", movieService.findAll())
        model.addAttribute("metaTags", metaTagsService.findAll())
        return "index"
    }

    @GetMapping("/song")
    fun song(builder: UriComponentsBuilder): String {
        return "redirect:" + Commons.getPathUriString(builder, "/song/")
    }

    @GetMapping("/admin")
    fun admin(builder: UriComponentsBuilder): String {
        return "redirect:" + Commons.getPathUriString(builder, "/admin/")
    }

    @GetMapping("/initUser")
    fun initUser(builder: UriComponentsBuilder): String {
        return "redirect:" + Commons.getPathUriString(builder, "/initUser/")
    }
}
