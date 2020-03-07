package com.rutilicus.uisetlist

import org.springframework.web.util.UriComponentsBuilder
import java.util.*

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
    }
}
