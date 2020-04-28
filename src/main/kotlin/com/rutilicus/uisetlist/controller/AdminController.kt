package com.rutilicus.uisetlist.controller

import com.rutilicus.uisetlist.Commons
import com.rutilicus.uisetlist.ResourceNotFoundException
import com.rutilicus.uisetlist.model.*
import com.rutilicus.uisetlist.service.MetaTagsService
import com.rutilicus.uisetlist.service.MovieService
import com.rutilicus.uisetlist.service.SongService
import com.rutilicus.uisetlist.service.UserdataService
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import org.springframework.web.util.UriComponentsBuilder
import java.io.File
import java.nio.file.Files
import java.sql.Date
import java.time.format.DateTimeFormatter
import java.util.*

@Controller
@RequestMapping("admin")
class AdminController(val movieService: MovieService,
                      val songService: SongService,
                      val metaTagsService: MetaTagsService,
                      val userdataService: UserdataService) {
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
        model.addAttribute("defaultName", data.name)
        model.addAttribute("defaultDate", data.date.toLocalDate().format(formatter))
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
        model.addAttribute("defaultEndTime", data.endTime)
        model.addAttribute("defaultName", data.songName)
        model.addAttribute("defaultWriter", data.writer)

        return "editSong"
    }

    @GetMapping("/databaseDump")
    fun dbDumpPage(model: Model, builder: UriComponentsBuilder): String {
        try {
            // ファイル出力先ディレクトリ作成
            File("/admin/dbDump").apply {
                if (!this.exists() && !this.mkdirs()) {
                    throw Exception("mkdirs Failed.")
                }
            }

            // 動画一覧csv出力
            movieService.findAll().apply {
                val stringBuilder = StringBuilder()
                stringBuilder.append("movieid,name,date\n")
                this.forEach {
                    stringBuilder.append("\"${it.movieId}\",\"${it.name}\",\"${it.date}\"\n")
                }
                Commons.writeFile("/admin/dbDump/movie.csv", stringBuilder.toString())
            }

            // 歌一覧csv出力
            songService.findAll().apply {
                val stringBuilder = StringBuilder()
                stringBuilder.append("movieid,time,endTime,songname,writer\n")
                this.forEach {
                    stringBuilder.append("\"${it.movieId}\",\"${it.time}\",\"${it.endTime}\",\"${it.songName}\",\"${it.writer}\"\n")
                }
                Commons.writeFile("/admin/dbDump/song.csv", stringBuilder.toString())
            }

            // ユーザーデータcsv出力
            userdataService.findAll().apply {
                val stringBuilder = StringBuilder()
                stringBuilder.append("username,password\n")
                this.forEach {
                    stringBuilder.append("\"${it.username}\",\"${it.password}\"\n")
                }
                Commons.writeFile("/admin/dbDump/userdata.csv", stringBuilder.toString())
            }

            // metaタグデータcsv出力
            metaTagsService.findAll().apply {
                val stringBuilder = StringBuilder()
                stringBuilder.append("name,content\n")
                this.forEach {
                    stringBuilder.append("\"${it.name}\",\"${it.content}\"\n")
                }
                Commons.writeFile("/admin/dbDump/metatags.csv", stringBuilder.toString())
            }

            // zipファイル生成
            Commons.zip(
                    "/admin/dbDump/dbDump.zip",
                    "/admin/dbDump",
                    listOf("movie.csv", "song.csv", "userdata.csv", "metatags.csv"))
        } catch (e: Exception) {
            model.addAttribute("trace", e.message)
            return "adminFailDump"
        }

        return "redirect:" + Commons.getPathUriString(builder, "/admin/dbDump/dbDump.zip")
    }

    @GetMapping("/dbDump/dbDump.zip")
    fun getDumpZip(): ResponseEntity<ByteArray> {
        val header = HttpHeaders()
        header.add("Content-Type", "text/csv")
        header.add(
                "Content-Disposition",
                "Content-Disposition: attachment; filename=\"dbDump.zip\"")
        return ResponseEntity(
                Files.readAllBytes(File("/admin/dbDump/dbDump.zip").toPath()),
                header,
                HttpStatus.OK
        )
    }

    @PostMapping("/procAddMovie")
    fun addMovieProc(@ModelAttribute form: AddMovieForm, builder: UriComponentsBuilder): String {
        val id = form.movieId
        val name = form.movieName
        val date = Date.valueOf(form.date)

        val movie = Movie()
        movie.movieId = id
        movie.name = name
        movie.date = date

        if (movie.movieId.isBlank() || name.isBlank()) {
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
        val id = form.movieId
        val songName = form.songName
        val time = form.time ?: 0
        val endTime = form.endTime ?: 0
        val writer = form.writer

        val song = Song()
        song.movieId = id
        song.songName = songName
        song.time = time
        song.endTime = endTime
        song.writer = writer

        if (song.movieId.isBlank() || songName.isBlank() || writer.isBlank()) {
            // パラメータ不正のため失敗
            return "redirect:" +
                    Commons.getPathUriString(
                            builder,
                            "/admin/addSong",
                            listOf(Pair("error", Optional.empty())))
        }

        try {
            song.movie = movieService.findAllByMovieId(id).first()
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
        val originalId = form.originalId
        val newId = form.movieId
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
            Movie().apply { movieId = newId }
        } else {
            movies.first()
        }
        movie.name = form.movieName
        movie.date = Date.valueOf(form.date)

        movieService.entryMovie(movie)

        return "redirect:" +
                Commons.getPathUriString(
                        builder,
                        "/admin/editMovie/$newId",
                        listOf(Pair("success", Optional.empty())))
    }

    @PostMapping("/procEditSong")
    fun editSongProc(@ModelAttribute form: EditSongForm, builder: UriComponentsBuilder): String {
        val originalId = form.originalId
        val originalTime = form.originalTime
        val newId = form.movieId
        val newTime = form.time ?: 0
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
                movieId = newId
                time = newTime
                try {
                    movie = movieService.findAllByMovieId(newId).first()
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

        song.songName = form.songName
        song.writer = form.writer
        song.endTime = form.endTime ?: 0

        songService.entrySong(song)

        return "redirect:" +
                Commons.getPathUriString(
                        builder,
                        "/admin/editSong/$newId,$newTime",
                        listOf(Pair("success", Optional.empty())))
    }

    @PostMapping("/procDelMovie")
    fun delMovieProc(@ModelAttribute form: DelMovieForm, builder: UriComponentsBuilder): String {
        val id = form.movieId

        val movies = movieService.findAllByMovieId(id)

        if (movies.isEmpty() || movies.first().songs.isNotEmpty()) {
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
        val id = form.movieId
        val time = form.time

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
        val name = form.name
        val content = form.content

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
                this.name = name
                this.content = content
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
        val name = form.name

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
