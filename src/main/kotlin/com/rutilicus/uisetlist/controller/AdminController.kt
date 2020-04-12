package com.rutilicus.uisetlist.controller

import com.rutilicus.uisetlist.Commons
import com.rutilicus.uisetlist.ResourceNotFoundException
import com.rutilicus.uisetlist.model.*
import com.rutilicus.uisetlist.service.MetaTagsService
import com.rutilicus.uisetlist.service.MovieService
import com.rutilicus.uisetlist.service.SongService
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import org.springframework.web.util.UriComponentsBuilder
import java.sql.Date
import java.time.format.DateTimeFormatter
import java.util.*

@Controller
@RequestMapping("admin")
class AdminController(val movieService: MovieService,
                      val songService: SongService,
                      val metaTagsService: MetaTagsService) {
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

    @GetMapping("/movieList")
    fun movieListPage(model: Model): String {
        model.addAttribute("movies", movieService.findAll())
        return "adminMovieList"
    }

    @GetMapping("/songList")
    fun songListPage(model: Model): String {
        model.addAttribute("songs", songService.findAll())
        return "adminSongList"
    }

    @GetMapping("/metaConfig")
    fun metaConfigPage(model: Model): String {
        model.addAttribute("metaTags", metaTagsService.findAll())
        return "metaConfig"
    }

    @GetMapping("/editMovie/{id}")
    fun movieEditPage(
            @PathVariable("id") id: String,
            model: Model): String {
        val data = movieService.findAllByMovieId(id).getOrNull(0) ?: throw ResourceNotFoundException()
        val formatter = DateTimeFormatter.ISO_DATE
        model.addAttribute("originalId", id)
        model.addAttribute("defaultId", id)
        model.addAttribute("defaultName", data.getName())
        model.addAttribute("defaultDate", data.getDate().toLocalDate().format(formatter))
        return "editMovie"
    }

    @GetMapping("/editSong/{idTime}")
    fun songEditPage(
            @PathVariable("idTime") idTime: String,
            model: Model): String {
        val (id, time) = idTime.split(",").let {
            if (it.size != 2 || it[1].toIntOrNull() == null) {
                throw ResourceNotFoundException()
            }
            Pair(it[0], it[1].toInt())
        }

        val data = songService.findAllByMovieIdAndTime(id, time).getOrNull(0) ?: throw ResourceNotFoundException()
        model.addAttribute("originalId", id)
        model.addAttribute("originalTime", time)
        model.addAttribute("defaultId", id)
        model.addAttribute("defaultTime", time)
        model.addAttribute("defaultName", data.getSongName())
        model.addAttribute("defaultWriter", data.getWriter())

        return "editSong"
    }

    @PostMapping("/procAddMovie")
    fun addMovieProc(@ModelAttribute form: AddMovieForm, builder: UriComponentsBuilder): String {
        val id = form.getMovieId()
        val name = form.getMovieName()
        val date = Date.valueOf(form.getDate())

        val movie = Movie()
        movie.setMovieId(id)
        movie.setName(name)
        movie.setDate(date)

        if (movie.getMovieId() == "" || name == "") {
            // パラメータ不正のため失敗
            return "redirect:" +
                    Commons.getPathUriString(
                    builder,
                    "/admin/addMovie",
                    listOf(Pair("error", Optional.empty())))
        }

        try {
            movieService.addMovie(movie)
        } catch (e: Exception) {
            // 登録時に例外発生(既にIDが存在する場合含む)
            return "redirect:" +
                    Commons.getPathUriString(
                            builder,
                            "/admin/addMovie",
                            listOf(Pair("error", Optional.empty())))
        }

        return "redirect:" +
                Commons.getPathUriString(
                        builder,
                        "/admin/addMovie",
                        listOf(Pair("success", Optional.empty())))
    }

    @PostMapping("/procAddSong")
    fun addSongProc(@ModelAttribute form: AddSongForm, builder: UriComponentsBuilder): String {
        val id = form.getMovieId()
        val songName = form.getSongName()
        val time = form.getTime()
        val writer = form.getWriter()

        val song = Song()
        song.setMovieId(id)
        song.setSongName(songName)
        song.setTime(time)
        song.setWriter(writer)

        if (song.getMovieId() == "" || songName == "" || writer == "") {
            // パラメータ不正のため失敗
            return "redirect:" +
                    Commons.getPathUriString(
                            builder,
                            "/admin/addSong",
                            listOf(Pair("error", Optional.empty())))
        }

        try {
            song.setMovie(movieService.findAllByMovieId(id).first())
            songService.addSong(song)
        } catch (e: Exception) {
            // 登録済みデータまたは未登録動画データのため失敗
            return "redirect:" +
                    Commons.getPathUriString(
                            builder,
                            "/admin/addSong",
                            listOf(Pair("error", Optional.empty())))
        }

        return "redirect:" +
                Commons.getPathUriString(
                        builder,
                        "/admin/addSong",
                        listOf(Pair("success", Optional.empty())))
    }

    @PostMapping("/procEditMovie")
    fun editMovieProc(@ModelAttribute form: EditMovieForm, builder: UriComponentsBuilder): String {
        val originalId = form.getOriginalId()
        val newId = form.getMovieId()
        val movies = movieService.findAllByMovieId(originalId)

        if (movies.isEmpty()) {
            // 編集対象の動画が存在しない
            return "redirect:" +
                    Commons.getPathUriString(
                            builder,
                            "/admin/editMovie/$originalId",
                            listOf(Pair("error", Optional.empty())))
        }

        val movie = if (originalId != newId) {
            // 新IDと旧IDが異なるので、一度削除してから登録しなおす
            movieService.deleteByMovieId(originalId)
            Movie().apply { setMovieId(newId) }
        } else {
            movies.first()
        }
        movie.setName(form.getMovieName())
        movie.setDate(Date.valueOf(form.getDate()))

        movieService.entryMovie(movie)

        return "redirect:" +
                Commons.getPathUriString(
                        builder,
                        "/admin/editMovie/$newId",
                        listOf(Pair("success", Optional.empty())))
    }

    @PostMapping("/procEditSong")
    fun editSongProc(@ModelAttribute form: EditSongForm, builder: UriComponentsBuilder): String {
        val originalId = form.getOriginalId()
        val originalTime = form.getOriginalTime()
        val newId = form.getMovieId()
        val newTime = form.getTime()
        val songs = songService.findAllByMovieIdAndTime(originalId, originalTime)

        if (songs.isEmpty()) {
            // 編集対象の歌が存在しない
            return "redirect:" +
                    Commons.getPathUriString(
                            builder,
                            "/admin/editSong/$originalId,$originalTime",
                            listOf(Pair("error", Optional.empty())))
        }

        val song = if (originalId != newId || originalTime != newTime) {
            // 新IDと旧IDが異なるので、一度削除してから登録しなおす
            songService.deleteByMovieIdAndTime(originalId, originalTime)
            Song().apply {
                setMovieId(newId)
                setTime(newTime)
                try {
                    setMovie(movieService.findAllByMovieId(newId).first())
                } catch (e: Exception) {
                    // 親動画取得失敗
                    return "redirect:" +
                            Commons.getPathUriString(
                                    builder,
                                    "/admin/editSong/$originalId,$originalTime",
                                    listOf(Pair("error", Optional.empty())))
                }
            }
        } else {
            songs.first()
        }

        song.setSongName(form.getSongName())
        song.setWriter(form.getWriter())

        songService.entrySong(song)

        return "redirect:" +
                Commons.getPathUriString(
                        builder,
                        "/admin/editSong/$newId,$newTime",
                        listOf(Pair("success", Optional.empty())))
    }

    @PostMapping("/procDelMovie")
    fun delMovieProc(@ModelAttribute form: DelMovieForm, builder: UriComponentsBuilder): String {
        val id = form.getMovieId()

        val movies = movieService.findAllByMovieId(id)

        if (movies.isEmpty() || movies.first().getSongs().isNotEmpty()) {
            // 削除対象の動画が存在しないまたは動画に結び付く歌が存在する
            return "redirect:" +
                    Commons.getPathUriString(
                            builder,
                            "/admin/movieList",
                            listOf(Pair("error", Optional.empty())))
        }

        movieService.deleteByMovieId(id)

        return "redirect:" +
                Commons.getPathUriString(
                        builder,
                        "/admin/movieList",
                        listOf(Pair("success", Optional.empty())))
    }

    @PostMapping("/procDelSong")
    fun delSongProc(@ModelAttribute form: DelSongForm, builder: UriComponentsBuilder): String {
        val id = form.getMovieId()
        val time = form.getTime()

        val songs = songService.findAllByMovieIdAndTime(id, time)

        if (songs.isEmpty()) {
            // 削除対象の歌が存在しない
            return "redirect:" +
                    Commons.getPathUriString(
                            builder,
                            "/admin/songList",
                            listOf(Pair("error", Optional.empty())))
        }

        songService.deleteByMovieIdAndTime(id, time)

        return "redirect:" +
                Commons.getPathUriString(
                        builder,
                        "/admin/songList",
                        listOf(Pair("success", Optional.empty())))
    }

    @PostMapping("/procAddMeta")
    fun addMetaProc(@ModelAttribute form: AddMetaForm, builder: UriComponentsBuilder): String {
        val name = form.getName()
        val content = form.getContent()

        if (name.isBlank() || content.isBlank()) {
            // パラメータ不正のため失敗
            return "redirect:" +
                    Commons.getPathUriString(
                            builder,
                            "/admin/metaConfig",
                            listOf(Pair("addError", Optional.empty())))
        }

        try {
            MetaTags().apply {
                this.setName(name)
                this.setContent(content)
                metaTagsService.addMetaTag(this)
            }
        } catch (e: Exception) {
            return "redirect:" +
                    Commons.getPathUriString(
                            builder,
                            "/admin/metaConfig",
                            listOf(Pair("addError", Optional.empty())))
        }

        return "redirect:" +
                Commons.getPathUriString(
                        builder,
                        "/admin/metaConfig",
                        listOf(Pair("addSuccess", Optional.empty())))
    }

    @PostMapping("/procDelMeta")
    fun delMetaProc(@ModelAttribute form: DelMetaForm, builder: UriComponentsBuilder): String {
        val name = form.getName()

        val metaTags = metaTagsService.findAllByName(name)

        if (metaTags.isEmpty()) {
            return "redirect:" +
                    Commons.getPathUriString(
                            builder,
                            "/admin/metaConfig",
                            listOf(Pair("deleteError", Optional.empty())))
        }

        metaTagsService.deleteByName(name)

        return "redirect:" +
                Commons.getPathUriString(
                        builder,
                        "/admin/metaConfig",
                        listOf(Pair("deleteSuccess", Optional.empty())))
    }
}
