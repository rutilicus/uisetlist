package com.rutilicus.uisetlist

import com.opencsv.bean.CsvBindByName

data class SongData(
    @CsvBindByName(column = "movieId", required = true)
    val movieId: String = "",

    @CsvBindByName(column = "time", required = true)
    val time: Int = 0,

    @CsvBindByName(column = "endTime", required = true)
    val endTime: Int = 0,

    @CsvBindByName(column = "songName", required = true)
    val songName: String = "",

    @CsvBindByName(column = "writer", required = true)
    val writer: String = ""
)
