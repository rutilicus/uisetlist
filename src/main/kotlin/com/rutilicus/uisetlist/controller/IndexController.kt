package com.rutilicus.uisetlist.controller

import com.rutilicus.uisetlist.Commons
import com.rutilicus.uisetlist.service.MetaTagsService
import com.rutilicus.uisetlist.service.MovieService
import org.springframework.http.MediaType
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.util.UriComponentsBuilder
import javax.servlet.http.HttpServletRequest

@Controller
@RequestMapping("/")
class IndexController(val movieService: MovieService,
                      val metaTagsService: MetaTagsService) {
    @GetMapping("/")
    fun movie(model: Model): String {
        model.addAttribute("metaTags", metaTagsService.findAll())
        return "index"
    }

    @GetMapping("/song")
    fun song(builder: UriComponentsBuilder): String {
        return "redirect:" + Commons.getPathUriString(builder, "/")
    }

    @GetMapping("/admin")
    fun admin(builder: UriComponentsBuilder): String {
        return "redirect:" + Commons.getPathUriString(builder, "/admin/")
    }

    @GetMapping("/initUser")
    fun initUser(builder: UriComponentsBuilder): String {
        return "redirect:" + Commons.getPathUriString(builder, "/initUser/")
    }

    @GetMapping("/sitemap.xml", produces = [MediaType.APPLICATION_XML_VALUE])
    @ResponseBody
    fun siteMap(request: HttpServletRequest): String {
        // 更新日取得のため、データ一覧を取得
        val movies = movieService.findAll()

        var ret = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        ret += "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">"
        ret += "<url>"
        ret += "<loc>${request.scheme}://${request.serverName}/</loc>"
        ret += "<lastmod>${if (movies.isNotEmpty()) movies[0].date.toString() else "1970-01-01"}</lastmod>"
        ret += "<changefreq>weekly</changefreq>"
        ret += "<priority>1.0</priority>"
        ret += "</url>"
        ret += "</urlset>"
        return ret
    }
}
