package com.rutilicus.uisetlist.model

import javax.validation.constraints.NotNull

open class AddSongForm {
    @NotNull
    var movieId = ""

    @NotNull
    var time: Int? = 0
        set(value) {
            if (value != null) {
                field = value
            }
        }

    @NotNull
    var endTime : Int? = 0
        set(value) {
            if (value != null) {
                field = value
            }
        }

    @NotNull
    var songName = ""

    @NotNull
    var writer = ""
}
