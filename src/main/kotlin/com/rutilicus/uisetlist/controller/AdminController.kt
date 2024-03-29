package com.rutilicus.uisetlist.controller

import com.opencsv.bean.CsvToBeanBuilder
import com.rutilicus.uisetlist.Commons
import com.rutilicus.uisetlist.Constants
import com.rutilicus.uisetlist.ResourceNotFoundException
import com.rutilicus.uisetlist.SongData
import com.rutilicus.uisetlist.model.*
import com.rutilicus.uisetlist.service.*
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import org.springframework.web.util.UriComponentsBuilder
import java.io.File
import java.io.StringReader
import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.sql.Date
import java.time.format.DateTimeFormatter
import java.util.*

@Controller
@RequestMapping("admin")
class AdminController(val movieService: MovieService,
                      val songService: SongService,
                      val metaTagsService: MetaTagsService,
                      val userdataService: UserdataService,
                      val configService: ConfigService) {
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

    @GetMapping("/config")
    fun configPage(model: Model): String {
        model.addAttribute("transUrl", Commons.transUrl)
        return "config"
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
    @ResponseBody
    fun dbDumpPage(model: Model, builder: UriComponentsBuilder): ResponseEntity<ByteArray> {
        try {
            val files = mutableListOf<Commons.Companion.File>()

            // 動画一覧csv生成
            movieService.findAll().apply {
                val stringBuilder = StringBuilder()
                stringBuilder.append("movieid,name,date\n")
                this.forEach {
                    stringBuilder.append("\"${it.movieId}\",\"${it.name}\",\"${it.date}\"\n")
                }
                files.add(Commons.Companion.File("movie.csv", stringBuilder.toString().toByteArray(Charsets.UTF_8)))
            }

            // 歌一覧csv生成
            songService.findAll().apply {
                val stringBuilder = StringBuilder()
                stringBuilder.append("movieid,time,endTime,songname,writer\n")
                this.forEach {
                    stringBuilder.append("\"${it.movieId}\",\"${it.time}\",\"${it.endTime}\",\"${it.songName}\",\"${it.writer}\"\n")
                }
                files.add(Commons.Companion.File("song.csv", stringBuilder.toString().toByteArray(Charsets.UTF_8)))
            }

            // ユーザーデータcsv生成
            userdataService.findAll().apply {
                val stringBuilder = StringBuilder()
                stringBuilder.append("username,password\n")
                this.forEach {
                    stringBuilder.append("\"${it.username}\",\"${it.password}\"\n")
                }
                files.add(Commons.Companion.File("userdata.csv", stringBuilder.toString().toByteArray(Charsets.UTF_8)))
            }

            // metaタグデータcsv生成
            metaTagsService.findAll().apply {
                val stringBuilder = StringBuilder()
                stringBuilder.append("name,content\n")
                this.forEach {
                    stringBuilder.append("\"${it.name}\",\"${it.content}\"\n")
                }
                files.add(Commons.Companion.File("metatags.csv", stringBuilder.toString().toByteArray(Charsets.UTF_8)))
            }

            // 設定データcsv生成
            configService.findAll().apply {
                val stringBuilder = StringBuilder()
                stringBuilder.append("key,value\n")
                this.forEach {
                    stringBuilder.append("\"${it.key}\",\"${it.value}\"\n")
                }
                files.add(Commons.Companion.File("config.csv", stringBuilder.toString().toByteArray(Charsets.UTF_8)))
            }

            Commons.zip(files).get().let {
                val headers = HttpHeaders().apply {
                    this.add("Content-Type", "application/zip")
                    this.add("Content-Disposition", "attachment; filename=dbDump.zip")
                }

                return ResponseEntity(it, headers, HttpStatus.OK)
            }
        } catch (e: Exception) {
            val headers = HttpHeaders().apply {
                this.add(
                        "Location",
                        "/admin/failDbDump?errorContent=$e")
            }
            return ResponseEntity(headers, HttpStatus.TEMPORARY_REDIRECT)
        }
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

    @GetMapping("/failDbDump")
    fun dumpErrorPage(
            @RequestParam(name = "errorContent", required = false, defaultValue = "") errorContent: String,
            model: Model): String {
        model.addAttribute("trace", errorContent)
        return "adminFailDump"
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

    @PostMapping("/procAddSongCsv")
    fun addSongCsvProc(@ModelAttribute form: AddSongCsvForm, builder: UriComponentsBuilder): String {
        if (form.file == null || form.file!!.isEmpty) {
            // ファイル取得失敗
            return "redirect:" +
                    Commons.getPathUriString(
                        builder,
                        "/admin/addSong",
                        listOf(Pair("error", Optional.empty())))
        }

        val strReader = StringReader(form.file!!.bytes.toString(StandardCharsets.UTF_8))
        val beanList =
            try {
                CsvToBeanBuilder<SongData>(strReader)
                    .withType(SongData::class.java)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build()
                    .parse()
            } catch (e: Exception) {
                // CSVパース失敗
                return "redirect:" +
                        Commons.getPathUriString(
                            builder,
                            "/admin/addSong",
                            listOf(Pair("error", Optional.empty())))
            }

        for (songData in beanList) {
            if (songData.movieId.isBlank() || songData.songName.isBlank() || songData.writer.isBlank()) {
                // 文字列フィールドが空白は不正データのためスキップ
                continue
            }

            try {
                val song = Song()
                song.movieId = songData.movieId
                song.time = songData.time
                song.endTime = songData.endTime
                song.songName = songData.songName
                song.writer = songData.writer

                song.movie = movieService.findAllByMovieId(song.movieId).first()
                songService.addSong(song)
            } catch (e: Exception) {
                // ここでの例外は登録済みデータまたは未登録データのため処理を継続
                e.printStackTrace()
            }
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

    @PostMapping("/procSetConfig")
    fun setConfigProc(@ModelAttribute form: SetConfigForm, builder: UriComponentsBuilder): String {
        val appName = form.appName.ifBlank { Constants.DEFAULT_APP_NAME }
        val transUrl = form.transUrl.ifBlank { "" }

        try {
            val config = mutableListOf<Config>()
            Config().apply {
                this.key = Constants.KEY_APP_NAME
                this.value = appName
                config.add(this)
            }
            Config().apply {
                this.key = Constants.KEY_TRANS_URL
                this.value = transUrl
                config.add(this)
            }

            configService.setConfig(config)

            Commons.appName = appName
            Commons.transUrl = transUrl
        } catch (e:Exception) {
            return "redirect:" +
                    Commons.getPathUriString(
                            builder,
                            "/admin/config",
                            listOf(Pair("setError", Optional.empty())))
        }
        return "redirect:" +
                Commons.getPathUriString(
                        builder,
                        "/admin/config",
                        listOf(Pair("setSuccess", Optional.empty())))
    }
}
