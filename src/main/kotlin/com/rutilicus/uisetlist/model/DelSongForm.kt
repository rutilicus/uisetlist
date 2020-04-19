package com.rutilicus.uisetlist.model

import javax.validation.constraints.NotNull

class DelSongForm {
    @NotNull
    var movieId = ""

    @NotNull
    var time = 0
}
