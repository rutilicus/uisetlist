package com.rutilicus.uisetlist

import org.springframework.web.util.UriComponentsBuilder
import java.io.BufferedWriter
import java.io.FileOutputStream
import java.io.OutputStreamWriter
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class Commons {
    companion object {
        fun getPathUriString(builder: UriComponentsBuilder, path: String): String =
                builder.path(path).build().toUri().toString()
        fun getPathUriString(
                builder: UriComponentsBuilder,
                path: String,
                params: List<Pair<String, Optional<String>>>): String =
                builder.path(path).apply {
                    params.fold(
                            this,
                            { builder, param ->
                                if (param.second.isPresent)
                                    builder.queryParam(param.first, param.second.orElse(""))
                                else builder.queryParam(param.first)
                            }
                    )
                }.build().encode().toUri().toString()
        fun writeFile(path: String, data: String) {
            BufferedWriter(OutputStreamWriter(FileOutputStream(path), Charsets.UTF_8.newEncoder())).apply {
                this.write(data)
                this.close()
            }
        }
        fun zip(path: String, basePath:String, files: List<String>) {
            ZipOutputStream(FileOutputStream(path)).apply {
                files.forEach {
                    this.putNextEntry(ZipEntry(it))
                    Files.copy(Paths.get(basePath, it), this)
                    this.closeEntry()
                }
                this.close()
            }
        }
    }
}
